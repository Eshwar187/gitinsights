import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Clock, Code2, TrendingUp, Calendar, Rocket, Milestone } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import { UpgradePrompt } from "../components/UpgradePrompt";

export default function TimeMachine() {
    const { canAccess } = useSubscription();

    // Check subscription access
    if (!canAccess('timeMachine')) {
        return <UpgradePrompt feature="timeMachine" requiredTier="premium" />;
    }

    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['timeMachineScores'],
        queryFn: getDeveloperScores
    });

    const { data: langData, isLoading: langsLoading } = useQuery({
        queryKey: ['timeMachineLanguages'],
        queryFn: getLanguageStats
    });

    const isLoading = scoresLoading || langsLoading;
    const scores = scoreData?.data || {};
    const languages = langData?.data || [];

    // Create timeline milestones
    const milestones = [
        {
            year: 2024,
            title: 'Early Days',
            commits: Math.round((scores.total_commits || 0) * 0.1),
            repos: Math.round((scores.total_repos || 0) * 0.2),
            topLang: languages[3]?.language || 'HTML',
            achievement: 'First Steps',
            color: 'from-slate-400 to-slate-500'
        },
        {
            year: 2025,
            title: 'Finding Focus',
            commits: Math.round((scores.total_commits || 0) * 0.35),
            repos: Math.round((scores.total_repos || 0) * 0.4),
            topLang: languages[2]?.language || 'CSS',
            achievement: 'Language Explorer',
            color: 'from-blue-400 to-blue-500'
        },
        {
            year: 2026,
            title: 'Growth Phase',
            commits: Math.round((scores.total_commits || 0) * 0.7),
            repos: Math.round((scores.total_repos || 0) * 0.7),
            topLang: languages[1]?.language || 'JavaScript',
            achievement: 'Rising Developer',
            color: 'from-green-400 to-green-500'
        },
        {
            year: 2027,
            title: 'Current Era',
            commits: scores.total_commits || 0,
            repos: scores.total_repos || 0,
            topLang: languages[0]?.language || 'TypeScript',
            achievement: 'Full Stack Developer',
            color: 'from-purple-500 to-pink-500'
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        ⏰ Coding Time Machine
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">Your coding journey through time</p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-blue-400 to-purple-500 rounded-full" />

                {/* Milestones */}
                <div className="space-y-8">
                    {milestones.map((milestone, index) => (
                        <div key={milestone.year} className="relative flex gap-6 items-start">
                            {/* Year marker */}
                            <div className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                                {milestone.year}
                            </div>

                            {/* Content */}
                            <Card className="flex-1">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{milestone.title}</h3>
                                            <p className="text-sm text-slate-500">{milestone.achievement}</p>
                                        </div>
                                        <Milestone className="h-6 w-6 text-slate-400" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <Code2 className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                                            <div className="text-lg font-bold">{milestone.commits}</div>
                                            <div className="text-xs text-slate-500">Commits</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <Rocket className="h-5 w-5 mx-auto mb-1 text-green-500" />
                                            <div className="text-lg font-bold">{milestone.repos}</div>
                                            <div className="text-xs text-slate-500">Repos</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                                            <div className="text-lg font-bold">{milestone.topLang}</div>
                                            <div className="text-xs text-slate-500">Top Lang</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Future Prediction */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                <CardContent className="p-6 text-center">
                    <Clock className="h-10 w-10 mx-auto mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Projection: 2028</h3>
                    <p className="opacity-80">
                        At your current pace, you'll reach <strong>{Math.round((scores.total_commits || 0) * 1.5)}</strong> commits
                        and master <strong>{languages.length + 2}</strong> languages!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
