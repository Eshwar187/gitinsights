import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { cn } from "../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Analytics() {
    const [activeTab, setActiveTab] = useState("contributions");

    const { data: scoreData, isLoading } = useQuery({
        queryKey: ['developerScoreAnalytics'],
        queryFn: getDeveloperScores
    });

    const scores = scoreData?.data || {};

    const tabs = [
        { id: "contributions", label: "Contributions" },
        { id: "languages", label: "Languages" },
        { id: "quality", label: "Code Quality" },
        { id: "comparison", label: "Comparison" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                activeTab === tab.id ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-50" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {activeTab === "contributions" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Contribution Activity</CardTitle>
                            <CardDescription>Detailed breakdown of your commit history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContributionHeatmap />
                        </CardContent>
                    </Card>
                )}
                {activeTab === "languages" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TopLanguages />
                        <Card>
                            <CardHeader>
                                <CardTitle>Language Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Total Repositories</span>
                                        <span className="font-bold">{scores.total_repos || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Total Commits</span>
                                        <span className="font-bold">{scores.total_commits || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Active Days</span>
                                        <span className="font-bold">{scores.active_days || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeTab === "quality" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Code Quality Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8"><LoadingSpinner size="sm" /></div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="p-4 border rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-500">{scores.activity_score || 0}/100</div>
                                        <div className="text-xs text-slate-500">Activity Score</div>
                                    </div>
                                    <div className="p-4 border rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-500">{scores.quality_score || 0}/100</div>
                                        <div className="text-xs text-slate-500">Quality Score</div>
                                    </div>
                                    <div className="p-4 border rounded-lg text-center">
                                        <div className="text-2xl font-bold text-purple-500">{scores.impact_score || 0}/100</div>
                                        <div className="text-xs text-slate-500">Impact Score</div>
                                    </div>
                                    <div className="p-4 border rounded-lg text-center">
                                        <div className="text-2xl font-bold text-orange-500">{scores.consistency_score || 0}/100</div>
                                        <div className="text-xs text-slate-500">Consistency Score</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
                {activeTab === "comparison" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Developer Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
                            <div className="text-6xl font-bold text-blue-600">{scores.overall_score || 0}</div>
                            <div className="text-xl text-slate-500">Overall Developer Score</div>
                            <div className="grid grid-cols-2 gap-8 mt-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{scores.total_repos || 0}</div>
                                    <div className="text-sm text-slate-500">Repositories</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{scores.total_stars || 0}</div>
                                    <div className="text-sm text-slate-500">Stars Earned</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

