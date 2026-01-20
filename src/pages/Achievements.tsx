import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Trophy, Lock, CheckCircle, Flame, Star, Code2, Moon, Zap, Users, GitFork, Calendar, TrendingUp } from "lucide-react";

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    requirement: string;
    earned: boolean;
    progress: number;
    color: string;
}

export default function Achievements() {
    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['achievementScores'],
        queryFn: getDeveloperScores
    });

    const { data: langData, isLoading: langsLoading } = useQuery({
        queryKey: ['achievementLanguages'],
        queryFn: getLanguageStats
    });

    const isLoading = scoresLoading || langsLoading;
    const scores = scoreData?.data || {};
    const languages = langData?.data || [];

    // Calculate achievements
    const achievements: Achievement[] = [
        {
            id: 'streak-master',
            name: 'Streak Master',
            description: 'Maintain a 30-day coding streak',
            icon: <Flame className="h-6 w-6" />,
            requirement: '30 day streak',
            earned: (scores.longest_streak || 0) >= 30,
            progress: Math.min(100, ((scores.longest_streak || 0) / 30) * 100),
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'centurion',
            name: 'Centurion',
            description: 'Make 100+ commits',
            icon: <Code2 className="h-6 w-6" />,
            requirement: '100 commits',
            earned: (scores.total_commits || 0) >= 100,
            progress: Math.min(100, ((scores.total_commits || 0) / 100) * 100),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'prolific',
            name: 'Prolific',
            description: 'Push 1000+ commits',
            icon: <Zap className="h-6 w-6" />,
            requirement: '1000 commits',
            earned: (scores.total_commits || 0) >= 1000,
            progress: Math.min(100, ((scores.total_commits || 0) / 1000) * 100),
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'star-collector',
            name: 'Star Collector',
            description: 'Earn 50+ stars on your repos',
            icon: <Star className="h-6 w-6" />,
            requirement: '50 stars',
            earned: (scores.total_stars || 0) >= 50,
            progress: Math.min(100, ((scores.total_stars || 0) / 50) * 100),
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 'polyglot',
            name: 'Polyglot',
            description: 'Use 5+ programming languages',
            icon: <Code2 className="h-6 w-6" />,
            requirement: '5 languages',
            earned: languages.length >= 5,
            progress: Math.min(100, (languages.length / 5) * 100),
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'repo-master',
            name: 'Repository Master',
            description: 'Create 20+ repositories',
            icon: <GitFork className="h-6 w-6" />,
            requirement: '20 repositories',
            earned: (scores.total_repos || 0) >= 20,
            progress: Math.min(100, ((scores.total_repos || 0) / 20) * 100),
            color: 'from-indigo-500 to-purple-500'
        },
        {
            id: 'consistent',
            name: 'Consistency King',
            description: 'Code for 100+ active days',
            icon: <Calendar className="h-6 w-6" />,
            requirement: '100 active days',
            earned: (scores.active_days || 0) >= 100,
            progress: Math.min(100, ((scores.active_days || 0) / 100) * 100),
            color: 'from-teal-500 to-cyan-500'
        },
        {
            id: 'high-scorer',
            name: 'High Scorer',
            description: 'Reach 80+ overall developer score',
            icon: <TrendingUp className="h-6 w-6" />,
            requirement: '80/100 score',
            earned: (scores.overall_score || 0) >= 80,
            progress: Math.min(100, ((scores.overall_score || 0) / 80) * 100),
            color: 'from-rose-500 to-pink-500'
        },
    ];

    const earnedCount = achievements.filter(a => a.earned).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                        🏅 Achievements
                    </span>
                </h1>
                <p className="text-slate-500 mt-2">Your coding milestones and badges</p>
            </div>

            {/* Stats */}
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold">{earnedCount}</div>
                            <div className="text-sm opacity-80">Earned</div>
                        </div>
                        <Trophy className="h-12 w-12 opacity-80" />
                        <div className="text-center">
                            <div className="text-4xl font-bold">{achievements.length - earnedCount}</div>
                            <div className="text-sm opacity-80">Locked</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <Card
                        key={achievement.id}
                        className={`overflow-hidden transition-all ${achievement.earned
                                ? 'ring-2 ring-yellow-400 dark:ring-yellow-500'
                                : 'opacity-75 grayscale'
                            }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${achievement.color} text-white`}>
                                    {achievement.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{achievement.name}</h3>
                                        {achievement.earned ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">{achievement.description}</p>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{achievement.requirement}</span>
                                            <span>{Math.round(achievement.progress)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full bg-gradient-to-r ${achievement.color}`}
                                                style={{ width: `${achievement.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
