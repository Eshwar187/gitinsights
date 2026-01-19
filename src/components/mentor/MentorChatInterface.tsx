import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { Send, Mic, Paperclip, Bot, User, Code as CodeIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { generateChatMessages } from "../../utils/mockData";

// Register only the languages we need
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);

interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    code?: string;
    language?: string;
    timestamp: string;
}

export const MentorChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>(generateChatMessages() as Message[]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: inputValue,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: "I can help you with that! Here's a quick example of how you might approach this problem using a cleaner pattern:",
                code: "const simplified = data.map(item => ({\n  id: item.id,\n  value: item.raw_value * 2\n}));",
                language: "javascript",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">AI Coding Mentor</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">New Session</Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'ai' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            }`}>
                            {msg.type === 'ai' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </div>

                        {/* Bubble */}
                        <div className={`flex flex-col max-w-[85%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl text-sm ${msg.type === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                }`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>

                            {/* Code Snippet Attachment */}
                            {msg.code && (
                                <div className="mt-2 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1 flex items-center justify-between">
                                        <span className="flex items-center gap-1"><CodeIcon className="h-3 w-3" /> {msg.language}</span>
                                        <button className="hover:text-white transition-colors">Copy</button>
                                    </div>
                                    <SyntaxHighlighter
                                        language={msg.language || 'javascript'}
                                        style={atomOneDark}
                                        customStyle={{ margin: 0, padding: '1rem', fontSize: '13px' }}
                                    >
                                        {msg.code}
                                    </SyntaxHighlighter>
                                </div>
                            )}

                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="p-3 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-end gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-slate-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <textarea
                        className="flex-1 bg-transparent border-none resize-none focus:ring-0 max-h-32 py-2.5 text-sm"
                        placeholder="Ask anything about coding..."
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <Mic className="h-5 w-5" />
                        </Button>
                        <Button
                            size="icon"
                            className={inputValue.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"}
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
