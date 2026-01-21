import supabaseAdmin from '../config/database.js';
import * as githubService from '../services/githubService.js';
import { asyncHandler } from '../utils/errors.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { encrypt } from '../utils/encryption.js';
import logger from '../utils/logger.js';

/**
 * Helper: Get user's primary GitHub account
 */
async function getUserGitHubAccount(userId) {
    const { data: account, error } = await supabaseAdmin
        .from('github_accounts')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (error || !account) {
        throw new NotFoundError('No GitHub account connected. Please connect your GitHub account first.');
    }

    return account;
}

/**
 * Get repositories for logged-in user
 */
export const getUserRepositories = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);
    const { page = 1, limit = 20, sort = 'stars_count' } = req.query;

    const offset = (page - 1) * limit;

    logger.info(`Fetching repositories for account ${account.id}, page ${page}, limit ${limit}`);

    const { data: repositories, error, count } = await supabaseAdmin
        .from('repositories')
        .select('*', { count: 'exact' })
        .eq('github_account_id', account.id)
        .order(sort, { ascending: false })
        .range(offset, offset + limit - 1);

    logger.info(`Found ${repositories?.length || 0} repositories, total count: ${count}`);

    if (error) {
        logger.error('Failed to fetch repositories:', error);
        throw new Error('Failed to fetch repositories');
    }

    res.json({
        success: true,
        data: repositories || [],
        total: count
    });
});

/**
 * Connect GitHub account
 */
export const connectAccount = asyncHandler(async (req, res) => {
    const { code } = req.body;

    // This would typically exchange the code for an access token
    // For now, assuming the OAuth flow is handled by passport

    res.json({
        success: true,
        message: 'GitHub account connected successfully'
    });
});

/**
 * Sync GitHub data for an account
 */
