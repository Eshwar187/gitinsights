import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Download, Target } from "lucide-react";
import { StatsOverview } from "../components/activity/StatsOverview";
import { HourlyHeatmap } from "../components/activity/HourlyHeatmap";
import { WeeklyTrendChart } from "../components/activity/WeeklyTrendChart";
import { LanguageBreakdown } from "../components/activity/LanguageBreakdown";
import { ProductivityInsights } from "../components/activity/ProductivityInsights";
import { SetGoalsModal } from "../components/activity/SetGoalsModal";
import { generateActivityData } from "../utils/mockData";

export default function Activity() {
    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [dateRange, setDateRange] = useState<"7" | "30" | "90">("7");

    // Generate mock data
    const activityData = generateActivityData(7);

    // Calculate stats
    const totalWeekTime = activityData.reduce((sum, d) => sum + d.minutes, 0);
    const dayTotals = activityData.reduce((acc, d) => {
        acc[d.day] = (acc[d.day] || 0) + d.minutes;
        return acc;
    }, {} as Record<string, number>);

    const mostProductiveDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Monday";
    const averagePerDay = totalWeekTime / 7;

    // Weekly trend data (last 28 days)
    const weeklyData = Array.from({ length: 28 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (27 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            minutes: Math.floor(Math.random() * 300) + 100
        };
    });

    // Language breakdown by day
    const languageData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
        const dayData = activityData.filter(d => d.day === day);
        return {
            day,
            JavaScript: dayData.filter(d => d.language === "JavaScript").reduce((sum, d) => sum + d.minutes, 0),
            Python: dayData.filter(d => d.language === "Python").reduce((sum, d) => sum + d.minutes, 0),
            TypeScript: dayData.filter(d => d.language === "TypeScript").reduce((sum, d) => sum + d.minutes, 0),
            Other: dayData.filter(d => !["JavaScript", "Python", "TypeScript"].includes(d.language)).reduce((sum, d) => sum + d.minutes, 0)
        };
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coding Activity</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your coding patterns and productivity</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowGoalsModal(true)}>
                        <Target className="mr-2 h-4 w-4" />
                        Set Goals
                    </Button>
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
            <StatsOverview
                totalWeekTime={totalWeekTime}
                mostProductiveDay={mostProductiveDay}
                averagePerDay={averagePerDay}
                currentStreak={12}
                trend="up"
            />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Heatmap - Full width */}
                <div className="lg:col-span-3">
                    <HourlyHeatmap data={activityData} />
                </div>

                {/* Weekly Trend - 2 columns */}
                <div className="lg:col-span-2">
                    <WeeklyTrendChart data={weeklyData} />
                </div>

                {/* Productivity Insights - 1 column */}
                <div className="lg:col-span-1">
                    <ProductivityInsights />
                </div>

                {/* Language Breakdown - Full width */}
                <div className="lg:col-span-3">
                    <LanguageBreakdown data={languageData} />
                </div>
            </div>

            {/* Goals Modal */}
            <SetGoalsModal isOpen={showGoalsModal} onClose={() => setShowGoalsModal(false)} />
        </div>
    );
}
