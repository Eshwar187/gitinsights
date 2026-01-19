import * as activityService from '../services/activityService.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Record activity
 * POST /api/activity/record
 */
export const recordActivity = asyncHandler(async (req, res) => {
    const { date, hour, minutes, language, repository, githubAccountId, editor, timezone } = req.body;
    const userId = req.user.id;

    const activity = await activityService.recordActivity(userId, {
        date,
        hour,
        minutes,
        language,
        repository,
        githubAccountId,
        editor,
        timezone
    });

    res.status(201).json({
        success: true,
        data: activity
    });
});

/**
 * Get activity heatmap
 * GET /api/activity/heatmap
 */
export const getHeatmap = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate, timezone } = req.query;

    // Default to last 7 days
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const result = await activityService.getHeatmap(userId, start, end, timezone || 'UTC');

    res.json({
        success: true,
        data: result
    });
});

/**
 * Get weekly summary
 * GET /api/activity/weekly
 */
export const getWeeklySummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const summary = await activityService.getWeeklySummary(userId);

    res.json({
        success: true,
        data: summary
    });
});

/**
 * Get language breakdown
 * GET /api/activity/languages
 */
export const getLanguageBreakdown = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const languages = await activityService.getLanguageBreakdown(userId, start, end);

    res.json({
        success: true,
        data: languages
    });
});