export const syncData = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { accountId } = req.body;

    // ========== SYNC RATE LIMITING ==========
    // Define sync limits per subscription tier
    const SYNC_LIMITS = {
        free: 1,
        pro: 5,
        premium: Infinity
    };

    // Get user's subscription tier and sync count
    const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('subscription_tier, syncs_today, last_sync_date')
        .eq('id', userId)
        .single();

    if (userError) {
        logger.error('Failed to fetch user data for sync limit check:', userError);
        throw new Error('Failed to verify sync limits');
    }

    const tier = userData?.subscription_tier || 'free';
    const syncLimit = SYNC_LIMITS[tier] || SYNC_LIMITS.free;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Reset sync count if it's a new day
    let syncsToday = userData?.syncs_today || 0;
    if (userData?.last_sync_date !== today) {
        syncsToday = 0;
    }

    // Check if user has exceeded their daily limit
    if (syncsToday >= syncLimit) {
        logger.warn(`User ${userId} exceeded sync limit (${syncsToday}/${syncLimit})`);
        return res.status(429).json({
            success: false,
            error: 'Daily sync limit reached',
            message: `You've used all ${syncLimit} daily sync${syncLimit === 1 ? '' : 's'}. ${tier === 'free' ? 'Upgrade to Pro for 5 syncs/day!' : tier === 'pro' ? 'Upgrade to Premium for unlimited syncs!' : ''}`,
            syncsToday,
            syncLimit,
            tier
        });
    }
    // ========== END SYNC RATE LIMITING ==========


    // Get GitHub account
    let query = supabaseAdmin
        .from('github_accounts')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null);

    if (accountId) {
        query = query.eq('id', accountId);
    }

    const { data: accounts, error } = await query;

    if (error || !accounts || accounts.length === 0) {
        throw new NotFoundError('GitHub account not found');
    }

    // Sync each account
    const syncResults = [];

    for (const account of accounts) {
        try {
            // Import decryption utility
            const { decrypt } = await import('../utils/encryption.js');

            // Decrypt the access token from database
            const accessToken = decrypt(account.access_token);

            logger.info(`Starting sync for account: ${account.username}`, {
                accountId: account.id,
                hasToken: !!accessToken,
                tokenLength: accessToken ? accessToken.length : 0
            });

            // Update sync status
            await supabaseAdmin
                .from('github_accounts')
                .update({ sync_status: 'syncing' })
                .eq('id', account.id);

            // Fetch user profile
            logger.info(`Fetching GitHub profile for ${account.username}`);
            const profile = await githubService.fetchUserProfile(accessToken);
            logger.info(`Profile fetched: ${profile.login}`);

            // Update profile data
            await supabaseAdmin
                .from('github_accounts')
                .update({ profile_data: profile })
                .eq('id', account.id);

            // Fetch repositories
            logger.info(`Fetching repositories for ${account.username}`);
            const repos = await githubService.fetchRepositories(accessToken, account.username);
            logger.info(`Found ${repos.length} repositories`);

            // CRITICAL: Delete ALL existing repositories for this account before inserting new ones
            // This ensures we don't accumulate old repos when switching GitHub accounts
            logger.info(`Clearing old repositories for account ${account.id}`);
            await supabaseAdmin
                .from('repositories')
                .delete()
                .eq('github_account_id', account.id);

            // Store repositories
            let storedCount = 0;
            for (const repo of repos) {
                try {
                    // Fetch language stats
                    const languages = await githubService.fetchLanguageStats(
                        accessToken,
                        account.username,
                        repo.name
                    );

                    const repoData = {
                        github_account_id: account.id,
                        github_repo_id: repo.github_repo_id,
                        name: repo.name,
                        full_name: repo.full_name,
                        description: repo.description,
                        url: repo.url,
                        homepage: repo.homepage,
                        stars_count: repo.stars_count || 0,
                        forks_count: repo.forks_count || 0,
                        watchers_count: repo.watchers_count || 0,
                        open_issues_count: repo.open_issues_count || 0,
                        language: repo.language,
                        topics: repo.topics || [],
                        is_private: repo.is_private || false,
                        is_fork: repo.is_fork || false,
                        is_archived: repo.is_archived || false,
                        github_created_at: repo.github_created_at,
                        github_updated_at: repo.github_updated_at,
                        github_pushed_at: repo.github_pushed_at,
                        has_readme: repo.has_readme || true,
                        has_license: repo.has_license || false,
                        languages: languages
                    };

                    const { error: upsertError } = await supabaseAdmin
                        .from('repositories')
                        .upsert(repoData, {
                            onConflict: 'github_account_id,github_repo_id'
                        });

                    if (upsertError) {
                        logger.error(`Failed to store repo ${repo.name}:`, upsertError);
                    } else {
                        storedCount++;
                    }
                } catch (repoError) {
                    logger.error(`Error processing repo ${repo.name}:`, repoError.message);
                }
            }
            logger.info(`Stored ${storedCount} of ${repos.length} repositories`);

            // Fetch contributions
            const contributions = await githubService.fetchContributions(
                accessToken,
                account.username
            );

            // Store daily contributions
            for (const contrib of contributions.daily) {
                await supabaseAdmin
                    .from('contributions')
                    .upsert({
                        github_account_id: account.id,
                        contribution_date: contrib.date,
                        commits_count: contrib.count
                    }, {
                        onConflict: 'github_account_id,contribution_date'
                    });
            }

            // Fetch pull requests
            const pullRequests = await githubService.fetchPullRequests(
                accessToken,
                account.username
            );

            // Fetch issues
            const issues = await githubService.fetchIssues(
                accessToken,
                account.username
            );

            // Fetch code reviews
            const codeReviewsCount = await githubService.fetchCodeReviews(
                accessToken,
                account.username
            );

            // Calculate analytics scores
            const analyticsService = await import('../services/analyticsService.js');
            await analyticsService.calculateAllScores(account.id);
            await analyticsService.aggregateLanguageStats(account.id);
            await analyticsService.assignBadges(account.id);

            // Calculate PR stats
            const prsMerged = pullRequests.filter(pr => pr.merged_at).length;
            const prsOpened = pullRequests.length;

            // Update sync status AND persist PR/Review stats
            await supabaseAdmin
                .from('github_accounts')
                .update({
                    sync_status: 'completed',
                    last_synced_at: new Date().toISOString(),
                    sync_error: null,
                    // Persist PR and Review stats (Premium feature)
                    prs_merged: prsMerged,
                    prs_opened: prsOpened,
                    code_reviews: codeReviewsCount,
                    issues_opened: issues.length
                })
                .eq('id', account.id);

            syncResults.push({
                accountId: account.id,
                username: account.username,
                status: 'success',
                stats: {
                    repositories: repos.length,
                    contributions: contributions.total,
                    pullRequests: prsOpened,
                    prsMerged: prsMerged,
                    issues: issues.length,
                    codeReviews: codeReviewsCount
                }
            });

            logger.info(`Successfully synced GitHub account: ${account.username}`);

            // ========== INCREMENT SYNC COUNT ==========
            await supabaseAdmin
                .from('users')
                .update({
                    syncs_today: syncsToday + 1,
                    last_sync_date: today
                })
                .eq('id', userId);
            logger.info(`Updated sync count for user ${userId}: ${syncsToday + 1}`);
        } catch (error) {
            logger.error(`Failed to sync GitHub account ${account.username}:`, error);

            await supabaseAdmin
                .from('github_accounts')
                .update({
                    sync_status: 'failed',
                    sync_error: error.message
                })
                .eq('id', account.id);

            syncResults.push({
                accountId: account.id,
                username: account.username,
                status: 'failed',
                error: error.message
            });
        }
    }

    res.json({
        success: true,
        data: syncResults
    });
});

