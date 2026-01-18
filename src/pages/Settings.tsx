import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { cn } from "../utils/cn";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "account", label: "Account" },
        { id: "preferences", label: "Preferences" },
        { id: "subscription", label: "Subscription" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

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
                                <CardDescription>Manage your public profile information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input defaultValue="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <Input defaultValue="Full Stack Developer" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Website</label>
                                    <Input defaultValue="https://johndoe.com" />
                                </div>
                                <Button>Save Changes</Button>
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
                                <CardDescription>Manage your account settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input defaultValue="john@example.com" disabled />
                                </div>
                                <Button variant="destructive">Delete Account</Button>
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
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Pro Plan</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">You are currently on the Pro plan.</p>
                                </div>
                                <Button>Manage Subscription</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
