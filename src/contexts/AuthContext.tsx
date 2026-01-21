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
        } catch (error) {
            console.error('Failed to fetch user from database:', error);
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
        } catch (error: any) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            toast.error('Login failed. Please try again.');
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
        } catch (error) {
            console.error('Failed to refresh user:', error);
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
