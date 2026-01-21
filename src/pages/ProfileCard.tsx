import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Download, Share2, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { useSubscription } from "../hooks/useSubscription";
import { UpgradePrompt } from "../components/UpgradePrompt";

export default function ProfileCard() {
    const { canAccess } = useSubscription();

    // Check subscription access
    if (!canAccess('profileCard')) {
        return <UpgradePrompt feature="profileCard" requiredTier="premium" />;
    }

    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'gradient'>('gradient');
    const cardRef = useRef<HTMLDivElement>(null);

    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['profileCardScores'],
        queryFn: getDeveloperScores
    });

    const { data: langData, isLoading: langsLoading } = useQuery({
        queryKey: ['profileCardLanguages'],
        queryFn: getLanguageStats
    });

    const isLoading = scoresLoading || langsLoading;
    const scores = scoreData?.data || {};
    const languages = langData?.data || [];
    const topLangs = languages.slice(0, 4).map((l: any) => l.language);

    const themes = {
        dark: 'bg-slate-900 text-white',
        light: 'bg-white text-slate-900 border border-slate-200',
        gradient: 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white'
    };

    const handleCopy = async () => {
        const embedCode = `[![${user?.name}'s GitInsights](https://gitinsights.dev/card/${user?.github_username})](https://gitinsights.dev/p/${user?.github_username})`;
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success('Embed code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            // Get the computed background color from the theme
            let bgColor = '#0f172a'; // default dark
            if (selectedTheme === 'light') {
                bgColor = '#ffffff';
            } else if (selectedTheme === 'gradient') {
                // For gradient, we skip background color so the gradient shows
                bgColor = null as any;
            }

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: bgColor,
                scale: 3,
                useCORS: true,
                allowTaint: false,
                logging: false,
                removeContainer: true,
                onclone: (clonedDoc) => {
                    // Force the cloned element to have no external margin/padding
                    const clonedCard = clonedDoc.querySelector('[data-card]');
                    if (clonedCard) {
                        (clonedCard as HTMLElement).style.margin = '0';
                        (clonedCard as HTMLElement).style.boxShadow = 'none';
                    }
                }
            });

            const link = document.createElement('a');
            link.download = `${user?.github_username || 'github'}-profile-card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Profile card downloaded!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download');
        }
        setDownloading(false);
    };

    const handleShare = async () => {
        const text = `Check out my GitHub profile card!\n\n💻 ${scores.total_commits || 0} commits\n⭐ ${scores.total_stars || 0} stars\n📦 ${scores.total_repos || 0} repos\n\nGenerated with GitInsights ✨`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My GitHub Profile Card',
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                await navigator.clipboard.writeText(text);
                toast.success('Copied to clipboard!');
            }
        } else {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        💳 Profile Card Generator
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">Create shareable GitHub profile cards</p>
            </div>

            {/* Theme Selector */}
            <div className="flex justify-center gap-4">
                {(['dark', 'light', 'gradient'] as const).map((theme) => (
                    <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-2 rounded-lg capitalize transition-all ${selectedTheme === theme
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                            }`}
                    >
                        {theme}
                    </button>
                ))}
            </div>

            {/* Card Preview */}
            <div className="flex justify-center">
                <div ref={cardRef} className={`w-[480px] rounded-2xl p-6 shadow-2xl ${themes[selectedTheme]}`}>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                            alt=""
                            className="w-16 h-16 rounded-full border-2 border-white/20"
                            crossOrigin="anonymous"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{user?.name || 'Developer'}</h2>
                            <p className={`text-sm ${selectedTheme === 'light' ? 'text-slate-500' : 'opacity-80'}`}>
                                @{user?.github_username || 'username'}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-lg mb-1 opacity-80">&lt;/&gt;</div>
                            <div className="text-lg font-bold">{scores.total_commits || 0}</div>
                            <div className={`text-xs ${selectedTheme === 'light' ? 'text-slate-500' : 'opacity-60'}`}>Commits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg mb-1 opacity-80">⭐</div>
                            <div className="text-lg font-bold">{scores.total_stars || 0}</div>
                            <div className={`text-xs ${selectedTheme === 'light' ? 'text-slate-500' : 'opacity-60'}`}>Stars</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg mb-1 opacity-80">📦</div>
                            <div className="text-lg font-bold">{scores.total_repos || 0}</div>
                            <div className={`text-xs ${selectedTheme === 'light' ? 'text-slate-500' : 'opacity-60'}`}>Repos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg mb-1 opacity-80">🔥</div>
                            <div className="text-lg font-bold">{scores.longest_streak || 0}</div>
                            <div className={`text-xs ${selectedTheme === 'light' ? 'text-slate-500' : 'opacity-60'}`}>Streak</div>
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="flex justify-center gap-2 mb-4">
                        {topLangs.map((lang: string) => (
                            <span
                                key={lang}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${selectedTheme === 'light'
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-white/20'
                                    }`}
                            >
                                {lang}
                            </span>
                        ))}
                    </div>

                    {/* Score Bar */}
                    <div className={`rounded-lg p-3 ${selectedTheme === 'light' ? 'bg-slate-100' : 'bg-white/10'}`}>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Developer Score</span>
                            <span className="font-bold">{scores.overall_score || 0}/100</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
                                style={{ width: `${scores.overall_score || 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`text-center mt-4 text-xs ${selectedTheme === 'light' ? 'text-slate-400' : 'opacity-50'}`}>
                        Generated by GitInsights
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    <Download className="h-4 w-4" />
                    {downloading ? 'Downloading...' : 'Download PNG'}
                </Button>
                <Button
                    onClick={handleCopy}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Embed Code'}
                </Button>
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>

            {/* Embed Code */}
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">Embed in your README:</p>
                    <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-sm overflow-x-auto">
                        {`[![${user?.name}'s GitInsights](https://gitinsights.dev/card/${user?.github_username})](https://gitinsights.dev/p/${user?.github_username})`}
                    </code>
                </CardContent>
            </Card>
        </div>
    );
}
