import { useState } from "react";
import { cn } from "../../utils/cn";
import { GitCommit, Search, ChevronDown } from "lucide-react";

interface Commit {
    sha: string;
    message: string;
    date: string;
    repository: string;
    filesChanged: number;
    additions: number;
    deletions: number;
}

interface CommitSelectorProps {
    commits: Commit[];
    selectedCommit: Commit | null;
    onSelect: (commit: Commit) => void;
}

export const CommitSelector: React.FC<CommitSelectorProps> = ({
    commits,
    selectedCommit,
    onSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredCommits = commits.filter(c =>
        c.message.toLowerCase().includes(search.toLowerCase()) ||
        c.sha.includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 transition-colors"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                        <GitCommit className="h-5 w-5" />
                    </div>
                    <div className="text-left truncate">
                        {selectedCommit ? (
                            <>
                                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {selectedCommit.message}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span className="font-mono">{selectedCommit.sha.substring(0, 7)}</span>
                                    <span>•</span>
                                    <span>{new Date(selectedCommit.date).toLocaleDateString()}</span>
                                </div>
                            </>
                        ) : (
                            <span className="text-slate-500">Select a commit to review</span>
                        )}
                    </div>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 max-h-96 flex flex-col">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search commits..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm border-none focus:ring-2 focus:ring-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredCommits.map(commit => (
                            <button
                                key={commit.sha}
                                onClick={() => {
                                    onSelect(commit);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3",
                                    selectedCommit?.sha === commit.sha && "bg-blue-50 dark:bg-blue-900/20"
                                )}
                            >
                                <div className="mt-1">
                                    <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                                        {commit.message}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        <span className="font-mono">{commit.sha.substring(0, 7)}</span> • {commit.repository} • {commit.filesChanged} files
                                    </p>
                                </div>
                            </button>
                        ))}
                        {filteredCommits.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-500">
                                No commits found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
