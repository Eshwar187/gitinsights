import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

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
                    // Fetch user data with the token
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Store tokens and user data
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('user', JSON.stringify(data.data));

                        // Clear lastSync to trigger fresh sync on Dashboard
                        localStorage.removeItem('lastGitHubSync');

                        toast.success('Successfully connected with GitHub!');

                        // Reload to trigger AuthContext to pick up the new auth state
                        window.location.href = '/dashboard';
                    } else {
                        throw new Error(data.error || 'Failed to fetch user data');
                    }
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
    }, [searchParams, navigate]);

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
