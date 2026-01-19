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

    const { data: repositories, error, count } = await supabaseAdmin
        .from('repositories')
        .select('*', { count: 'exact' })
        .eq('github_account_id', account.id)
        .is('deleted_at', null)
        .order(sort, { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        throw new Error('Failed to fetch repositories');
    }

    res.json({
        success: true,
        data: repositories || []
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
            // Update sync status
            await supabaseAdmin
                .from('github_accounts')
                .update({ sync_status: 'syncing' })
                .eq('id', account.id);

            // Fetch user profile
            const profile = await githubService.fetchUserProfile(account.access_token);

            // Update profile data
            await supabaseAdmin
                .from('github_accounts')
                .update({ profile_data: profile })
                .eq('id', account.id);

            // Fetch repositories
            const repos = await githubService.fetchRepositories(account.access_token, account.username);

            // Store repositories
            for (const repo of repos) {
                // Fetch language stats
                const languages = await githubService.fetchLanguageStats(
                    account.access_token,
                    account.username,
                    repo.name
                );

                await supabaseAdmin
                    .from('repositories')
                    .upsert({
                        github_account_id: account.id,
                        ...repo,
                        languages
                    }, {
                        onConflict: 'github_account_id,github_repo_id'
                    });
            }

            // Fetch contributions
            const contributions = await githubService.fetchContributions(
                account.access_token,
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
                account.access_token,
                account.username
            );

            // Fetch issues
            const issues = await githubService.fetchIssues(
                account.access_token,
                account.username
            );

            // Fetch code reviews
            const codeReviewsCount = await githubService.fetchCodeReviews(
                account.access_token,
                account.username
            );

            // Update sync status
            await supabaseAdmin
                .from('github_accounts')
                .update({
                    sync_status: 'completed',
                    last_synced_at: new Date().toISOString(),
                    sync_error: null
                })
                .eq('id', account.id);

            syncResults.push({
                accountId: account.id,
                username: account.username,
                status: 'success',
                stats: {
                    repositories: repos.length,
                    contributions: contributions.total,
                    pullRequests: pullRequests.length,
                    issues: issues.length,
                    codeReviews: codeReviewsCount
                }
            });

            logger.info(`Successfully synced GitHub account: ${account.username}`);
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
