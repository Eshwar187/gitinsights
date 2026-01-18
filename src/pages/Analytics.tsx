import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { cn } from "../utils/cn";

export default function Analytics() {
    const [activeTab, setActiveTab] = useState("contributions");

    const tabs = [
        { id: "contributions", label: "Contributions" },
        { id: "languages", label: "Languages" },
        { id: "quality", label: "Commit Quality" },
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
                                <CardTitle>Language Trends</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px] flex items-center justify-center text-slate-500">
                                Line Chart Placeholder
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
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-500">A+</div>
                                    <div className="text-xs text-slate-500">Average Grade</div>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-2xl font-bold">85%</div>
                                    <div className="text-xs text-slate-500">Test Coverage</div>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-2xl font-bold">1.2</div>
                                    <div className="text-xs text-slate-500">Avg Complexity</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {activeTab === "comparison" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Comparison</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex flex-col items-center justify-center gap-4">
                            <div className="text-4xl font-bold text-blue-600">Top 5%</div>
                            <p className="text-center text-slate-500 max-w-md">You're performing better than 95% of developers in your region based on commit frequency and code quality.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
