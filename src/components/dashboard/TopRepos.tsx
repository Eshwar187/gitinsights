import { Star, GitFork, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const repos = [
    {
        name: "awesome-project",
        description: "A very awesome project that does cool things",
        language: "TypeScript",
        stars: 120,
        forks: 34,
        updated: "2 days ago"
    },
    {
        name: "react-components",
        description: " reusable UI components built with Radix UI",
        language: "JavaScript",
        stars: 89,
        forks: 12,
        updated: "1 week ago"
    },
    {
        name: "data-pipeline",
        description: "High performance data processing pipeline",
        language: "Python",
        stars: 45,
        forks: 5,
        updated: "3 weeks ago"
    }
];

export function TopRepos() {
    return (
        <Card className="col-span-3 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Top Repositories</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {repos.map((repo) => (
                        <div key={repo.name} className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:pb-0 last:border-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold hover:text-blue-600 cursor-pointer">{repo.name}</h4>
                                    <Badge variant="secondary" className="text-[10px] h-5">{repo.language}</Badge>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1">{repo.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {repo.stars}</span>
                                    <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {repo.forks}</span>
                                    <span>Updated {repo.updated}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
