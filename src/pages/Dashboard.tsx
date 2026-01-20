import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Download, RefreshCw, Sparkles } from "lucide-react";
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

export default function Dashboard() {
    const [showAI, setShowAI] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const queryClient = useQueryClient();
    const hasSynced = useRef(false);

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
            } catch (error) {
                console.error('Auto-sync failed:', error);
            } finally {
                setSyncing(false);
            }
        };

        autoSync();
    }, [queryClient]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncGitHubData();
            localStorage.setItem('lastGitHubSync', Date.now().toString());
            toast.success("GitHub data synced successfully!");
            queryClient.invalidateQueries();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to sync data");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <AIInsightsModal isOpen={showAI} onClose={() => setShowAI(false)} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, here's your activity overview.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAI(true)}>
                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                        AI Insights
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm" onClick={handleSync} disabled={syncing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Data'}
                    </Button>
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
