import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { Play, RotateCcw, Save, Share2 } from "lucide-react";
import { Button } from "../ui/Button";

interface CodeEditorProps {
    initialCode?: string;
    language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    initialCode = "// Start coding here...",
    language = "javascript"
}) => {
    const [output, setOutput] = useState<string[]>([]);
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    const handleRun = () => {
        setOutput(["Running code...", "> Hello World!", "> Execution complete (12ms)"]);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-[#252526] border-b border-[#333]">
                <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 font-normal" onClick={handleRun}>
                        <Play className="h-3 w-3 mr-2" /> Run
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-300 hover:bg-[#333] h-8">
                        <RotateCcw className="h-3 w-3 mr-2" /> Reset
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-slate-300 hover:bg-[#333] h-8">
                        <Share2 className="h-3 w-3 mr-2" /> Share
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-300 hover:bg-[#333] h-8">
                        <Save className="h-3 w-3 mr-2" /> Save
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    defaultValue={initialCode}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
                    }}
                />
            </div>

            {/* Output Panel */}
            <div className="h-32 bg-[#1e1e1e] border-t border-[#333] flex flex-col">
                <div className="px-4 py-1 text-xs text-slate-500 uppercase font-bold bg-[#252526] border-b border-[#333]">
                    Console Output
                </div>
                <div className="flex-1 p-3 font-mono text-sm overflow-y-auto">
                    {output.length > 0 ? (
                        output.map((line, i) => (
                            <div key={i} className={line.startsWith(">") ? "text-green-400" : "text-slate-400"}>
                                {line}
                            </div>
                        ))
                    ) : (
                        <span className="text-slate-600 italic">No output to display</span>
                    )}
                </div>
            </div>
        </div>
    );
};
