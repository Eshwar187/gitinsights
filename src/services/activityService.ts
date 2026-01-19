import api from '../lib/api';

/**
 * Record coding activity
 */
export const recordActivity = async (activityData: {
    date: string;
    hour: number;
    minutes: number;
    language: string;
    repository?: string;
    editor?: string;
    timezone?: string;
}) => {
    const response = await api.post('/api/activity/record', activityData);
    return response.data;
};

/**
 * Get activity heatmap
 */
export const getHeatmap = async (startDate?: string, endDate?: string, timezone?: string) => {
    const response = await api.get('/api/activity/heatmap', {
        params: { startDate, endDate, timezone }
    });
    return response.data;
};

/**
 * Get weekly summary
 */
export const getWeeklySummary = async () => {
    const response = await api.get('/api/activity/weekly');
    return response.data;
};

/**
 * Get language breakdown
 */
export const getLanguageBreakdown = async (startDate?: string, endDate?: string) => {
    const response = await api.get('/api/activity/languages', {
        params: { startDate, endDate }
    });
    return response.data;
};
