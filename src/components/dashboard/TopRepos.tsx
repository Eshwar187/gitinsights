import { Star, GitFork, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useQuery } from "@tanstack/react-query";
import { getRepositories } from "../../services/githubService";
import LoadingSpinner from "../LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export function TopRepos() {
    const { data: reposData, isLoading } = useQuery({
        queryKey: ['topRepositories'],
        queryFn: () => getRepositories(1, 5)  // Get top 5 repos
    });


    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Top Repositories</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <LoadingSpinner size="sm" />
                    </div>
                ) : !reposData?.success || !reposData.data?.length ? (
                    <div className="text-center text-slate-500 py-8 text-sm">
                        No repositories found. Connect your GitHub account to see your repos.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reposData.data.slice(0, 3).map((repo: any) => (
                            <div key={repo.id} className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:pb-0 last:border-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold hover:text-amber-500 cursor-pointer">
                                            {repo.name}
                                        </h4>
                                        {repo.language && (
                                            <Badge variant="secondary" className="text-[10px] h-5">
                                                {repo.language}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {repo.description || 'No description'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3 w-3" /> {repo.stars_count || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork className="h-3 w-3" /> {repo.forks_count || 0}
                                        </span>
                                        <span>
                                            Updated {repo.github_updated_at ? formatDistanceToNow(new Date(repo.github_updated_at), { addSuffix: true }) : 'recently'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => repo.url && window.open(repo.url, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 text-slate-400" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
