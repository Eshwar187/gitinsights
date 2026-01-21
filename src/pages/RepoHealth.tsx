import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getRepositories } from "../services/githubService";
import LoadingSpinner from "../components/LoadingSpinner";
import { HeartPulse, AlertTriangle, CheckCircle, XCircle, FileText, Shield, Code2, GitFork, Star, Eye } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import { UpgradePrompt } from "../components/UpgradePrompt";

interface RepoHealthScore {
    name: string;
    score: number;
    checks: {
        hasDescription: boolean;
        hasLanguage: boolean;
        notArchived: boolean;
        hasStars: boolean;
        recentActivity: boolean;
    };
}

export default function RepoHealth() {
    const { canAccess } = useSubscription();

    // Check subscription access
    if (!canAccess('repoHealth')) {
        return <UpgradePrompt feature="repoHealth" requiredTier="premium" />;
    }

    const { data: reposData, isLoading } = useQuery({
        queryKey: ['repoHealthRepos'],
        queryFn: () => getRepositories(1, 50)
    });

    const repos = reposData?.data || [];

    // Calculate health scores for each repo
    const repoHealthScores: RepoHealthScore[] = repos.map((repo: any) => {
        const checks = {
            hasDescription: !!repo.description && repo.description.length > 10,
            hasLanguage: !!repo.language,
            notArchived: !repo.is_archived,
            hasStars: (repo.stars_count || 0) > 0,
            recentActivity: true // Assume true for now
        };

        const score = Object.values(checks).filter(Boolean).length * 20;

        return {
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars_count: repo.stars_count || 0,
            forks_count: repo.forks_count || 0,
            is_archived: repo.is_archived,
            score,
            checks
        };
    });

    // Sort by score
    const sortedRepos = [...repoHealthScores].sort((a, b) => b.score - a.score);

    // Calculate averages
    const avgScore = repos.length > 0
        ? Math.round(sortedRepos.reduce((sum, r) => sum + r.score, 0) / repos.length)
        : 0;
    const healthyCount = sortedRepos.filter(r => r.score >= 80).length;
    const needsWorkCount = sortedRepos.filter(r => r.score < 60).length;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        💚 Repository Health
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">Analyze the health of your repositories</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <HeartPulse className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <div className="text-3xl font-bold">{avgScore}%</div>
                        <div className="text-sm opacity-80">Average Health</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <div className="text-3xl font-bold">{healthyCount}</div>
                        <div className="text-sm opacity-80">Healthy Repos</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <div className="text-3xl font-bold">{needsWorkCount}</div>
                        <div className="text-sm opacity-80">Needs Work</div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Criteria */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Health Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            <FileText className="h-4 w-4" /> Description
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            <Code2 className="h-4 w-4" /> Language
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            <Shield className="h-4 w-4" /> Not Archived
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4" /> Has Stars
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            <Eye className="h-4 w-4" /> Recent Activity
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Repo List */}
            <div className="space-y-3">
                {sortedRepos.slice(0, 20).map((repo: any) => (
                    <Card key={repo.name} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold">{repo.name}</h3>
                                        {repo.language && (
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                                {repo.language}
                                            </span>
                                        )}
                                        {repo.is_archived && (
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                                                Archived
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                        {repo.description || 'No description'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3 w-3" /> {repo.stars_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork className="h-3 w-3" /> {repo.forks_count}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${getScoreColor(repo.score)}`}>
                                        {repo.score}%
                                    </div>
                                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                                        <div
                                            className={`h-2 rounded-full ${getScoreBg(repo.score)}`}
                                            style={{ width: `${repo.score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Health Checks */}
                            <div className="flex gap-2 mt-3">
                                {Object.entries(repo.checks).map(([key, value]) => (
                                    <span
                                        key={key}
                                        className={`text-xs ${value ? 'text-green-500' : 'text-red-400'}`}
                                    >
                                        {value ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
