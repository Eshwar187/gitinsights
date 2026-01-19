import api from '../lib/api';

/**
 * Connect GitHub account (first-time OAuth)
 */
export const connectGitHub = async (code: string) => {
    const response = await api.post('/api/github/connect', { code });
    return response.data;
};

/**
 * Get GitHub profile
 */
export const getGitHubProfile = async () => {
    const response = await api.get('/api/github/profile');
    return response.data;
};

/**
 * Sync GitHub data
 */
export const syncGitHubData = async () => {
    const response = await api.post('/api/github/sync');
    return response.data;
};

/**
 * Get repositories
 */
export const getRepositories = async () => {
    const response = await api.get('/api/github/repositories');
    return response.data;
};

/**
 * Check rate limit
 */
export const checkRateLimit = async () => {
    const response = await api.get('/api/github/rate-limit');
    return response.data;
};
