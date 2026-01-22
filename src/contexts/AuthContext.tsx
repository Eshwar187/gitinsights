import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logout as logoutService } from '../services/authService';
import toast from 'react-hot-toast';
import api from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    github_username: string;
    avatar_url?: string;
    subscription_tier: string;
    subscription_status?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => Promise<void>;
    loginWithUsername: (username: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user from database using token
    const fetchUserFromDatabase = async (authToken: string): Promise<User | null> => {
        try {
            const response = await api.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (response.data.success && response.data.user) {
                return response.data.user;
            }
            return null;
        } catch {
            return null;
        }
    };

    // Check for existing token on mount and fetch user from DB
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                // Fetch fresh user data from database
                const userData = await fetchUserFromDatabase(storedToken);

                if (userData) {
                    setToken(storedToken);
                    setUser(userData);
                } else {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Login with token - fetches user from database
    const login = async (authToken: string) => {
        try {
            setLoading(true);

            // Store token
            localStorage.setItem('token', authToken);
            setToken(authToken);

            // Fetch user from database
            const userData = await fetchUserFromDatabase(authToken);

            if (userData) {
                setUser(userData);
                toast.success(`Welcome back, ${userData.name || userData.github_username}!`);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            toast.error('Login failed. Please try again.');
            throw new Error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Login with username (for returning users)
    const loginWithUsername = async (username: string) => {
        try {
            setLoading(true);

            // Call login by username API
            const response = await api.post('/api/auth/login-by-username', { username });

            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
                toast.success(`Welcome back, ${response.data.user.name || username}!`);
            } else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Username not found. Please connect with GitHub first.';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Refresh user data from database
    const refreshUser = async () => {
        if (!token) return;

        try {
            const userData = await fetchUserFromDatabase(token);
            if (userData) {
                setUser(userData);
            }
        } catch {
            // Silently fail refresh
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        logoutService();
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                loading,
                login,
                loginWithUsername,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
