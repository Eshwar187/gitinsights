import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { Button } from "../ui/Button";
import { CheckCircle2, Lock, BookOpen, ExternalLink, Trophy } from "lucide-react";
// @ts-ignore
import confetti from 'canvas-confetti';

interface SkillData {
    id: string;
    label: string;
    status: string;
    level: number;
    xp: number;
    maxXp: number;
    category: string;
}

interface SkillDetailsPanelProps {
    skill: SkillData | null;
}

export const SkillDetailsPanel: React.FC<SkillDetailsPanelProps> = ({ skill }) => {
    if (!skill) {
        return (
            <Card className="h-full flex items-center justify-center p-8 text-center text-slate-500">
                <div>
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-slate-400" />
                    </div>
                    <p>Select a skill from the tree to view details</p>
                </div>
            </Card>
        );
    }

    const handleUnlock = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <Card className="h-full overflow-hidden flex flex-col">
            <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-600 p-6 flex items-end">
                <h2 className="text-2xl font-bold text-white mb-1">{skill.label}</h2>
                <Badge className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-none">
                    {skill.category}
                </Badge>
            </div>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status & Level */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {skill.status === "mastered" && <CheckCircle2 className="text-yellow-500 h-5 w-5" />}
                        {skill.status === "locked" && <Lock className="text-slate-500 h-5 w-5" />}
                        {skill.status === "learning" && <BookOpen className="text-blue-500 h-5 w-5" />}
                        <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                            {skill.status}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold">Lvl {skill.level}</span>
                        <span className="text-xs text-slate-500 block">MAX 15</span>
                    </div>
                </div>

                {/* XP Progress */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Experience</span>
                        <span className="text-slate-500">{skill.xp} / {skill.maxXp} XP</span>
                    </div>
                    <Progress value={skill.xp} max={skill.maxXp} className="h-3" />
                    <p className="text-xs text-slate-500 mt-2 text-right">
                        {skill.maxXp - skill.xp} XP to next level
                    </p>
                </div>

                {/* Resources or Prerequisites */}
                {skill.status === "locked" ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Prerequisites
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Master JavaScript (Level 10+)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                <span>Complete 5 Frontend Projects</span>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Learning Resources
                        </h3>
                        <div className="grid gap-3">
                            <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm group-hover:text-blue-500">Official Documentation</span>
                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Comprehensive guide and references</p>
                            </a>
                            <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm group-hover:text-blue-500">top-course-repo</span>
                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Community curated learning path</p>
                            </a>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                    {skill.status === "locked" ? (
                        <Button className="w-full" disabled>Locked</Button>
                    ) : (
                        <Button className="w-full" onClick={handleUnlock}>
                            {skill.status === "mastered" ? "Practice Skill" : "Continue Learning"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
