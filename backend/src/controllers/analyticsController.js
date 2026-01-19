import * as analyticsService from '../services/analyticsService.js';
import * as aiService from '../services/aiService.js';
import supabaseAdmin from '../config/database.js';
import { asyncHandler } from '../utils/errors.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Helper: Get user's primary GitHub account
 */
async function getUserGitHubAccount(userId) {
    const { data: account, error } = await supabaseAdmin
        .from('github_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (error || !account) {
        throw new NotFoundError('No GitHub account connected. Please connect your GitHub account first.');
    }

    return account;
}

/**
 * Get developer scores for logged-in user
 */
export const getUserScores = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);

    // Get analytics
    const { data: analytics, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('github_account_id', account.id)
        .single();

    if (error || !analytics) {
        // Calculate scores if not exists
        const scores = await analyticsService.calculateAllScores(account.id);
        return res.json({ success: true, data: scores });
    }

    res.json({
        success: true,
        data: analytics
    });
});

/**
 * Get developer scores for a GitHub account (original)
 */
export const getDeveloperScores = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

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

    // Get analytics
    const { data: analytics, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('github_account_id', accountId)
        .single();

    if (error || !analytics) {
        // Calculate scores if not exists
        const scores = await analyticsService.calculateAllScores(accountId);
        return res.json({ success: true, data: scores });
    }

    res.json({
        success: true,
        data: analytics
    });
});

/**
 * Recalculate scores
 */
export const recalculateScores = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const scores = await analyticsService.calculateAllScores(accountId);
    await analyticsService.aggregateLanguageStats(accountId);
    await analyticsService.assignBadges(accountId);

    res.json({
        success: true,
        data: scores
    });
});

/**
 * Get contribution heatmap
 */
export const getHeatmap = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { year } = req.query;

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
        .order('contribution_date', { ascending: true });

    if (year) {
        query = query
            .gte('contribution_date', `${year}-01-01`)
            .lte('contribution_date', `${year}-12-31`);
    }

    const { data: contributions } = await query;

    res.json({
        success: true,
        data: contributions || []
    });
});

/**
 * Get language statistics
 */
export const getLanguageStats = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('language_stats, top_languages')
        .eq('github_account_id', accountId)
        .single();

    res.json({
        success: true,
        data: {
            languageStats: analytics?.language_stats || {},
            topLanguages: analytics?.top_languages || []
        }
    });
});

/**
 * Get badges
 */
export const getBadges = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('badges')
        .eq('github_account_id', accountId)
        .single();

    res.json({
        success: true,
        data: analytics?.badges || []
    });
});

/**
 * Get AI insights
 */
export const getAIInsights = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('profile_summary, strengths, focus_areas, recommendations, ai_insights_generated_at')
        .eq('github_account_id', accountId)
        .single();

    res.json({
        success: true,
        data: analytics || {}
    });
});

/**
 * Regenerate AI insights
 */
export const regenerateInsights = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { data: account } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

    if (!account) {
        throw new NotFoundError('GitHub account not found');
    }

    const insights = await aiService.generateAllInsights(accountId);
    await aiService.trackAIUsage(req.user.id);

    res.json({
        success: true,
        data: insights
    });
});

/**
 * Get heatmap for logged-in user
 */
export const getUserHeatmap = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);
    const { startDate, endDate } = req.query;

    let query = supabaseAdmin
        .from('contributions')
        .select('*')
        .eq('github_account_id', account.id)
        .order('contribution_date', { ascending: true });

    if (startDate && endDate) {
        query = query
            .gte('contribution_date', startDate)
            .lte('contribution_date', endDate);
    }

    const { data: contributions } = await query;

    res.json({
        success: true,
        data: contributions || []
    });
});

/**
 * Get language stats for logged-in user
 */
export const getUserLanguageStats = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('language_stats, top_languages')
        .eq('github_account_id', account.id)
        .single();

    // Format for frontend pie chart
    const languageData = analytics?.top_languages || [];
    const formattedData = languageData.map(lang => ({
        language: lang.language || lang.name,
        percentage: lang.percentage || lang.value || 0,
        bytes: lang.bytes || 0
    }));

    res.json({
        success: true,
        data: formattedData
    });
});

/**
 * Get badges for logged-in user
 */
export const getUserBadges = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('badges')
        .eq('github_account_id', account.id)
        .single();

    res.json({
        success: true,
        data: analytics?.badges || []
    });
});

/**
 * Get AI insights for logged-in user
 */
export const getUserAIInsights = asyncHandler(async (req, res) => {
    const account = await getUserGitHubAccount(req.user.id);

    const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('profile_summary, strengths, focus_areas, recommendations, ai_insights_generated_at')
        .eq('github_account_id', account.id)
        .single();

    res.json({
        success: true,
        data: analytics || {}
    });
});
