import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FileCode } from 'lucide-react';

SyntaxHighlighter.registerLanguage('javascript', js);

interface CodeDiffViewerProps {
    codeDiff: string;
    issues?: { line: number; message: string; severity: string }[];
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ codeDiff, issues = [] }) => {
    // Simple parser to separate diff into lines for rendering
    const lines = codeDiff.split('\n');

    return (
        <div className="bg-[#282c34] rounded-lg overflow-hidden border border-slate-700 font-mono text-sm h-full flex flex-col">
            <div className="bg-slate-800 p-2 border-b border-slate-700 flex items-center justify-between text-slate-400 px-4">
                <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>auth/login.js</span>
                </div>
                <span className="text-xs">Diff View</span>
            </div>

            <div className="overflow-auto flex-1 p-4">
                <SyntaxHighlighter
                    language="javascript"
                    style={atomOneDark}
                    customStyle={{ background: 'transparent', padding: 0 }}
                    showLineNumbers
                    wrapLines
                    lineProps={(lineNumber) => {
                        const issue = issues.find(i => i.line === lineNumber);
                        const lineContent = lines[lineNumber - 1] || "";
                        const isAddition = lineContent.startsWith('+');
                        const isDeletion = lineContent.startsWith('-');

                        const style: React.CSSProperties = { display: 'block' };
                        if (isAddition) style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                        if (isDeletion) style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
                        if (issue) style.borderRight = '3px solid #f59e0b';

                        return { style };
                    }}
                >
                    {codeDiff}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
