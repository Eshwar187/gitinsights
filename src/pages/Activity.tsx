import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Download, Activity as ActivityIcon, Clock, Flame, TrendingUp } from "lucide-react";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Activity() {
    const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

    const { data: scoreData, isLoading } = useQuery({
        queryKey: ['activityScores'],
        queryFn: getDeveloperScores
    });

    const scores = scoreData?.data || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coding Activity</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your GitHub contributions and productivity</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
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

            {/* Stats Overview */}
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
                                    <p className="text-sm text-slate-500">Total Commits</p>
                                    <p className="text-2xl font-bold">{scores.total_commits || 0}</p>
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
                                    <p className="text-2xl font-bold">{scores.active_days || 0}</p>
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
                                    <p className="text-sm text-slate-500">Activity Score</p>
                                    <p className="text-2xl font-bold">{scores.activity_score || 0}/100</p>
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

