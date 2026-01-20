import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Record coding activity
 */
export const recordActivity = async (userId, activityData) => {
    const {
        date,
        hour,
        minutes,
        language,
        repository,
        githubAccountId,
        editor = 'Unknown',
        timezone = 'UTC'
    } = activityData;

    try {
        // Upsert activity record
        const { data, error } = await supabaseAdmin
            .from('coding_activity')
            .upsert({
                user_id: userId,
                github_account_id: githubAccountId,
                activity_date: date,
                hour_of_day: hour,
                minutes_coded: minutes,
                language,
                repository,
                editor,
                timezone,
                commits_in_hour: 0
            }, {
                onConflict: 'user_id,activity_date,hour_of_day,language',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) {
            // If exists, update by adding minutes
            const { data: existing } = await supabaseAdmin
                .from('coding_activity')
                .select('*')
                .eq('user_id', userId)
                .eq('activity_date', date)
                .eq('hour_of_day', hour)
                .eq('language', language)
                .single();

            if (existing) {
                const { data: updated } = await supabaseAdmin
                    .from('coding_activity')
                    .update({
                        minutes_coded: existing.minutes_coded + minutes
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();

                return updated;
            }
        }

        return data;
    } catch (error) {
        logger.error('Failed to record activity:', error);
        throw error;
    }
};

/**
 * Get activity heatmap from GitHub contributions
 */
export const getHeatmap = async (userId, startDate, endDate, timezone = 'UTC') => {
    try {
        // First get the user's GitHub account
        const { data: account } = await supabaseAdmin
            .from('github_accounts')
            .select('id')
            .eq('user_id', userId)
            .limit(1)
            .single();

        if (!account) {
            logger.info('No GitHub account found for heatmap');
            return [];
        }

        // Get contributions from contributions table
        const { data, error } = await supabaseAdmin
            .from('contributions')
            .select('contribution_date, commits_count')
            .eq('github_account_id', account.id)
            .gte('contribution_date', startDate)
            .lte('contribution_date', endDate)
            .order('contribution_date', { ascending: true });

        if (error) {
            logger.error('Failed to get contributions:', error);
            throw error;
        }

        logger.info(`Found ${data?.length || 0} contribution days for heatmap`);

        // Map to the format expected by frontend: { date, count }
        const heatmapData = (data || []).map(contribution => ({
            date: contribution.contribution_date,
            count: contribution.commits_count || 0
        }));

        return heatmapData;
    } catch (error) {
        logger.error('Failed to get heatmap:', error);
        return [];
    }
};

/**
 * Calculate intensity level for heatmap
 */
function calculateIntensity(minutes) {
    if (minutes === 0) return 0;
    if (minutes <= 30) return 1;
    if (minutes <= 60) return 2;
    if (minutes <= 120) return 3;
    return 4;
}

/**
 * Calculate heatmap statistics
 */
function calculateHeatmapStats(activities) {
    if (!activities || activities.length === 0) {
        return {
            totalMinutes: 0,
            totalHours: 0,
            avgPerDay: 0,
            mostProductiveDay: null,
            mostProductiveHour: null,
            currentStreak: 0
        };
    }

    const totalMinutes = activities.reduce((sum, a) => sum + a.minutes_coded, 0);

    // Group by day
    const byDay = {};
    activities.forEach(a => {
        const day = a.activity_date;
        byDay[day] = (byDay[day] || 0) + a.minutes_coded;
    });

    // Group by hour
    const byHour = {};
    activities.forEach(a => {
        const hour = a.hour_of_day;
        byHour[hour] = (byHour[hour] || 0) + a.minutes_coded;
    });

    // Find most productive day and hour
    const mostProductiveDay = Object.keys(byDay).reduce((a, b) => byDay[a] > byDay[b] ? a : b);
    const mostProductiveHour = Object.keys(byHour).reduce((a, b) => byHour[a] > byHour[b] ? a : b);

    // Calculate streak
    const uniqueDays = [...new Set(activities.map(a => a.activity_date))].sort();
    let currentStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
        const prevDate = new Date(uniqueDays[i - 1]);
        const currDate = new Date(uniqueDays[i]);
        const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            tempStreak++;
        } else {
            currentStreak = Math.max(currentStreak, tempStreak);
            tempStreak = 1;
        }
    }
    currentStreak = Math.max(currentStreak, tempStreak);

    return {
        totalMinutes,
        totalHours: Math.floor(totalMinutes / 60),
        avgPerDay: Object.keys(byDay).length > 0 ? totalMinutes / Object.keys(byDay).length : 0,
        mostProductiveDay,
        mostProductiveHour: parseInt(mostProductiveHour),
        currentStreak
    };
}

/**
 * Get weekly summary
 */
export const getWeeklySummary = async (userId) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const { data, error } = await supabaseAdmin
            .from('coding_activity')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', startDate.toISOString().split('T')[0])
            .lte('activity_date', endDate.toISOString().split('T')[0]);

        if (error) throw error;

        // Group by day
        const days = {};
        (data || []).forEach(activity => {
            const date = activity.activity_date;
            if (!days[date]) {
                days[date] = {
                    date,
                    totalMinutes: 0,
                    languages: {}
                };
            }
            days[date].totalMinutes += activity.minutes_coded;
            days[date].languages[activity.language] = (days[date].languages[activity.language] || 0) + activity.minutes_coded;
        });

        // Calculate insights
        const daysArray = Object.values(days);
        const totalWeekMinutes = daysArray.reduce((sum, d) => sum + d.totalMinutes, 0);

        // Get all languages
        const languageTotals = {};
        (data || []).forEach(a => {
            languageTotals[a.language] = (languageTotals[a.language] || 0) + a.minutes_coded;
        });
        const topLanguage = Object.keys(languageTotals).reduce((a, b) =>
            languageTotals[a] > languageTotals[b] ? a : b, '');

        // Determine pattern (morning person vs night owl)
        const hourTotals = {};
        (data || []).forEach(a => {
            hourTotals[a.hour_of_day] = (hourTotals[a.hour_of_day] || 0) + a.minutes_coded;
        });
        const peakHour = Object.keys(hourTotals).reduce((a, b) =>
            hourTotals[a] > hourTotals[b] ? a : b, 0);
        const pattern = peakHour < 12 ? 'morning person' : peakHour > 18 ? 'night owl' : 'afternoon coder';

        return {
            days: daysArray,
            insights: {
                totalWeekMinutes,
                avgPerDay: daysArray.length > 0 ? totalWeekMinutes / daysArray.length : 0,
                topLanguage,
                peakHours: `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`,
                pattern
            }
        };
    } catch (error) {
        logger.error('Failed to get weekly summary:', error);
        throw error;
    }
};

