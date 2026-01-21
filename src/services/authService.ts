import api from '../lib/api';

interface LoginByUsernameResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
            github_username: string;
            avatar_url?: string;
            subscription_tier: string;
        };
        token: string;
    };
}

/**
 * Check if GitHub username exists and return token
 */
export const loginByUsername = async (username: string): Promise<LoginByUsernameResponse> => {
    const response = await api.post<LoginByUsernameResponse>('/api/auth/login-by-username', {
        username,
    });
    return response.data;
};

/**
 * Get GitHub OAuth URL
 */
export const getGitHubAuthUrl = (): string => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/auth/github`;
};

/**
 * Handle GitHub OAuth callback
 */
export const handleGitHubCallback = async (code: string) => {
    const response = await api.get(`/api/auth/github/callback?code=${code}`);
    return response.data;
};

/**
 * Get current user profile from database
 */
export const getCurrentUser = async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
};

/**
 * Logout user - only clear token, no user data in localStorage
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
};
