import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import {
    Users, CreditCard, TrendingUp, Settings, LogOut,
    RefreshCw, Search, ChevronDown, Shield, Database,
    Activity, DollarSign, UserCheck, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
    id: string;
    name: string;
    email: string;
    github_username: string;
    subscription_tier: string;
    created_at: string;
}

interface Stats {
    totalUsers: number;
    proUsers: number;
    premiumUsers: number;
    totalRevenue: number;
    activeToday: number;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        proUsers: 0,
        premiumUsers: 0,
        totalRevenue: 0,
        activeToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'subscriptions' | 'settings'>('overview');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.stats);
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        toast.success('Logged out');
        navigate('/admin/login');
    };

    const handleUpdateSubscription = async (userId: string, tier: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/admin/update-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, tier })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`Subscription updated to ${tier}`);
                fetchData();
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/admin/delete-user/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                toast.success('User deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.github_username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1117] text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Admin Portal
                            </h1>
                            <p className="text-xs font-medium text-slate-500 tracking-wider uppercase">System Control</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 px-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-400">System Online</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchData}
                            className="text-slate-400 hover:text-white hover:bg-white/5"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
                {/* Navigation Tabs */}
                <nav className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'users', label: 'User Management', icon: Users },
                        { id: 'subscriptions', label: 'Revenue & Plans', icon: CreditCard },
                        { id: 'settings', label: 'System Settings', icon: Settings }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedTab === tab.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-white/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {selectedTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {[
                            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', subtext: '+12% from last month' },
                            { label: 'Pro Members', value: stats.proUsers, icon: UserCheck, color: 'purple', subtext: 'Growing steadily' },
                            { label: 'Premium Elite', value: stats.premiumUsers, icon: CreditCard, color: 'orange', subtext: 'High value customers' },
                            { label: 'Monthly Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'emerald', subtext: ' Recurring revenue' }
                        ].map((stat, i) => (
                            <div key={i} className="group relative overflow-hidden bg-[#1a1d24] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-[50px] group-hover:bg-${stat.color}-500/10 transition-all`} />
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                                    <div className="text-3xl font-bold text-white mt-1 group-hover:tracking-wide transition-all">{stat.value}</div>
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-green-400" />
                                        {stat.subtext}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedTab === 'users' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-300 blur-sm" />
                            <div className="relative flex items-center bg-[#1a1d24] rounded-xl border border-white/10 p-2">
                                <Search className="h-5 w-5 text-slate-400 ml-3" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 h-10 px-4"
                                />
                                <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-xs text-slate-400 font-medium">{filteredUsers.length} Results</span>
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-[#1a1d24]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</th>
                                            <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub Identity</th>
                                            <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan & Status</th>
                                            <th className="text-left py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                                            <th className="text-right py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 p-[2px] ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all">
                                                            <div className="w-full h-full rounded-full bg-[#1a1d24] flex items-center justify-center overflow-hidden">
                                                                <span className="text-sm font-bold text-white max-w-full truncate px-1">
                                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{user.name || 'Unknown User'}</div>
                                                            <div className="text-xs text-slate-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <a
                                                        href={`https://github.com/${user.github_username}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#0d1117] border border-white/10 rounded-full text-xs font-medium text-slate-300 hover:border-white/30 hover:text-white transition-all"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                        @{user.github_username}
                                                    </a>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="relative">
                                                        <select
                                                            value={user.subscription_tier || 'free'}
                                                            onChange={(e) => handleUpdateSubscription(user.id, e.target.value)}
                                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1d24] transition-all ${user.subscription_tier === 'premium' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white ring-orange-500' :
                                                                user.subscription_tier === 'pro' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white ring-purple-500' :
                                                                    'bg-slate-700 text-slate-300 hover:bg-slate-600 ring-slate-500'
                                                                }`}
                                                        >
                                                            <option value="free" className="text-slate-900">Free Tier</option>
                                                            <option value="pro" className="text-slate-900">Pro Plan</option>
                                                            <option value="premium" className="text-slate-900">Premium</option>
                                                        </select>
                                                        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${['premium', 'pro'].includes(user.subscription_tier) ? 'text-white/80' : 'text-slate-400'
                                                            }`} />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-slate-400 font-medium tabular-nums">
                                                        {new Date(user.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                                                        title="Delete User"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === 'subscriptions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative overflow-hidden bg-[#1a1d24] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-[50px] group-hover:bg-slate-500/10 transition-all" />
                                <div className="relative z-10">
                                    <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full" />
                                        Free Users
                                    </h3>
                                    <div className="text-4xl font-bold text-white mt-2 group-hover:tracking-wide transition-all">
                                        {stats.totalUsers - stats.proUsers - stats.premiumUsers}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">No direct revenue</p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden bg-[#1a1d24] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px] group-hover:bg-purple-500/10 transition-all" />
                                <div className="relative z-10">
                                    <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                        Pro Users
                                    </h3>
                                    <div className="text-4xl font-bold text-white mt-2 group-hover:tracking-wide transition-all">{stats.proUsers}</div>
                                    <p className="text-xs text-slate-500 mt-2">Est. ₹{stats.proUsers * 199}/mo</p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden bg-[#1a1d24] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[50px] group-hover:bg-orange-500/10 transition-all" />
                                <div className="relative z-10">
                                    <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                        Premium Users
                                    </h3>
                                    <div className="text-4xl font-bold text-white mt-2 group-hover:tracking-wide transition-all">{stats.premiumUsers}</div>
                                    <p className="text-xs text-slate-500 mt-2">Est. ₹{stats.premiumUsers * 499}/mo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === 'settings' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-[#1a1d24]/80 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-5">System Configuration</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-blue-400" />
                                        <div>
                                            <p className="text-white font-medium">Database Connection</p>
                                            <p className="text-sm text-slate-500">Primary data storage via Supabase</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                        Operational
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-purple-400" />
                                        <div>
                                            <p className="text-white font-medium">API Gateway Status</p>
                                            <p className="text-sm text-slate-500">All microservices are responsive</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className={`h-5 w-5 ${maintenanceMode ? 'text-red-400' : 'text-orange-400'}`} />
                                        <div>
                                            <p className="text-white font-medium">Maintenance Mode</p>
                                            <p className="text-sm text-slate-500">
                                                {maintenanceMode
                                                    ? 'Users cannot access the app during maintenance'
                                                    : 'Temporarily disable user access for updates'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setMaintenanceMode(!maintenanceMode);
                                            toast.success(maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled');
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${maintenanceMode
                                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {maintenanceMode ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
