import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refresh');
            const error = searchParams.get('error');

            if (error) {
                toast.error('GitHub authentication failed. Please try again.');
                navigate('/');
                return;
            }

            if (token && refreshToken) {
                try {
                    // Store refresh token
                    localStorage.setItem('refreshToken', refreshToken);

                    // Login with token - this fetches user from database
                    await login(token);

                    // Clear lastSync to trigger fresh sync on Dashboard
                    localStorage.removeItem('lastGitHubSync');

                    toast.success('Successfully connected with GitHub!');
                    navigate('/dashboard');
                } catch (error) {
                    console.error('Auth callback error:', error);
                    toast.error('Authentication failed. Please try again.');
                    navigate('/');
                }
            } else {
                toast.error('Invalid authentication response');
                navigate('/');
            }
        };

        handleCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Completing authentication...
                </p>
            </div>
        </div>
    );
}
