import { CodeEditor } from "../components/mentor/CodeEditor";
import { ParticipantsPanel } from "../components/collaboration/ParticipantsPanel";
import { Button } from "../components/ui/Button";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

export default function Collaborate() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-[calc(100vh-6rem)] -m-6 flex overflow-hidden">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-12 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="font-medium text-slate-200">Session: Project Alpha</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Live</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                    </Button>
                </div>
                <div className="flex-1 relative">
                    <CodeEditor
                        initialCode="// Collaborative Session\n// Everyone can edit this file in real-time\n\nfunction calculateTotal(items) {\n  return items.reduce((acc, curr) => acc + curr.price, 0);\n}"
                    />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className={cn(
                "w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out shrink-0",
                !isSidebarOpen && "w-0 border-l-0 overflow-hidden"
            )}>
                <ParticipantsPanel />
            </div>
        </div>
    );
}
