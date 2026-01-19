import api from '../lib/api';

/**
 * Get developer scores
 */
export const getDeveloperScores = async () => {
    const response = await api.get('/api/analytics/scores');
    return response.data;
};

/**
 * Get contribution heatmap
 */
export const getHeatmap = async (year?: number) => {
    const response = await api.get('/api/analytics/heatmap', {
        params: { year }
    });
    return response.data;
};

/**
 * Get language statistics
 */
export const getLanguageStats = async () => {
    const response = await api.get('/api/analytics/languages');
    return response.data;
};

/**
 * Get badges
 */
export const getBadges = async () => {
    const response = await api.get('/api/analytics/badges');
    return response.data;
};

/**
 * Generate AI insights
 */
export const generateAIInsights = async () => {
    const response = await api.post('/api/analytics/ai-insights');
    return response.data;
};

/**
 * Get AI insights
 */
export const getAIInsights = async () => {
    const response = await api.get('/api/analytics/ai-insights');
    return response.data;
};
