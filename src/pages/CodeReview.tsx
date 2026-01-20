import { useState, useEffect } from "react";
import { CodeDiffViewer } from "../components/code-review/CodeDiffViewer";
import { AIAnalysisPanel } from "../components/code-review/AIAnalysisPanel";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { generateCodeDiff } from "../utils/mockData";
import { Wand2, Download, GitBranch } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getRepositories } from "../services/githubService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CodeReview() {
    const { data: reposData, isLoading } = useQuery({
        queryKey: ['codeReviewRepos'],
        queryFn: () => getRepositories(1, 20)
    });

    const repos = reposData?.data || [];
    const [selectedRepo, setSelectedRepo] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
        if (repos.length > 0 && !selectedRepo) {
            setSelectedRepo(repos[0]);
        }
    }, [repos]);

    const handleAnalyze = () => {
        if (!selectedRepo) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // Simulate AI analysis (in real app, this would call backend API)
        setTimeout(() => {
            setAnalysisResult({
                score: Math.floor(Math.random() * 3) + 7, // 7-9 score
                issues: [
                    { severity: "warning", line: 45, file: `${selectedRepo.name}/src/index.ts`, message: "Consider adding error handling", suggestion: "Wrap in try-catch block" },
                    { severity: "info", line: 78, file: `${selectedRepo.name}/src/utils.ts`, message: "Function could be simplified", suggestion: "Use optional chaining" }
                ],
                strengths: [
                    `Good ${selectedRepo.language || 'code'} practices`,
                    "Clean function decomposition",
                    selectedRepo.has_readme ? "Well documented with README" : "Code is organized"
                ]
            });
            setIsAnalyzing(false);
            toast.success("Analysis complete!");
        }, 2500);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">AI Code Review</h1>
                    <p className="text-slate-500">Automated quality analysis for your repositories</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="icon" title="Export Report">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            ) : repos.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    No repositories found. Sync your GitHub data first.
                </div>
            ) : (
                <>
                    {/* Repository Selector */}
                    <Card className="shrink-0">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm font-medium">Select Repository to Analyze</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex flex-wrap gap-2">
                                {repos.slice(0, 10).map((repo: any) => (
                                    <Button
                                        key={repo.id}
                                        variant={selectedRepo?.id === repo.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedRepo(repo)}
                                    >
                                        <GitBranch className="h-3 w-3 mr-1" />
                                        {repo.name}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Workspace */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
                        {/* Diff Viewer (Left 2/3) */}
                        <div className="lg:col-span-2 h-full flex flex-col relative">
                            <CodeDiffViewer
                                codeDiff={generateCodeDiff()}
                                issues={analysisResult?.issues}
                            />
                            {!analysisResult && !isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg z-10 backdrop-blur-[1px]">
                                    <Button size="lg" onClick={handleAnalyze} disabled={!selectedRepo}>
                                        <Wand2 className="mr-2 h-5 w-5" />
                                        Analyze {selectedRepo?.name || 'Repository'}
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
                                    <p className="text-lg font-medium mb-2">Ready to Analyze</p>
                                    <p className="text-sm">Select a repository and click analyze to get AI insights</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

