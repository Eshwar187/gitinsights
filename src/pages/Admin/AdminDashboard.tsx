import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
    Users, CreditCard, TrendingUp, Settings, LogOut,
    RefreshCw, Search, ChevronDown, Shield, Database,
    Activity, DollarSign, UserCheck, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

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
            const response = await fetch('/api/admin/stats', {
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
            const response = await fetch('/api/admin/update-subscription', {
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
            const response = await fetch(`/api/admin/delete-user/${userId}`, {
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
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">GitInsights Admin</h1>
                            <p className="text-xs text-slate-400">Control Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchData}
                            className="text-slate-300 border-slate-600"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="text-red-400 border-red-600 hover:bg-red-600/10"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-slate-800/50 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex gap-6">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${selectedTab === tab.id
                                        ? 'border-orange-500 text-orange-400'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto p-6">
                {selectedTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Total Users</p>
                                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <Users className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Pro Users</p>
                                            <p className="text-3xl font-bold text-white">{stats.proUsers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <UserCheck className="h-6 w-6 text-purple-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Premium Users</p>
                                            <p className="text-3xl font-bold text-white">{stats.premiumUsers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                                            <CreditCard className="h-6 w-6 text-orange-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Monthly Revenue</p>
                                            <p className="text-3xl font-bold text-white">₹{stats.totalRevenue}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-green-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Users */}
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.name || user.github_username}</p>
                                                    <p className="text-sm text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.subscription_tier === 'premium' ? 'bg-orange-500/20 text-orange-400' :
                                                    user.subscription_tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-slate-600 text-slate-300'
                                                }`}>
                                                {user.subscription_tier || 'free'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {selectedTab === 'users' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500"
                            />
                        </div>

                        {/* Users Table */}
                        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700/50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">User</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">GitHub</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Plan</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Joined</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-700/30">
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="text-white font-medium">{user.name || 'Unknown'}</p>
                                                        <p className="text-sm text-slate-400">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-300">@{user.github_username}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={user.subscription_tier || 'free'}
                                                        onChange={(e) => handleUpdateSubscription(user.id, e.target.value)}
                                                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="pro">Pro</option>
                                                        <option value="premium">Premium</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-slate-400 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-400 border-red-600 hover:bg-red-600/10"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {selectedTab === 'subscriptions' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-400 rounded-full" />
                                        Free Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-white">
                                        {stats.totalUsers - stats.proUsers - stats.premiumUsers}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">₹0 revenue</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                                        Pro Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-white">{stats.proUsers}</p>
                                    <p className="text-sm text-slate-400 mt-2">₹{stats.proUsers * 199}/mo</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                                        Premium Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-white">{stats.premiumUsers}</p>
                                    <p className="text-sm text-slate-400 mt-2">₹{stats.premiumUsers * 499}/mo</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {selectedTab === 'settings' && (
                    <div className="space-y-6">
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">System Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-blue-400" />
                                        <div>
                                            <p className="text-white font-medium">Database Status</p>
                                            <p className="text-sm text-slate-400">Supabase connection</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                        Connected
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-purple-400" />
                                        <div>
                                            <p className="text-white font-medium">API Status</p>
                                            <p className="text-sm text-slate-400">Backend services</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                        Operational
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                                        <div>
                                            <p className="text-white font-medium">Maintenance Mode</p>
                                            <p className="text-sm text-slate-400">Disable user access</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-600 text-slate-300 rounded-full text-sm">
                                        Off
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
