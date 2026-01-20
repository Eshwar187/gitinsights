import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { cn } from "../utils/cn";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { Github } from "lucide-react";
import { PaymentModal } from "../components/modals/PaymentModal";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string, price: string } | null>(null);
    const { user } = useAuth();

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "account", label: "Account" },
        { id: "preferences", label: "Preferences" },
        { id: "subscription", label: "Subscription" },
    ];

    const handleUpgrade = (planName: string, price: string) => {
        setSelectedPlan({ name: planName, price });
        setShowPaymentModal(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                plan={selectedPlan?.name || "Pro"}
                price={selectedPlan?.price || "₹199"}
            />

            <div className="flex flex-col md:flex-row gap-6">
                <aside className="w-full md:w-64">
                    <div className="flex flex-col space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md text-left transition-colors",
                                    activeTab === tab.id ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </aside>

                <div className="flex-1">
                    {activeTab === "profile" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your public profile information from GitHub.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {user?.name?.[0] || user?.github_username?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{user?.name || user?.github_username || 'User'}</h3>
                                        <p className="text-sm text-slate-500">@{user?.github_username || 'username'}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input defaultValue={user?.name || user?.github_username || ''} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input defaultValue={user?.email || ''} readOnly />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Github className="h-4 w-4" />
                                    Connected via GitHub
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === "preferences" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Customize your experience.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium">Appearance</h4>
                                        <p className="text-xs text-slate-500">Toggle light/dark mode.</p>
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === "account" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>Your account details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">User ID</label>
                                    <Input defaultValue={user?.id || ''} disabled className="font-mono text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">GitHub Username</label>
                                    <Input defaultValue={user?.github_username || ''} disabled />
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                                    <h4 className="font-semibold text-green-900 dark:text-green-100">GitHub Connected</h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">Your GitHub account is connected and syncing.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === "subscription" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription</CardTitle>
                                <CardDescription>Manage your billing and plan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 capitalize">{user?.subscription_tier || 'Free'} Plan</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {user?.subscription_tier === 'free' || !user?.subscription_tier
                                            ? 'Upgrade for more features and unlimited syncs.'
                                            : 'You have access to all premium features.'}
                                    </p>
                                </div>
                                {(user?.subscription_tier === 'free' || !user?.subscription_tier) && (
                                    <div className="flex gap-3">
                                        <Button onClick={() => handleUpgrade('Pro', '₹199')}>
                                            Upgrade to Pro - ₹199/mo
                                        </Button>
                                        <Button variant="outline" onClick={() => handleUpgrade('Premium', '₹499')}>
                                            Premium - ₹499/mo
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
