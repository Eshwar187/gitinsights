import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { getDeveloperScores } from "../services/analyticsService";
import { getLanguageStats } from "../services/analyticsService";
import {
    calculateCodingStyle,
    calculateProductivity,
    calculateLanguageGenome,
    generateProfile
} from "../services/dnaService";
import LoadingSpinner from "../components/LoadingSpinner";
import { DNAVisualization } from "../components/dna/DNAVisualization";
import { Moon, Sun, Zap, Target, Code2, TrendingUp, Flame, Award } from "lucide-react";

export default function DeveloperDNA() {
    const { data: scoreData, isLoading: scoresLoading } = useQuery({
        queryKey: ['dnaScores'],
        queryFn: getDeveloperScores
    });

    const { data: langData, isLoading: langsLoading } = useQuery({
        queryKey: ['dnaLanguages'],
        queryFn: getLanguageStats
    });

    const isLoading = scoresLoading || langsLoading;
    const scores = scoreData?.data || {};
    const languages = langData?.data || [];

    // Calculate DNA components
    const codingStyle = calculateCodingStyle([]);
    const productivity = calculateProductivity([], scores.longest_streak || 0);
    const languageGenome = calculateLanguageGenome(languages);
    const profile = generateProfile(codingStyle, productivity, languageGenome);

    // Determine actual coding style from activity score
    const activityScore = scores.activity_score || 0;
    const consistencyScore = scores.consistency_score || 0;

    // Enhanced profile based on real data
    const enhancedProfile = {
        ...profile,
        title: activityScore > 50
            ? (consistencyScore > 50 ? '⚡ Power Developer' : '🚀 Burst Coder')
            : (consistencyScore > 50 ? '🎯 Steady Builder' : '🌱 Growing Developer'),
        archetype: `${languageGenome.primary} ${profile.title.split(' ').slice(1).join(' ')}`
    };

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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🧬 Your Developer DNA
                </h1>
                <p className="text-slate-500 mt-2">
                    A unique fingerprint of your coding patterns and style
                </p>
            </div>

            {/* DNA Visualization */}
            <Card className="overflow-hidden border-0 shadow-xl">
                <DNAVisualization
                    primaryColor="#3178c6"
                    secondaryColor="#f1e05a"
                    languages={languages}
                />
            </Card>

            {/* Profile Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">{enhancedProfile.title}</h2>
                        <p className="text-lg opacity-90 mb-4">{enhancedProfile.archetype}</p>
                        <p className="text-sm opacity-80 max-w-lg mx-auto">
                            {enhancedProfile.description}
                        </p>
                        <div className="flex justify-center gap-2 mt-6">
                            {enhancedProfile.strengths.map((strength, i) => (
                                <Badge key={i} variant="secondary" className="bg-white/20 text-white border-0">
                                    {strength}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DNA Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                                <Code2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Primary Language</p>
                                <p className="text-xl font-bold">{languageGenome.primary}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                                <Flame className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Longest Streak</p>
                                <p className="text-xl font-bold">{scores.longest_streak || 0} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Activity Score</p>
                                <p className="text-xl font-bold">{scores.activity_score || 0}/100</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                                <Award className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Overall Score</p>
                                <p className="text-xl font-bold">{scores.overall_score || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Language Genome */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Language Genome
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {languages.slice(0, 6).map((lang: any, index: number) => (
                            <div key={lang.language} className="flex items-center gap-4">
                                <div className="w-24 text-sm font-medium">{lang.language}</div>
                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${lang.percentage}%`,
                                            background: index === 0 ? 'linear-gradient(90deg, #3178c6, #4a90d9)' :
                                                index === 1 ? 'linear-gradient(90deg, #f1e05a, #f7dc6f)' :
                                                    index === 2 ? 'linear-gradient(90deg, #3572A5, #5a8fc7)' :
                                                        '#888888'
                                        }}
                                    />
                                </div>
                                <div className="w-16 text-right text-sm text-slate-500">
                                    {lang.percentage}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Coding Pattern Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {codingStyle.type === 'night_owl' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            Coding Rhythm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Active Days</span>
                                <span className="font-bold">{scores.active_days || 0} days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Total Commits</span>
                                <span className="font-bold">{scores.total_commits || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Consistency</span>
                                <span className="font-bold">{scores.consistency_score || 0}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Productivity DNA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Repositories</span>
                                <span className="font-bold">{scores.total_repos || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Stars Earned</span>
                                <span className="font-bold">{scores.total_stars || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Language Diversity</span>
                                <span className="font-bold">{languages.length} languages</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
