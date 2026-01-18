import { MentorChatInterface } from "../components/mentor/MentorChatInterface";
import { CodeEditor } from "../components/mentor/CodeEditor";

export default function Mentor() {
    return (
        <div className="h-[calc(100vh-6rem)] -m-6 p-6 flex flex-col lg:flex-row gap-6">
            {/* Left Panel: Chat Interface */}
            <div className="w-full lg:w-[450px] shrink-0 h-[50vh] lg:h-full">
                <MentorChatInterface />
            </div>

            {/* Right Panel: Code Editor */}
            <div className="flex-1 h-[50vh] lg:h-full min-w-0">
                <CodeEditor />
            </div>
        </div>
    );
}
