import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getDeveloperScores } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { TrendingUp, TrendingDown, Minus, Trophy, Users, BarChart3, Target } from "lucide-react";

export default function CompareStats() {
    const { data: scoreData, isLoading } = useQuery({
        queryKey: ['compareScores'],
        queryFn: getDeveloperScores
    });

    const scores = scoreData?.data || {};

    // Simulated global averages (in a real app, this would come from the backend)
    const globalAverages = {
        commits: 250,
        stars: 15,
        repos: 25,
        streak: 10,
        active_days: 60,
        overall_score: 45
    };

    const calculatePercentile = (value: number, average: number) => {
        const ratio = value / average;
        if (ratio >= 2) return 99;
        if (ratio >= 1.5) return 90;
        if (ratio >= 1) return 70;
        if (ratio >= 0.75) return 50;
        if (ratio >= 0.5) return 30;
        return 10;
    };

    const comparisons = [
        {
            metric: 'Total Commits',
            yours: scores.total_commits || 0,
            average: globalAverages.commits,
            icon: <BarChart3 className="h-5 w-5" />,
            color: 'blue'
        },
        {
            metric: 'Stars Earned',
            yours: scores.total_stars || 0,
            average: globalAverages.stars,
            icon: <Trophy className="h-5 w-5" />,
            color: 'yellow'
        },
        {
            metric: 'Repositories',
            yours: scores.total_repos || 0,
            average: globalAverages.repos,
            icon: <Target className="h-5 w-5" />,
            color: 'green'
        },
        {
            metric: 'Longest Streak',
            yours: scores.longest_streak || 0,
            average: globalAverages.streak,
            icon: <TrendingUp className="h-5 w-5" />,
            color: 'orange'
        },
        {
            metric: 'Active Days',
            yours: scores.active_days || 0,
            average: globalAverages.active_days,
            icon: <Users className="h-5 w-5" />,
            color: 'purple'
        },
        {
            metric: 'Overall Score',
            yours: scores.overall_score || 0,
            average: globalAverages.overall_score,
            icon: <Trophy className="h-5 w-5" />,
            color: 'pink'
        },
    ];

    // Calculate overall percentile
    const overallPercentile = Math.round(
        comparisons.reduce((sum, c) => sum + calculatePercentile(c.yours, c.average), 0) / comparisons.length
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        📊 Compare Stats
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">See how you stack up against other developers</p>
            </div>

            {/* Overall Rank */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                <CardContent className="p-8 text-center">
                    <div className="text-lg opacity-80">Your Global Ranking</div>
                    <div className="text-6xl font-black mt-2">Top {100 - overallPercentile}%</div>
                    <div className="text-sm opacity-70 mt-2">
                        You're performing better than {overallPercentile}% of developers
                    </div>
                </CardContent>
            </Card>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisons.map((comp) => {
                    const percentile = calculatePercentile(comp.yours, comp.average);
                    const diff = comp.yours - comp.average;
                    const isAbove = diff > 0;
                    const isEqual = diff === 0;

                    return (
                        <Card key={comp.metric}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg bg-${comp.color}-100 dark:bg-${comp.color}-900 text-${comp.color}-600`}>
                                            {comp.icon}
                                        </div>
                                        <span className="font-medium">{comp.metric}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${isAbove ? 'text-green-600' : isEqual ? 'text-slate-500' : 'text-red-500'
                                        }`}>
                                        {isAbove ? <TrendingUp className="h-4 w-4" /> :
                                            isEqual ? <Minus className="h-4 w-4" /> :
                                                <TrendingDown className="h-4 w-4" />}
                                        {isAbove ? '+' : ''}{diff}
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500">You: <strong className="text-slate-900 dark:text-white">{comp.yours}</strong></span>
                                    <span className="text-slate-500">Avg: <strong>{comp.average}</strong></span>
                                </div>

                                <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`absolute left-0 top-0 h-full rounded-full ${isAbove ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                                'bg-gradient-to-r from-orange-400 to-orange-500'
                                            }`}
                                        style={{ width: `${Math.min(100, (comp.yours / comp.average) * 50)}%` }}
                                    />
                                    <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-400" />
                                </div>

                                <div className="text-xs text-center mt-2 text-slate-500">
                                    Top {100 - percentile}% in this category
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
