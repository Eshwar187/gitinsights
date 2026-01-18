import { Progress } from "../ui/Progress";
import { Badge } from "../ui/Badge";

export const SkillsSummaryHeader: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Full Stack Developer
                        </h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Level 15</span>
                            <span>•</span>
                            <span>4,580 XP</span>
                            <span>•</span>
                            <span className="text-green-500">Top 5%</span>
                        </div>
                    </div>

                    <div className="flex-1 max-w-xl w-full">
                        <div className="flex justify-between text-xs mb-2 font-medium">
                            <span>Overall Progress</span>
                            <span>45 / 80 Skills</span>
                        </div>
                        <Progress value={56} className="h-3" />
                        <div className="flex gap-4 mt-3">
                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400">
                                12 Mastered
                            </Badge>
                            <Badge variant="outline" className="border-blue-500/50 text-blue-600 dark:text-blue-400">
                                8 Learning
                            </Badge>
                            <Badge variant="outline" className="border-slate-500/50 text-slate-500">
                                25 Locked
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
