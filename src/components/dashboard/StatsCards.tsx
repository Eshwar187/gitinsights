import { GitCommit, FolderGit2, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../../services/analyticsService";
import LoadingSpinner from "../LoadingSpinner";

export function StatsCards() {
    const { data: scoreData, isLoading, error } = useQuery({
        queryKey: ['developerScore'],
        queryFn: getDeveloperScores
    });

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="h-32 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                    </Card>
                ))}
            </div>
        );
    }

    if (error || !scoreData?.success) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-full p-4 text-center text-slate-500">
                    Failed to load stats. Please try refreshing.
                </Card>
            </div>
        );
    }

    const score = scoreData.data;

    const stats = [
        {
            title: "Total Commits",
            value: score.total_commits?.toLocaleString() || "0",
            change: "+12.5%",
            icon: GitCommit,
            desc: "from last month",
        },
        {
            title: "Total Repositories",
            value: score.total_repos?.toString() || "0",
            change: `+${score.total_repos || 0}`,
            icon: FolderGit2,
            desc: "active projects",
        },
        {
            title: "Total Stars",
            value: score.total_stars?.toLocaleString() || "0",
            change: "+156",
            icon: Star,
            desc: "received all time",
        },
        {
            title: "Developer Score",
            value: score.overall_score?.toFixed(0) || "0",
            change: `Rank #${score.rank || 'N/A'}`,
            icon: Users,
            desc: "global ranking",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground text-slate-500">
                            <span className="text-green-500 font-medium">{stat.change}</span> {stat.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
