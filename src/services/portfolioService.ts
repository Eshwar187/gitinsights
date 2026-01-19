import api from '../lib/api';

/**
 * Get portfolio by slug
 */
export const getPortfolio = async (slug: string) => {
    const response = await api.get(`/api/portfolio/${slug}`);
    return response.data;
};

/**
 * Get user's portfolio
 */
export const getMyPortfolio = async () => {
    const response = await api.get('/api/portfolio/my');
    return response.data;
};

/**
 * Create portfolio
 */
export const createPortfolio = async (portfolioData: any) => {
    const response = await api.post('/api/portfolio', portfolioData);
    return response.data;
};

/**
 * Update portfolio
 */
export const updatePortfolio = async (portfolioData: any) => {
    const response = await api.put('/api/portfolio', portfolioData);
    return response.data;
};

/**
 * Delete portfolio
 */
export const deletePortfolio = async () => {
    const response = await api.delete('/api/portfolio');
    return response.data;
};
