import { LayoutDashboard, BarChart2, FolderGit2, Settings, Activity, Trophy, Dna, Gift, Medal, Users, Clock, CreditCard, HeartPulse, LogOut, Lock, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../hooks/useSubscription";

interface NavItem {
    name: string;
    href: string;
    icon: any;
    tier?: 'pro' | 'premium';
}

const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Developer DNA", href: "/dna", icon: Dna, tier: 'pro' },
    { name: "GitHub Wrapped", href: "/wrapped", icon: Gift, tier: 'pro' },
    { name: "Achievements", href: "/achievements", icon: Medal, tier: 'pro' },
    { name: "Compare Stats", href: "/compare", icon: Users, tier: 'pro' },
    { name: "Time Machine", href: "/time-machine", icon: Clock, tier: 'premium' },
    { name: "Profile Card", href: "/profile-card", icon: CreditCard, tier: 'premium' },
    { name: "Repo Health", href: "/repo-health", icon: HeartPulse, tier: 'premium' },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Skills", href: "/skills", icon: Trophy },
    { name: "Repositories", href: "/repositories", icon: FolderGit2 },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { tier, isPro, isPremium } = useSubscription();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isFeatureLocked = (item: NavItem) => {
        if (!item.tier) return false;
        if (item.tier === 'pro' && !isPro) return true;
        if (item.tier === 'premium' && !isPremium) return true;
        return false;
    };

    const getTierBadge = (itemTier?: 'pro' | 'premium') => {
        if (itemTier === 'pro') return 'PRO';
        if (itemTier === 'premium') return 'PREMIUM';
        return null;
    };

    const handleNavClick = () => {
        // Close sidebar on mobile after navigation
        if (onClose) {
            onClose();
        }
    };

    return (
        <aside className={cn(
            "w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full",
            // Mobile: full screen overlay
            "fixed inset-y-0 left-0 z-50 lg:relative lg:z-0",
            // Slide animation
            "transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200 dark:border-slate-800">
                <Link to="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GI</span>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GitInsights
                    </span>
                </Link>
                {/* Close button - mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Subscription Badge */}
            <div className="px-4 py-2">
                <div className={cn(
                    "px-3 py-1.5 rounded-lg text-center text-xs font-semibold",
                    tier === 'premium' ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" :
                        tier === 'pro' ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white" :
                            "bg-slate-100 dark:bg-slate-800 text-slate-500"
                )}>
                    {tier.toUpperCase()} Plan
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    const locked = isFeatureLocked(item);
                    const badge = getTierBadge(item.tier);

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleNavClick}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    : locked
                                        ? "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1 truncate">{item.name}</span>
                            {locked && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Lock className="h-3 w-3 text-slate-400" />
                                    {badge && (
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded font-semibold hidden sm:inline",
                                            item.tier === 'premium'
                                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                        )}>
                                            {badge}
                                        </span>
                                    )}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                        ) : (
                            getInitials(user?.name || 'User')
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || user?.github_username}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

// Mobile Header component
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GI</span>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GitInsights
                    </span>
                </div>
            </div>
            {/* Could add user avatar or notification icon here */}
        </div>
    );
}

// Deprecated: Mobile menu button (we use MobileHeader now, keeping for compatibility if needed)
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg"
        >
            <Menu className="h-5 w-5" />
        </button>
    );
}

// Overlay for mobile sidebar
export function SidebarOverlay({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClick}
        />
    );
}
