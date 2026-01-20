import { LayoutDashboard, BarChart2, FolderGit2, Settings, Activity, Trophy, FileCode2, Bot, Radio, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Skills", href: "/skills", icon: Trophy },
    { name: "Code Review", href: "/code-review", icon: FileCode2 },
    { name: "AI Mentor", href: "/mentor", icon: Bot },
    { name: "Collaborate", href: "/collaborate", icon: Radio },
    { name: "Repositories", href: "/repositories", icon: FolderGit2 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
            <div className="flex h-16 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Activity className="h-6 w-6 text-blue-600" />
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
                                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group overflow-hidden",
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                            )}
                        >
                            {isActive && (
                                <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600 dark:border-blue-400 animate-slide-in-left" />
                            )}
                            <Icon className={cn("h-4 w-4 z-10 transition-transform group-hover:scale-110", isActive && "text-blue-600 dark:text-blue-400")} />
                            <span className="z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-medium text-white shadow-lg shadow-blue-500/20">
                            {user ? getInitials(user.name || user.github_username) : 'JD'}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">{user?.name || user?.github_username || 'John Doe'}</span>
                            <span className="text-xs text-slate-500 truncate">{user?.subscription_tier || 'Free'} Plan</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
