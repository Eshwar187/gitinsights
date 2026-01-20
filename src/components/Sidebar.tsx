import { LayoutDashboard, BarChart2, FolderGit2, Settings, Activity, Trophy, Dna, Gift, Medal, Users, Clock, CreditCard, HeartPulse, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Developer DNA", href: "/dna", icon: Dna },
    { name: "GitHub Wrapped", href: "/wrapped", icon: Gift },
    { name: "Achievements", href: "/achievements", icon: Medal },
    { name: "Compare Stats", href: "/compare", icon: Users },
    { name: "Time Machine", href: "/time-machine", icon: Clock },
    { name: "Profile Card", href: "/profile-card", icon: CreditCard },
    { name: "Repo Health", href: "/repo-health", icon: HeartPulse },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Skills", href: "/skills", icon: Trophy },
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
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GI</span>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GitInsights
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                        ) : (
                            getInitials(user?.name || 'User')
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">@{user?.github_username || 'user'}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
