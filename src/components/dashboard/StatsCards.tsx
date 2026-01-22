import { GitCommit, FolderGit2, Star, Users, GitPullRequest, CheckCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores, getPRStats } from "../../services/analyticsService";
import LoadingSpinner from "../LoadingSpinner";
import { useSubscription } from "../../hooks/useSubscription";

export function StatsCards() {
    const { tier } = useSubscription();
    const isPremium = tier === 'pro' || tier === 'premium';

    const { data: scoreData, isLoading, error } = useQuery({
        queryKey: ['developerScore'],
        queryFn: getDeveloperScores
    });

    const { data: prStatsData } = useQuery({
        queryKey: ['prStats'],
        queryFn: getPRStats,
        enabled: isPremium // Only fetch for premium users
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
    const prStats = prStatsData?.data;

    const baseStats = [
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

    // Premium stats - only shown for pro/premium users
    const premiumStats = isPremium && prStats ? [
        {
            title: "PRs Merged",
            value: prStats.prs_merged?.toString() || "0",
            change: `${prStats.prs_opened || 0} opened`,
            icon: GitPullRequest,
            desc: "pull requests merged",
            premium: true
        },
        {
            title: "Code Reviews",
            value: prStats.code_reviews?.toString() || "0",
            change: "given",
            icon: CheckCircle,
            desc: "reviews contributed",
            premium: true
        },
    ] : [];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {baseStats.map((stat) => (
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

            {/* Premium Stats Row */}
            {isPremium && premiumStats.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {premiumStats.map((stat) => (
                        <Card key={stat.title} className="border-purple-500/20 bg-purple-500/5">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    {stat.title}
                                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-500 text-white rounded-full">PRO</span>
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
                                <p className="text-xs text-muted-foreground text-slate-500">
                                    <span className="text-purple-400 font-medium">{stat.change}</span> {stat.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upgrade prompt for non-premium users */}
            {!isPremium && (
                <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent">
                    <CardContent className="flex items-center justify-center py-6">
                        <div className="text-center">
                            <Lock className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                            <p className="text-sm text-slate-500">
                                <span className="font-medium">Upgrade to Pro</span> to unlock PRs Merged & Code Reviews stats
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
