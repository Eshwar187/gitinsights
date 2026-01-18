import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { Lightbulb, TrendingUp } from "lucide-react";

export const ProductivityInsights: React.FC = () => {
    const insights = {
        peakHours: "9 AM - 11 AM",
        pattern: "Morning Person",
        consistencyScore: 85,
        weeklyGoal: 40 * 60, // 40 hours in minutes
        currentProgress: 32 * 60 + 30 // 32.5 hours
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Productivity Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Peak Hours */}
                <div>
                    <p className="text-sm font-medium mb-1">Peak Hours</p>
                    <p className="text-2xl font-bold text-blue-600">{insights.peakHours}</p>
                    <p className="text-xs text-slate-500 mt-1">You're most productive during these hours</p>
                </div>

                {/* Coding Pattern */}
                <div>
                    <p className="text-sm font-medium mb-2">Coding Pattern</p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {insights.pattern}
                    </Badge>
                </div>

                {/* Consistency Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Consistency Score</p>
                        <span className="text-sm font-bold">{insights.consistencyScore}%</span>
                    </div>
                    <Progress value={insights.consistencyScore} max={100} />
                    <p className="text-xs text-slate-500 mt-1">Based on your coding streak</p>
                </div>

                {/* Weekly Goal */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Weekly Goal Progress</p>
                        <span className="text-sm font-bold">
                            {Math.floor(insights.currentProgress / 60)}h / {insights.weeklyGoal / 60}h
                        </span>
                    </div>
                    <Progress value={insights.currentProgress} max={insights.weeklyGoal} />
                    <p className="text-xs text-slate-500 mt-1">
                        {insights.weeklyGoal - insights.currentProgress > 0
                            ? `${Math.floor((insights.weeklyGoal - insights.currentProgress) / 60)}h ${(insights.weeklyGoal - insights.currentProgress) % 60}m remaining`
                            : "Goal achieved! 🎉"}
                    </p>
                </div>

                {/* Recommendations */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Recommendations
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Try coding during your peak hours more often</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Maintain your current streak for bonus XP</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Consider learning Python to diversify skills</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
