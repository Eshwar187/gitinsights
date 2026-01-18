import { CircularProgress } from "../ui/Progress";
import { Badge } from "../ui/Badge";
import { CheckCircle2, AlertTriangle, Lightbulb, Shield, Zap } from "lucide-react";
import { Card } from "../ui/Card";

interface Issue {
    severity: "critical" | "warning" | "info";
    line: number;
    file: string;
    message: string;
    suggestion: string;
}

interface AIAnalysisPanelProps {
    score: number;
    issues: Issue[];
    strengths: string[];
    isLoading?: boolean;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
    score,
    issues,
    strengths,
    isLoading = false
}) => {
    const getScoreColor = (s: number) => {
        if (s >= 8) return "#22c55e";
        if (s >= 6) return "#f59e0b";
        return "#ef4444";
    };

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse p-8">
                <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto space-y-6 pr-2">
            {/* Overall Score */}
            <Card className="p-6 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Code Quality Score</h3>
                <CircularProgress value={score} max={10} color={getScoreColor(score)} />

                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                        <Shield className="h-5 w-5 text-red-500 mx-auto mb-1" />
                        <div className="text-xs text-slate-500">Security</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">
                            {issues.filter(i => i.severity === 'critical').length} Issues
                        </div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                        <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                        <div className="text-xs text-slate-500">Performance</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">
                            {issues.filter(i => i.severity === 'warning').length} Issues
                        </div>
                    </div>
                </div>
            </Card>

            {/* Issues List */}
            <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Detected Issues
                </h4>
                {issues.map((issue, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-900 border rounded-lg border-l-4 group hover:shadow-md transition-all"
                        style={{ borderLeftColor: issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                        <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                                {issue.severity}
                            </Badge>
                            <span className="text-xs font-mono text-slate-400">Lines {issue.line}</span>
                        </div>
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-2">{issue.message}</p>
                        <div className="text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded flex gap-2">
                            <Lightbulb className="h-3 w-3 text-yellow-500 shrink-0 mt-0.5" />
                            <span className="text-slate-600 dark:text-slate-400">{issue.suggestion}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strengths */}
            <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Strengths
                </h4>
                <div className="grid grid-cols-1 gap-2">
                    {strengths.map((str, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {str}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
