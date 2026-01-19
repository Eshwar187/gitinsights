import api from '../lib/api';

/**
 * Analyze a commit
 */
export const analyzeCommit = async (commitSha: string, repositoryName: string, githubAccountId?: string) => {
    const response = await api.post('/api/code-review/analyze', {
        commitSha,
        repositoryName,
        githubAccountId
    });
    return response.data;
};

/**
 * Get review history
 */
export const getReviewHistory = async (params?: { limit?: number; offset?: number; sort?: 'date' | 'score' }) => {
    const response = await api.get('/api/code-review/history', { params });
    return response.data;
};

/**
 * Get single review by commit SHA
 */
export const getReview = async (commitSha: string) => {
    const response = await api.get(`/api/code-review/${commitSha}`);
    return response.data;
};

/**
 * Delete review
 */
export const deleteReview = async (reviewId: string) => {
    const response = await api.delete(`/api/code-review/${reviewId}`);
    return response.data;
};
