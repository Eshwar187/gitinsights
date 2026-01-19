import api from '../lib/api';

/**
 * Initialize user skills from GitHub
 */
export const initializeSkills = async (githubAccountId: string) => {
    const response = await api.post('/api/skills/initialize', { githubAccountId });
    return response.data;
};

/**
 * Get skill tree
 */
export const getSkillTree = async () => {
    const response = await api.get('/api/skills/tree');
    return response.data;
};

/**
 * Sync skills from GitHub
 */
export const syncSkills = async (githubAccountId: string) => {
    const response = await api.post('/api/skills/sync', { githubAccountId });
    return response.data;
};

/**
 * Generate job learning path
 */
export const getJobPath = async (jobTitle: string) => {
    const response = await api.post('/api/skills/path-to-job', { jobTitle });
    return response.data;
};
