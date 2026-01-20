import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { getLanguageStats } from "../services/analyticsService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Code2, Zap, Trophy, TrendingUp } from "lucide-react";

export default function SkillTree() {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    const { data: langData, isLoading } = useQuery({
        queryKey: ['skillLanguages'],
        queryFn: getLanguageStats
    });

    const languages = langData?.data || [];
    const totalUsage = languages.reduce((sum: number, l: any) => sum + (l.usage_count || 0), 0);

    // Calculate proficiency level based on usage
    const getLevel = (usage: number) => {
        if (usage > 50) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-100" };
        if (usage > 20) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100" };
        if (usage > 10) return { level: "Intermediate", color: "text-green-600", bg: "bg-green-100" };
        return { level: "Beginner", color: "text-slate-600", bg: "bg-slate-100" };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Skills & Technologies</h1>
                <p className="text-slate-500">Your proficiency based on repository usage</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : languages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    No skills data yet. Sync your GitHub repositories to see your skills.
                </div>
            ) : (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Code2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Languages</p>
                                        <p className="text-xl font-bold">{languages.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Zap className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Total Usage</p>
                                        <p className="text-xl font-bold">{totalUsage} repos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <Trophy className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Top Skill</p>
                                        <p className="text-xl font-bold">{languages[0]?.language || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Expert Level</p>
                                        <p className="text-xl font-bold">{languages.filter((l: any) => l.usage_count > 50).length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Skills Grid */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technology Proficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {languages.map((lang: any) => {
                                    const { level, color, bg } = getLevel(lang.usage_count);
                                    const percentage = totalUsage > 0 ? Math.round((lang.usage_count / totalUsage) * 100) : 0;

                                    return (
                                        <div
                                            key={lang.language}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedSkill === lang.language ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => setSelectedSkill(lang.language)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold">{lang.language}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${bg} ${color}`}>
                                                    {level}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Used in {lang.usage_count} repositories ({percentage}%)
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

