import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Users, Video, Mic, Share2 } from "lucide-react";

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    status: "online" | "away" | "busy";
    isSpeaking?: boolean;
}

export const ParticipantsPanel: React.FC = () => {
    const [participants] = useState<Participant[]>([
        { id: "1", name: "You", status: "online" },
        { id: "2", name: "Sarah Chen", status: "online", isSpeaking: true },
        { id: "3", name: "Mike Ross", status: "away" },
        { id: "4", name: "Alex V.", status: "busy" },
    ]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" /> Participants ({participants.length})
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <div className="relative">
                            <Avatar
                                className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs"
                                fallback={p.name.substring(0, 2).toUpperCase()}
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${p.status === "online" ? "bg-green-500" : p.status === "away" ? "bg-yellow-500" : "bg-red-500"
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{p.status}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {p.isSpeaking && <Mic className="h-3 w-3 text-green-500 animate-pulse" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div className="flex justify-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <Mic className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <Video className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
