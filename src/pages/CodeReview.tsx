import { useState, useEffect } from "react";
import { CommitSelector } from "../components/code-review/CommitSelector";
import { CodeDiffViewer } from "../components/code-review/CodeDiffViewer";
import { AIAnalysisPanel } from "../components/code-review/AIAnalysisPanel";
import { Button } from "../components/ui/Button";
import { generateCommitData, generateCodeDiff } from "../utils/mockData";
import { Wand2, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function CodeReview() {
    const [commits] = useState(generateCommitData());
    const [selectedCommit, setSelectedCommit] = useState(commits[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // Simulate API delay
        setTimeout(() => {
            setAnalysisResult({
                score: 7.5,
                issues: [
                    { severity: "critical", line: 45, file: "auth/login.js", message: "Hardcoded API key detected", suggestion: "Use process.env.API_KEY instead" },
                    { severity: "warning", line: 78, file: "auth/validate.js", message: "Complex regex pattern without comments", suggestion: "Add explanation comment" }
                ],
                strengths: ["Strong error handling", "Clean function decomposition", "Good JSDoc coverage"]
            });
            setIsAnalyzing(false);
            toast.success("Analysis complete!");
        }, 2500);
    };

    useEffect(() => {
        // Auto analyze first commit on load
        if (!analysisResult) handleAnalyze();
    }, []);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">AI Code Review</h1>
                    <p className="text-slate-500">Automated quality analysis and security checks</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:w-80">
                        <CommitSelector
                            commits={commits}
                            selectedCommit={selectedCommit}
                            onSelect={setSelectedCommit}
                        />
                    </div>
                    <Button variant="outline" size="icon" title="Export Report">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
                {/* Diff Viewer (Left 2/3) */}
                <div className="lg:col-span-2 h-full flex flex-col">
                    <CodeDiffViewer
                        codeDiff={generateCodeDiff()}
                        issues={analysisResult?.issues}
                    />
                    {!analysisResult && !isAnalyzing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg z-10 backdrop-blur-[1px]">
                            <Button size="lg" onClick={handleAnalyze}>
                                <Wand2 className="mr-2 h-5 w-5" />
                                Run Analysis
                            </Button>
                        </div>
                    )}
                </div>

                {/* Analysis Panel (Right 1/3) */}
                <div className="lg:col-span-1 h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 overflow-hidden">
                    {analysisResult || isAnalyzing ? (
                        <AIAnalysisPanel
                            score={analysisResult?.score || 0}
                            issues={analysisResult?.issues || []}
                            strengths={analysisResult?.strengths || []}
                            isLoading={isAnalyzing}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8">
                            <Wand2 className="h-12 w-12 mb-4 opacity-50" />
                            <p>Select a commit and click analyze to see AI insights</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
