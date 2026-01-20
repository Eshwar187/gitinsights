import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Download, Share2, Sparkles, Calendar, Code2, Flame, Star, GitFork, TrendingUp } from "lucide-react";

export default function GitHubWrapped() {
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

    // Calculate fun stats
    const year = new Date().getFullYear();
    const coffeeEquivalent = Math.round((scores.total_commits || 0) / 50);
    const booksWritten = ((scores.total_commits || 0) * 50 / 75000).toFixed(1);

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

            {/* Main Stats Card */}
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white">
                    <div className="text-center space-y-6">
                        <div className="text-6xl font-black">{scores.total_commits || 0}</div>
                        <div className="text-xl opacity-90">Total Commits in {year}</div>
                        <div className="text-sm opacity-75">
                            That's like drinking {coffeeEquivalent} cups of coffee ☕
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6 text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <div className="text-3xl font-bold">{scores.active_days || 0}</div>
                        <div className="text-sm opacity-80">Active Days</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    <CardContent className="p-6 text-center">
                        <Flame className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <div className="text-3xl font-bold">{scores.longest_streak || 0}</div>
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
                        <div className="text-3xl font-bold">{scores.total_repos || 0}</div>
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

            {/* Fun Facts */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Fun Facts
                    </h3>
                    <div className="space-y-3 text-slate-600 dark:text-slate-400">
                        <p>📚 You wrote enough code to fill <strong>{booksWritten}</strong> books</p>
                        <p>🌙 You were most productive on <strong>Weekdays</strong></p>
                        <p>⚡ Your developer score: <strong>{scores.overall_score || 0}/100</strong></p>
                        <p>🎯 Activity level: <strong>{scores.activity_score > 50 ? 'Power User' : 'Steady Developer'}</strong></p>
                    </div>
                </CardContent>
            </Card>

            {/* Share Section */}
            <div className="flex gap-4 justify-center">
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Card
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Share2 className="h-4 w-4" />
                    Share on Social
                </Button>
            </div>
        </div>
    );
}
