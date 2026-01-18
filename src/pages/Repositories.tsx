import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Search, Star, GitFork } from "lucide-react";
import { cn } from "../utils/cn";

const allRepos = [
    { id: 1, name: "awesome-project", desc: "A very awesome project that does cool things", lang: "TypeScript", stars: 120, forks: 34, updated: "2 days ago", visibility: "Public" },
    { id: 2, name: "react-components", desc: "Reusable UI components built with Radix UI", lang: "JavaScript", stars: 89, forks: 12, updated: "1 week ago", visibility: "Public" },
    { id: 3, name: "data-pipeline", desc: "High performance data processing pipeline", lang: "Python", stars: 45, forks: 5, updated: "3 weeks ago", visibility: "Private" },
    { id: 4, name: "notes-app", desc: "Simple markdown notes app", lang: "Rust", stars: 12, forks: 0, updated: "1 month ago", visibility: "Public" },
    { id: 5, name: "portfolio-v1", desc: "Old portfolio website", lang: "HTML", stars: 2, forks: 0, updated: "2 years ago", visibility: "Public" },
    { id: 6, name: "api-gateway", desc: "Microservices gateway implementation", lang: "Go", stars: 67, forks: 15, updated: "5 hours ago", visibility: "Private" },
];

export default function Repositories() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredRepos = allRepos.filter(repo =>
        (filter === "All" || repo.lang === filter || repo.visibility === filter) &&
        repo.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                <Button>New Repository</Button>
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
                    {["All", "Public", "Private", "TypeScript", "Python", "JavaScript"].map(f => (
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

            <div className="grid gap-4">
                {filteredRepos.map(repo => (
                    <Card key={repo.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">{repo.name}</h3>
                                        <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">{repo.visibility}</Badge>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">{repo.desc}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                        <span className={cn("flex items-center gap-1",
                                            repo.lang === "TypeScript" ? "text-blue-500" :
                                                repo.lang === "Python" ? "text-yellow-600" :
                                                    repo.lang === "JavaScript" ? "text-yellow-400" :
                                                        repo.lang === "Go" ? "text-cyan-400" : "text-slate-500"
                                        )}>
                                            <span className="w-2 h-2 rounded-full bg-current" />
                                            {repo.lang}
                                        </span>
                                        <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {repo.stars}</span>
                                        <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {repo.forks}</span>
                                        <span>Updated {repo.updated}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Star className="h-4 w-4 mr-2" /> Star
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
        </div>
    );
}
