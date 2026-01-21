import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Download, Share2, Sparkles, Calendar, Code2, Flame, Star, GitFork } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { useSubscription } from "../hooks/useSubscription";
import { UpgradePrompt } from "../components/UpgradePrompt";

export default function GitHubWrapped() {
    const { canAccess } = useSubscription();

    // Check subscription access
    if (!canAccess('wrapped')) {
        return <UpgradePrompt feature="wrapped" requiredTier="pro" />;
    }

    const cardRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['wrappedScores'],
        queryFn: getDeveloperScores
    });

    const { data: langData, isLoading: langsLoading } = useQuery({
        queryKey: ['wrappedLanguages'],
        queryFn: getLanguageStats
    });

    const isLoading = scoresLoading || langsLoading;
    const scores = scoreData?.data || {};
    const languages = langData?.data || [];
    const topLang = languages[0]?.language || 'Unknown';

    // Calculate fun stats based on REAL data
    const year = new Date().getFullYear();
    const totalCommits = scores.total_commits || 0;
    const activeDays = scores.active_days || 0;
    const longestStreak = scores.longest_streak || 0;
    const totalRepos = scores.total_repos || 0;

    // Real calculations
    const coffeeEquivalent = Math.round(totalCommits / 3); // ~3 commits per coffee
    const avgCommitsPerDay = activeDays > 0 ? (totalCommits / activeDays).toFixed(1) : 0;
    const hoursSpent = Math.round(totalCommits * 0.5); // ~30 min per commit
    const linesEstimate = (totalCommits * 50).toLocaleString(); // ~50 lines per commit

    // Determine productivity type
    const productivityType = longestStreak >= 30 ? 'Streak Champion 🔥' :
        totalCommits >= 500 ? 'Code Machine 🤖' :
            activeDays >= 100 ? 'Consistent Coder 📊' :
                'Rising Star ⭐';

    // Determine most active day (simulated based on patterns)
    const getMostActiveTime = () => {
        if (totalCommits > 200) return { day: 'Weekdays', time: 'Evenings' };
        if (longestStreak > 10) return { day: 'Daily', time: 'Consistent' };
        return { day: 'Weekends', time: 'Late nights' };
    };
    const activePattern = getMostActiveTime();

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `github-wrapped-${year}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Card downloaded!');
        } catch (error) {
            toast.error('Failed to download');
        }
        setDownloading(false);
    };

    // Share to social
    const handleShare = async () => {
        const text = `🎄 My ${year} GitHub Wrapped!\n\n📊 ${totalCommits} commits\n🔥 ${longestStreak} day streak\n⭐ ${scores.total_stars || 0} stars\n💻 ${totalRepos} repos\n\nGenerated with GitInsights ✨`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `My ${year} GitHub Wrapped`,
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled or share failed - copy to clipboard instead
                await navigator.clipboard.writeText(text);
                toast.success('Copied to clipboard!');
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard - paste on social!');
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
                    <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        🎄 Your {year} Wrapped
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">Your year in code, visualized</p>
            </div>

            {/* Main Stats Card - Downloadable */}
            <div ref={cardRef} className="space-y-4 bg-white dark:bg-slate-950 p-4 rounded-2xl">
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white">
                        <div className="text-center space-y-6">
                            <div className="text-6xl font-black">{totalCommits.toLocaleString()}</div>
                            <div className="text-xl opacity-90">Total Commits in {year}</div>
                            <div className="text-sm opacity-75">
                                That's roughly {hoursSpent} hours of coding ⏰
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6 text-center">
                            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-80" />
                            <div className="text-3xl font-bold">{activeDays}</div>
                            <div className="text-sm opacity-80">Active Days</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardContent className="p-6 text-center">
                            <Flame className="h-8 w-8 mx-auto mb-2 opacity-80" />
                            <div className="text-3xl font-bold">{longestStreak}</div>
                            <div className="text-sm opacity-80">Longest Streak</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <CardContent className="p-6 text-center">
                            <Star className="h-8 w-8 mx-auto mb-2 opacity-80" />
                            <div className="text-3xl font-bold">{scores.total_stars || 0}</div>
                            <div className="text-sm opacity-80">Stars Earned</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        <CardContent className="p-6 text-center">
                            <GitFork className="h-8 w-8 mx-auto mb-2 opacity-80" />
                            <div className="text-3xl font-bold">{totalRepos}</div>
                            <div className="text-sm opacity-80">Repositories</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Language Card */}
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white text-center">
                        <Code2 className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                        <div className="text-lg opacity-80">Your Top Language</div>
                        <div className="text-4xl font-bold mt-2">{topLang}</div>
                        <div className="mt-4 text-sm opacity-60">
                            You used {languages.length} different languages this year
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-slate-400 pt-2">
                    Generated by GitInsights
                </div>
            </div>

            {/* Fun Facts - Outside downloadable area */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Your Stats Story
                    </h3>
                    <div className="space-y-3 text-slate-600 dark:text-slate-400">
                        <p>☕ You drank roughly <strong>{coffeeEquivalent} cups of coffee</strong> while coding</p>
                        <p>📝 You wrote approximately <strong>{linesEstimate} lines</strong> of code</p>
                        <p>📈 You averaged <strong>{avgCommitsPerDay} commits/day</strong> on active days</p>
                        <p>⏰ You were most active on <strong>{activePattern.day}</strong> during <strong>{activePattern.time}</strong></p>
                        <p>🏆 Your coder personality: <strong>{productivityType}</strong></p>
                        <p>⚡ Developer Score: <strong>{scores.overall_score || 0}/100</strong></p>
                    </div>
                </CardContent>
            </Card>

            {/* Share Section */}
            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    <Download className="h-4 w-4" />
                    {downloading ? 'Downloading...' : 'Download Card'}
                </Button>
                <Button
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                    Share on Social
                </Button>
            </div>
        </div>
    );
}
