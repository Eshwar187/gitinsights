import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginByUsername, getCurrentUser, logout as logoutService } from '../services/authService';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    github_username: string;
    avatar_url?: string;
    subscription_tier: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    loginWithUsername: (username: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Verify token is still valid
                try {
                    const response = await getCurrentUser();
                    setUser(response.data.user);
                } catch (error) {
                    // Token invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const loginWithUsername = async (username: string) => {
        try {
            setLoading(true);
            const response = await loginByUsername(username);

            const { user: userData, token: userToken } = response.data;

            // Store in state and localStorage
            setUser(userData);
            setToken(userToken);
            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success(`Welcome back, ${userData.name}!`);
        } catch (error: any) {
            const message = error.response?.data?.error || 'User not found. Please connect with GitHub first.';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
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
                loginWithUsername,
                logout,
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
