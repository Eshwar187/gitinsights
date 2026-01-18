import { GitCommit, FolderGit2, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export function StatsCards() {
    const stats = [
        {
            title: "Total Commits",
            value: "1,234",
            change: "+12.5%",
            icon: GitCommit,
            desc: "from last month",
        },
        {
            title: "Total Repositories",
            value: "42",
            change: "+2",
            icon: FolderGit2,
            desc: "active projects",
        },
        {
            title: "Total Stars",
            value: "892",
            change: "+156",
            icon: Star,
            desc: "received all time",
        },
        {
            title: "Followers",
            value: "345",
            change: "+24",
            icon: Users,
            desc: "new followers",
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
