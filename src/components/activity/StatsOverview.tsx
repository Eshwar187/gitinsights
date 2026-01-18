import { Clock, TrendingUp, Flame, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

interface StatsOverviewProps {
    totalWeekTime: number; // minutes
    mostProductiveDay: string;
    averagePerDay: number; // minutes
    currentStreak: number; // days
    trend?: "up" | "down";
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    totalWeekTime,
    mostProductiveDay,
    averagePerDay,
    currentStreak,
    trend = "up"
}) => {
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const isToday = mostProductiveDay === new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const stats = [
        {
            label: "Total Time This Week",
            value: formatTime(totalWeekTime),
            icon: <Clock className="h-5 w-5 text-blue-500" />,
            color: "blue"
        },
        {
            label: "Most Productive Day",
            value: mostProductiveDay,
            icon: isToday ? "🔥" : <Calendar className="h-5 w-5 text-purple-500" />,
            color: "purple"
        },
        {
            label: "Average Per Day",
            value: formatTime(averagePerDay),
            icon: <TrendingUp className={`h-5 w-5 ${trend === "up" ? "text-green-500" : "text-red-500"}`} />,
            color: trend === "up" ? "green" : "red",
            trend
        },
        {
            label: "Current Streak",
            value: `${currentStreak} days`,
            icon: <Flame className="h-5 w-5 text-orange-500" />,
            color: "orange"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                {stat.trend && (
                                    <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                        {stat.trend === "up" ? "↑" : "↓"} vs last week
                                    </p>
                                )}
                            </div>
                            <div className="text-3xl">
                                {typeof stat.icon === "string" ? stat.icon : stat.icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
