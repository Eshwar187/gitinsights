import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Search, Star, GitFork, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getRepositories } from "../services/githubService";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export default function Repositories() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const { data: reposData, isLoading, error } = useQuery({
        queryKey: ['allRepositories'],
        queryFn: () => getRepositories(1, 100) // Get up to 100 repos
    });

    const repos = reposData?.data || [];

    const filteredRepos = repos.filter((repo: any) =>
        (filter === "All" ||
            repo.language === filter ||
            (filter === "Public" && !repo.is_private) ||
            (filter === "Private" && repo.is_private)) &&
        repo.name.toLowerCase().includes(search.toLowerCase())
    );

    // Get unique languages for filter
    const languages: string[] = [...new Set(repos.map((r: any) => r.language).filter(Boolean))] as string[];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Repositories {repos.length > 0 && <span className="text-slate-500 text-lg">({repos.length})</span>}
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search repositories..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {["All", "Public", "Private", ...languages.slice(0, 4)].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">
                    Failed to load repositories. Please try again.
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRepos.map((repo: any) => (
                        <Card key={repo.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3
                                                className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer"
                                                onClick={() => repo.url && window.open(repo.url, '_blank')}
                                            >
                                                {repo.name}
                                            </h3>
                                            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
                                                {repo.is_private ? "Private" : "Public"}
                                            </Badge>
                                            {repo.is_fork && (
                                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px]">
                                                    Fork
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                                            {repo.description || "No description"}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                            {repo.language && (
                                                <span className={cn("flex items-center gap-1",
                                                    repo.language === "TypeScript" ? "text-blue-500" :
                                                        repo.language === "Python" ? "text-yellow-600" :
                                                            repo.language === "JavaScript" ? "text-yellow-400" :
                                                                repo.language === "Go" ? "text-cyan-400" : "text-slate-500"
                                                )}>
                                                    <span className="w-2 h-2 rounded-full bg-current" />
                                                    {repo.language}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3 w-3" /> {repo.stars_count || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="h-3 w-3" /> {repo.forks_count || 0}
                                            </span>
                                            <span>
                                                Updated {repo.github_updated_at
                                                    ? formatDistanceToNow(new Date(repo.github_updated_at), { addSuffix: true })
                                                    : 'recently'}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => repo.url && window.open(repo.url, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredRepos.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No repositories found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

