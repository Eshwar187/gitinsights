import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Download, Activity as ActivityIcon, Clock, Flame, TrendingUp, Lock, Crown } from "lucide-react";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../services/analyticsService";
import { getHeatmap } from "../services/activityService";
import LoadingSpinner from "../components/LoadingSpinner";
import { format, subDays } from "date-fns";
import { useSubscription } from "../hooks/useSubscription";
import { toast } from "react-hot-toast";

export default function Activity() {
    const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");
    const { tier } = useSubscription();
    const isPremium = tier === 'premium';

    const today = new Date();
    const startDate = subDays(today, parseInt(dateRange));

    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['activityScores'],
        queryFn: getDeveloperScores
    });

    // Fetch heatmap data based on selected date range
    const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
        queryKey: ['activityHeatmap', dateRange],
        queryFn: () => getHeatmap(format(startDate, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd'))
    });

    const scores = scoreData?.data || {};

    // Calculate stats from heatmap data for the selected range
    const rangeStats = {
        totalCommits: 0,
        activeDays: 0,
        averagePerDay: 0
    };

    if (heatmapData?.success && Array.isArray(heatmapData.data)) {
        rangeStats.totalCommits = heatmapData.data.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
        rangeStats.activeDays = heatmapData.data.filter((item: any) => item.count > 0).length;
        rangeStats.averagePerDay = rangeStats.activeDays > 0
            ? Math.round(rangeStats.totalCommits / rangeStats.activeDays * 10) / 10
            : 0;
    }

    const handleExport = () => {
        if (!isPremium) {
            toast.error("Export is a Premium-only feature. Upgrade to access!");
            return;
        }
        // Export logic would go here
        toast.success("Export coming soon!");
    };

    const isLoading = scoresLoading || heatmapLoading;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coding Activity</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your GitHub contributions and productivity</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={!isPremium}
                            className={!isPremium ? "opacity-60" : ""}
                        >
                            {!isPremium ? (
                                <Lock className="mr-2 h-4 w-4" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            Export
                        </Button>
                        {!isPremium && (
                            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                                <Crown className="h-2.5 w-2.5" />
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex gap-2">
                {(["7", "30", "90"] as const).map(range => (
                    <Button
                        key={range}
                        variant={dateRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange(range)}
                    >
                        Last {range} Days
                    </Button>
                ))}
            </div>

            {/* Stats Overview - Now based on selected date range */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <ActivityIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Commits ({dateRange}d)</p>
                                    <p className="text-2xl font-bold">{rangeStats.totalCommits}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Active Days</p>
                                    <p className="text-2xl font-bold">{rangeStats.activeDays}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Current Streak</p>
                                    <p className="text-2xl font-bold">{scores.current_streak || 0} days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Avg/Day</p>
                                    <p className="text-2xl font-bold">{rangeStats.averagePerDay}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Contribution Heatmap - Full width */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contribution Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ContributionHeatmap />
                        </CardContent>
                    </Card>
                </div>

                {/* Language Breakdown - 2 columns */}
                <div className="lg:col-span-2">
                    <TopLanguages />
                </div>

                {/* Productivity Insights - 1 column */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Productivity Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Repositories</p>
                                    <p className="text-xl font-bold">{scores.total_repos || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Stars Earned</p>
                                    <p className="text-xl font-bold">{scores.total_stars || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Forks</p>
                                    <p className="text-xl font-bold">{scores.total_forks || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Overall Score</p>
                                    <p className="text-xl font-bold text-blue-600">{scores.overall_score || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