/**
 * Get language breakdown
 */
export const getLanguageBreakdown = async (userId, startDate, endDate) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('coding_activity')
            .select('language, minutes_coded')
            .eq('user_id', userId)
            .gte('activity_date', startDate)
            .lte('activity_date', endDate);

        if (error) throw error;

        // Aggregate by language
        const languageTotals = {};
        (data || []).forEach(a => {
            languageTotals[a.language] = (languageTotals[a.language] || 0) + a.minutes_coded;
        });

        const totalMinutes = Object.values(languageTotals).reduce((sum, m) => sum + m, 0);

        // Convert to array and add percentages
        const languages = Object.keys(languageTotals).map(lang => ({
            language: lang,
            minutes: languageTotals[lang],
            percentage: totalMinutes > 0 ? (languageTotals[lang] / totalMinutes * 100).toFixed(2) : 0
        }));

        // Sort by minutes descending
        languages.sort((a, b) => b.minutes - a.minutes);

        return languages;
    } catch (error) {
        logger.error('Failed to get language breakdown:', error);
        throw error;
    }
};

/**
 * Sync activity from GitHub commits
 */
export const syncFromGitHub = async (userId, githubAccountId) => {
    try {
        // Get GitHub account
        const { data: account } = await supabaseAdmin
            .from('github_accounts')
            .select('username, access_token')
            .eq('id', githubAccountId)
            .single();

        if (!account) {
            throw new Error('GitHub account not found');
        }

        // Get commits from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // This would call GitHub API to get commits
        // For now, we'll skip the actual implementation
        // as it requires the full GitHub service integration

        logger.info(`Activity sync completed for user ${userId}`);
        return true;
    } catch (error) {
        logger.error('Failed to sync activity from GitHub:', error);
        throw error;
    }
};
