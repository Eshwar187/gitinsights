import { LayoutDashboard, BarChart2, FolderGit2, Settings, User, Activity, Trophy, FileCode2, Bot, Radio } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Skills", href: "/skills", icon: Trophy },
    { name: "Code Review", href: "/code-review", icon: FileCode2 },
    { name: "AI Mentor", href: "/mentor", icon: Bot },
    { name: "Collaborate", href: "/collaborate", icon: Radio },
    { name: "Repositories", href: "/repositories", icon: FolderGit2 },
    { name: "Portfolio", href: "/portfolio", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    GitInsights
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-medium">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">John Doe</span>
                        <span className="text-xs text-slate-500">Pro Plan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