/**
 * Get user's GitHub accounts
 */
export const getAccounts = asyncHandler(async (req, res) => {
    const { data: accounts, error } = await supabaseAdmin
        .from('github_accounts')
        .select('id, username, profile_data, last_synced_at, sync_status, created_at')
        .eq('user_id', req.user.id)
        .is('deleted_at', null);

    if (error) {
        throw new Error('Failed to fetch GitHub accounts');
    }

    res.json({
        success: true,
        data: accounts
    });
});

/**
 * Get repositories for a GitHub account
 */
export const getRepositories = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { page = 1, limit = 20, sort = 'stars_count' } = req.query;

    // Verify account belongs to user
    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const offset = (page - 1) * limit;

    const { data: repositories, error, count } = await supabaseAdmin
        .from('repositories')
        .select('*', { count: 'exact' })
        .eq('github_account_id', accountId)
        .is('deleted_at', null)
        .order(sort, { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        throw new Error('Failed to fetch repositories');
    }

    res.json({
        success: true,
        data: {
            repositories,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        }
    });
});

/**
 * Get contributions heatmap
 */
export const getContributions = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify account belongs to user
    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    let query = supabaseAdmin
        .from('contributions')
        .select('*')
        .eq('github_account_id', accountId)
        .order('contribution_date', { ascending: false });

    if (startDate) {
        query = query.gte('contribution_date', startDate);
    }
    if (endDate) {
        query = query.lte('contribution_date', endDate);
    }

    const { data: contributions, error } = await query;

    if (error) {
        throw new Error('Failed to fetch contributions');
    }

    res.json({
        success: true,
        data: contributions
    });
});

/**
 * Disconnect GitHub account
 */
export const disconnectAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    // Soft delete
    const { error } = await supabaseAdmin
        .from('github_accounts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', accountId)
        .eq('user_id', req.user.id);

    if (error) {
        throw new Error('Failed to disconnect GitHub account');
    }

    res.json({
        success: true,
        message: 'GitHub account disconnected successfully'
    });
});

/**
 * Get rate limit status
 */
export const getRateLimit = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('access_token')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const rateLimit = await githubService.getRateLimitStatus(account.access_token);

    res.json({
        success: true,
        data: rateLimit
    });
});
