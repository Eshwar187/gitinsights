import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../../services/analyticsService";
import LoadingSpinner from "../LoadingSpinner";

export function DeveloperScore() {
    const { data: scoreData, isLoading } = useQuery({
        queryKey: ['developerScore'],
        queryFn: getDeveloperScores
    });

    if (isLoading) {
        return (
            <Card className="h-full bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 dark:from-amber-600 dark:to-orange-600">
                <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                    <LoadingSpinner size="sm" />
                </CardContent>
            </Card>
        );
    }

    const score = scoreData?.data || {};
    const overallScore = score.overall_score || 0;
    const codeQuality = score.code_quality || 0;
    const consistency = score.consistency || 0;
    const tier = score.tier || 'Beginner';
    const rank = score.rank || 'N/A';

    return (
        <Card className="h-full bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 dark:from-amber-600 dark:to-orange-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-100">Dev Score</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-300" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="text-5xl font-bold">{Math.round(overallScore)}</div>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                        {tier}
                    </Badge>
                    <p className="text-xs text-blue-100 text-center">
                        Rank #{rank}
                    </p>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="text-xs flex justify-between text-amber-100">
                        <span>Code Quality</span>
                        <span>{codeQuality.toFixed(1)}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 rounded-full" style={{ width: `${codeQuality * 10}%` }} />
                    </div>
                    <div className="text-xs flex justify-between text-amber-100">
                        <span>Consistency</span>
                        <span>{consistency.toFixed(1)}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 rounded-full" style={{ width: `${consistency * 10}%` }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
