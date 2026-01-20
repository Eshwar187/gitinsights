import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Calculate Activity Score (0-100)
 * Based on commits, PRs, issues, reviews, and consistency
 */
export const calculateActivityScore = async (githubAccountId) => {
    try {
        // Get contribution stats
        const { data: contributions } = await supabaseAdmin
            .from('contributions')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .gte('contribution_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

        if (!contributions || contributions.length === 0) return 0;

        const totalCommits = contributions.reduce((sum, c) => sum + c.commits_count, 0);
        const totalPRs = contributions.reduce((sum, c) => sum + c.pull_requests_count, 0);
        const totalIssues = contributions.reduce((sum, c) => sum + c.issues_count, 0);
        const totalReviews = contributions.reduce((sum, c) => sum + c.code_reviews_count, 0);

        // Weighted scoring
        const commitScore = Math.min((totalCommits / 500) * 40, 40);
        const prScore = Math.min((totalPRs / 50) * 25, 25);
        const issueScore = Math.min((totalIssues / 50) * 15, 15);
        const reviewScore = Math.min((totalReviews / 50) * 20, 20);

        return Math.round(commitScore + prScore + issueScore + reviewScore);
    } catch (error) {
        logger.error('Failed to calculate activity score:', error);
        return 0;
    }
};

/**
 * Calculate Quality Score (0-100)
 * Based on commit quality, tests, documentation
 */
export const calculateQualityScore = async (githubAccountId) => {
    try {
        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .is('deleted_at', null);

        if (!repos || repos.length === 0) return 0;

        const hasReadme = repos.filter(r => r.has_readme).length;
        const hasLicense = repos.filter(r => r.has_license).length;
        const hasTests = repos.filter(r => r.has_tests).length;
        const hasContributing = repos.filter(r => r.has_contributing).length;

        const readmeScore = (hasReadme / repos.length) * 30;
        const licenseScore = (hasLicense / repos.length) * 20;
        const testScore = (hasTests / repos.length) * 35;
        const contributingScore = (hasContributing / repos.length) * 15;

        return Math.round(readmeScore + licenseScore + testScore + contributingScore);
    } catch (error) {
        logger.error('Failed to calculate quality score:', error);
        return 0;
    }
};

/**
 * Calculate Impact Score (0-100)
 * Based on stars, forks, contributors attracted
 */
export const calculateImpactScore = async (githubAccountId) => {
    try {
        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .is('deleted_at', null);

        if (!repos || repos.length === 0) return 0;

        const totalStars = repos.reduce((sum, r) => sum + r.stars_count, 0);
        const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

        const starScore = Math.min((totalStars / 100) * 50, 50);
        const forkScore = Math.min((totalForks / 50) * 30, 30);
        const repoScore = Math.min((repos.length / 20) * 20, 20);

        return Math.round(starScore + forkScore + repoScore);
    } catch (error) {
        logger.error('Failed to calculate impact score:', error);
        return 0;
    }
};

/**
 * Calculate Collaboration Score (0-100)
 * Based on PRs to others, code reviews, team work
 */
export const calculateCollaborationScore = async (githubAccountId) => {
    try {
        const { data: contributions } = await supabaseAdmin
            .from('contributions')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .gte('contribution_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

        if (!contributions || contributions.length === 0) return 0;

        const totalPRs = contributions.reduce((sum, c) => sum + c.pull_requests_count, 0);
        const totalReviews = contributions.reduce((sum, c) => sum + c.code_reviews_count, 0);

        const prScore = Math.min((totalPRs / 30) * 50, 50);
        const reviewScore = Math.min((totalReviews / 30) * 50, 50);

        return Math.round(prScore + reviewScore);
    } catch (error) {
        logger.error('Failed to calculate collaboration score:', error);
        return 0;
    }
};

/**
 * Calculate Consistency Score (0-100)
 * Based on active days, streaks, regularity
 */
export const calculateConsistencyScore = async (githubAccountId) => {
    try {
        const { data: contributions } = await supabaseAdmin
            .from('contributions')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .gte('contribution_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
            .order('contribution_date', { ascending: true });

        if (!contributions || contributions.length === 0) return 0;

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate = null;

        contributions.forEach(contrib => {
            const date = new Date(contrib.contribution_date);

            if (lastDate) {
                const dayDiff = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }

            lastDate = date;
        });

        longestStreak = Math.max(longestStreak, tempStreak);
        currentStreak = tempStreak;

        const activeDays = contributions.length;
        const streakScore = Math.min((longestStreak / 30) * 50, 50);
        const activeDaysScore = Math.min((activeDays / 200) * 50, 50);

        return Math.round(streakScore + activeDaysScore);
    } catch (error) {
        logger.error('Failed to calculate consistency score:', error);
        return 0;
    }
};

/**
 * Calculate all scores and update analytics
 */
export const calculateAllScores = async (githubAccountId) => {
    try {
        const activityScore = await calculateActivityScore(githubAccountId);
        const qualityScore = await calculateQualityScore(githubAccountId);
        const impactScore = await calculateImpactScore(githubAccountId);
        const collaborationScore = await calculateCollaborationScore(githubAccountId);
        const consistencyScore = await calculateConsistencyScore(githubAccountId);

        const overallScore = Math.round(
            (activityScore + qualityScore + impactScore + collaborationScore + consistencyScore) / 5
        );

        // Get contribution stats
        const { data: contributions } = await supabaseAdmin
            .from('contributions')
            .select('*')
            .eq('github_account_id', githubAccountId);

        const totalCommits = contributions?.reduce((sum, c) => sum + (c.commits_count || 0), 0) || 0;

        // Get repository stats
        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .is('deleted_at', null);

        const totalRepos = repos?.length || 0;
        const totalStars = repos?.reduce((sum, r) => sum + (r.stars_count || 0), 0) || 0;
        const totalForks = repos?.reduce((sum, r) => sum + (r.forks_count || 0), 0) || 0;

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        const activeDays = contributions?.length || 0;

        const analyticsData = {
            github_account_id: githubAccountId,
            activity_score: activityScore,
            quality_score: qualityScore,
            impact_score: impactScore,
            collaboration_score: collaborationScore,
            consistency_score: consistencyScore,
            overall_score: overallScore,
            total_commits: totalCommits,
            total_repos: totalRepos,
            total_stars: totalStars,
            total_forks: totalForks,
            total_contributions: totalCommits,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            active_days: activeDays,
            last_calculated_at: new Date().toISOString()
        };

        // Update analytics table
        await supabaseAdmin
            .from('analytics')
            .upsert(analyticsData, {
                onConflict: 'github_account_id'
            });

        logger.info(`Analytics calculated for account ${githubAccountId}: ${totalRepos} repos, ${totalCommits} commits, ${totalStars} stars`);

        return analyticsData;
    } catch (error) {
        logger.error('Failed to calculate all scores:', error);
        throw error;
    }
};

/**
 * Aggregate language statistics
 */
export const aggregateLanguageStats = async (githubAccountId) => {
    try {
        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('languages')
            .eq('github_account_id', githubAccountId)
            .is('deleted_at', null);

        const languageStats = {};

        repos?.forEach(repo => {
            if (repo.languages) {
                Object.entries(repo.languages).forEach(([lang, bytes]) => {
                    languageStats[lang] = (languageStats[lang] || 0) + bytes;
                });
            }
        });

        const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);

        const languagePercentages = {};
        Object.entries(languageStats).forEach(([lang, bytes]) => {
            languagePercentages[lang] = {
                bytes,
                percentage: ((bytes / totalBytes) * 100).toFixed(2)
            };
        });

        const topLanguages = Object.entries(languagePercentages)
            .sort((a, b) => b[1].bytes - a[1].bytes)
            .slice(0, 5)
            .map(([lang]) => lang);

        // Update analytics
        await supabaseAdmin
            .from('analytics')
            .update({
                language_stats: languagePercentages,
                top_languages: topLanguages
            })
            .eq('github_account_id', githubAccountId);

        return { languageStats: languagePercentages, topLanguages };
    } catch (error) {
        logger.error('Failed to aggregate language stats:', error);
        throw error;
    }
};

/**
 * Assign badges based on achievements
 */
export const assignBadges = async (githubAccountId) => {
    try {
        const badges = [];

        // Get analytics data
        const { data: analytics } = await supabaseAdmin
            .from('analytics')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .single();

        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('*')
            .eq('github_account_id', githubAccountId);

        const totalStars = repos?.reduce((sum, r) => sum + r.stars_count, 0) || 0;

        // Achievement badges
        if (repos && repos.length >= 100) badges.push({ id: 'repo_100', name: '100+ Repositories', icon: '📚' });
        if (repos && repos.length >= 50) badges.push({ id: 'repo_50', name: '50+ Repositories', icon: '📖' });
        if (totalStars >= 1000) badges.push({ id: 'stars_1k', name: '1K+ Stars', icon: '⭐' });
        if (totalStars >= 100) badges.push({ id: 'stars_100', name: '100+ Stars', icon: '🌟' });
        if (analytics?.longest_streak >= 30) badges.push({ id: 'streak_30', name: '30 Day Streak', icon: '🔥' });
        if (analytics?.longest_streak >= 100) badges.push({ id: 'streak_100', name: '100 Day Streak', icon: '🚀' });
        if (analytics?.overall_score >= 90) badges.push({ id: 'elite', name: 'Elite Developer', icon: '👑' });
        if (analytics?.overall_score >= 75) badges.push({ id: 'expert', name: 'Expert Developer', icon: '💎' });

        // Update analytics with badges
        await supabaseAdmin
            .from('analytics')
            .update({ badges })
            .eq('github_account_id', githubAccountId);

        return badges;
    } catch (error) {
        logger.error('Failed to assign badges:', error);
        return [];
    }
};
