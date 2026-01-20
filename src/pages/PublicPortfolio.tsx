import { Github, Star, GitFork } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getDeveloperScores } from "../services/analyticsService";
import { getRepositories } from "../services/githubService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PublicPortfolio() {
    const { user } = useAuth();

    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['portfolioScores'],
        queryFn: getDeveloperScores
    });

    const { data: reposData, isLoading: reposLoading } = useQuery({
        queryKey: ['portfolioRepos'],
        queryFn: () => getRepositories(1, 5) // Top 5 repos
    });

    const scores = scoreData?.data || {};
    const repos = reposData?.data || [];
    const isLoading = scoresLoading || reposLoading;

    const initials = user?.name?.[0] || user?.github_username?.[0] || 'U';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.name || user?.github_username || 'Developer'}</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400">@{user?.github_username || 'username'}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                                <a
                                    href={`https://github.com/${user?.github_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-blue-600"
                                >
                                    <Github className="h-4 w-4" /> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.open(`https://github.com/${user?.github_username}`, '_blank')}
                        >
                            <Github className="h-4 w-4 mr-2" /> View on GitHub
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                {isLoading ? (
                    <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{scores.total_commits || 0}</div>
                                <div className="text-xs text-slate-500">Commits</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{scores.total_repos || 0}</div>
                                <div className="text-xs text-slate-500">Repositories</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{scores.total_stars || 0}</div>
                                <div className="text-xs text-slate-500">Stars</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{scores.overall_score || 0}</div>
                                <div className="text-xs text-slate-500">Dev Score</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Heatmap */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Contribution Graph</h3>
                        <ContributionHeatmap />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <TopLanguages />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Top Repositories</h3>
                        {repos.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">No repositories yet</div>
                        ) : (
                            repos.map((repo: any) => (
                                <Card key={repo.id} className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => window.open(repo.url, '_blank')}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-blue-600">{repo.name}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {repo.description || 'No description'}
                                                </p>
                                                <div className="flex gap-2 mt-3">
                                                    {repo.language && (
                                                        <Badge variant="secondary">{repo.language}</Badge>
                                                    )}
                                                    {repo.topics?.slice(0, 2).map((topic: string) => (
                                                        <Badge key={topic} variant="outline">{topic}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3" /> {repo.stars_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <GitFork className="h-3 w-3" /> {repo.forks_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

