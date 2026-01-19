import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Github, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { getGitHubAuthUrl, handleGitHubCallback } from "../../services/authService";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginWithUsername, isAuthenticated } = useAuth();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // Handle GitHub OAuth callback
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setOauthLoading(true);
            handleGitHubCallback(code)
                .then((response) => {
                    const { user, token } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    toast.success(`Welcome, ${user.name}!`);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    toast.error(error.response?.data?.error || 'GitHub authentication failed');
                    navigate("/auth/login");
                })
                .finally(() => {
                    setOauthLoading(false);
                });
        }
    }, [searchParams, navigate]);

    const handleUsernameLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            toast.error("Please enter your GitHub username");
            return;
        }

        setLoading(true);
        try {
            await loginWithUsername(username.trim());
            navigate("/dashboard");
        } catch (error) {
            // Error already handled in context with toast
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        window.location.href = getGitHubAuthUrl();
    };

    if (oauthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-slate-600 dark:text-slate-400">
                        Completing GitHub authentication...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome to GitInsights</CardTitle>
                    <CardDescription className="text-center">
                        Sign in with your GitHub account or enter your username
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* GitHub OAuth - First Time Users */}
                    <div className="space-y-2">
                        <Button
                            variant="default"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={handleGitHubLogin}
                        >
                            <Github className="mr-2 h-5 w-5" />
                            Connect with GitHub
                        </Button>
                        <p className="text-xs text-center text-slate-500">
                            First time? Connect with GitHub to create your account
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                Or
                            </span>
                        </div>
                    </div>

                    {/* Username Login - Returning Users */}
                    <form onSubmit={handleUsernameLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                <Input
                                    type="text"
                                    placeholder="GitHub Username"
                                    className="pl-10"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                Already registered? Enter your GitHub username to access
                            </p>
                        </div>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                            variant="outline"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                "Access Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
