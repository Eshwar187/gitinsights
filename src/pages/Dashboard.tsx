import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Download, RefreshCw, Sparkles, Lock } from "lucide-react";
import { StatsCards } from "../components/dashboard/StatsCards";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { TopRepos } from "../components/dashboard/TopRepos";
import { DeveloperScore } from "../components/dashboard/DeveloperScore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { AIInsightsModal } from "../components/modals/AIInsightsModal";
import { syncGitHubData } from "../services/githubService";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [showAI, setShowAI] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncLimitReached, setSyncLimitReached] = useState(false);
    const queryClient = useQueryClient();
    const hasSynced = useRef(false);
    const { access, tier } = useSubscription();
    const navigate = useNavigate();

    // Auto-sync on first load
    useEffect(() => {
        const autoSync = async () => {
            // Only sync once per session
            if (hasSynced.current) return;

            // Check if we've synced recently (within last 5 mins)
            const lastSync = localStorage.getItem('lastGitHubSync');
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

            if (lastSync && parseInt(lastSync) > fiveMinutesAgo) {
                hasSynced.current = true;
                return;
            }

            hasSynced.current = true;
            setSyncing(true);
            try {
                await syncGitHubData();
                localStorage.setItem('lastGitHubSync', Date.now().toString());
                queryClient.invalidateQueries();
            } catch (error: any) {
                // Check if rate limit reached
                if (error.response?.status === 429) {
                    setSyncLimitReached(true);
                }
                console.error('Auto-sync failed:', error);
            } finally {
                setSyncing(false);
            }
        };

        autoSync();
    }, [queryClient]);

    const handleSync = async () => {
        if (syncLimitReached) {
            toast.error("Daily sync limit reached. Upgrade for more syncs!");
            return;
        }

        setSyncing(true);
        try {
            await syncGitHubData();
            localStorage.setItem('lastGitHubSync', Date.now().toString());
            toast.success("GitHub data synced successfully!");
            queryClient.invalidateQueries();
        } catch (error: any) {
            // Handle rate limit (429) error specially
            if (error.response?.status === 429) {
                setSyncLimitReached(true);
                const message = error.response?.data?.message || "Daily sync limit reached";
                toast.error(message, { duration: 5000 });
            } else {
                toast.error(error.response?.data?.error || "Failed to sync data");
            }
        } finally {
            setSyncing(false);
        }
    };

    // Get sync limit display
    const syncLimit = access.syncsPerDay;
    const syncLimitText = syncLimit === Infinity ? "∞" : syncLimit;

    return (
        <div className="space-y-6">
            <AIInsightsModal isOpen={showAI} onClose={() => setShowAI(false)} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, here's your activity overview.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={() => setShowAI(true)}>
                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                        AI Insights
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <div className="relative">
                        <Button
                            size="sm"
                            onClick={handleSync}
                            disabled={syncing || syncLimitReached}
                            className={syncLimitReached ? "opacity-60" : ""}
                        >
                            {syncLimitReached ? (
                                <Lock className="mr-2 h-4 w-4" />
                            ) : (
                                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                            )}
                            {syncing ? 'Syncing...' : syncLimitReached ? 'Limit Reached' : 'Sync Data'}
                        </Button>
                        {/* Sync limit badge */}
                        <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${syncLimitReached
                                ? 'bg-red-500 text-white'
                                : tier === 'premium'
                                    ? 'bg-amber-500 text-white'
                                    : tier === 'pro'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-500 text-white'
                            }`}>
                            {syncLimitText}/day
                        </span>
                    </div>
                    {syncLimitReached && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate('/settings')}
                            className="text-amber-500 border-amber-500 hover:bg-amber-500/10"
                        >
                            Upgrade
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Heatmap Card */}
                <Card className="col-span-7 lg:col-span-5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Contribution Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ContributionHeatmap />
                    </CardContent>
                </Card>

                {/* Developer Score */}
                <div className="col-span-7 lg:col-span-2">
                    <DeveloperScore />
                </div>

                {/* Top Repos */}
                <div className="col-span-7 lg:col-span-4">
                    <TopRepos />
                </div>

                {/* Top Languages */}
                <div className="col-span-7 lg:col-span-3">
                    <TopLanguages />
                </div>
            </div>
        </div>
    );
}
