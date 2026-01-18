import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

interface SetGoalsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SetGoalsModal: React.FC<SetGoalsModalProps> = ({ isOpen, onClose }) => {
    const [goals, setGoals] = useState({
        dailyHours: 6,
        weeklyHours: 40,
        preferredTimes: [] as string[],
        focusLanguages: [] as string[],
        reminders: true
    });

    const timeSlots = ["Morning (6-12)", "Afternoon (12-18)", "Evening (18-24)", "Night (0-6)"];
    const languages = ["JavaScript", "Python", "TypeScript", "Java", "Go", "Rust"];

    const toggleTime = (time: string) => {
        setGoals(prev => ({
            ...prev,
            preferredTimes: prev.preferredTimes.includes(time)
                ? prev.preferredTimes.filter(t => t !== time)
                : [...prev.preferredTimes, time]
        }));
    };

    const toggleLanguage = (lang: string) => {
        setGoals(prev => ({
            ...prev,
            focusLanguages: prev.focusLanguages.includes(lang)
                ? prev.focusLanguages.filter(l => l !== lang)
                : [...prev.focusLanguages, lang]
        }));
    };

    const handleSave = () => {
        // In real app, save to backend
        console.log("Saving goals:", goals);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set Coding Goals" size="lg">
            <div className="space-y-6">
                {/* Daily Hours */}
                <div>
                    <Label htmlFor="dailyHours">Target Hours Per Day</Label>
                    <Input
                        id="dailyHours"
                        type="number"
                        min="1"
                        max="24"
                        value={goals.dailyHours}
                        onChange={(e) => setGoals({ ...goals, dailyHours: parseInt(e.target.value) })}
                        className="mt-2"
                    />
                </div>

                {/* Weekly Hours */}
                <div>
                    <Label htmlFor="weeklyHours">Target Hours Per Week</Label>
                    <Input
                        id="weeklyHours"
                        type="number"
                        min="1"
                        max="168"
                        value={goals.weeklyHours}
                        onChange={(e) => setGoals({ ...goals, weeklyHours: parseInt(e.target.value) })}
                        className="mt-2"
                    />
                </div>

                {/* Preferred Times */}
                <div>
                    <Label>Preferred Coding Times</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => toggleTime(time)}
                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${goals.preferredTimes.includes(time)
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Focus Languages */}
                <div>
                    <Label>Languages to Focus On</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => toggleLanguage(lang)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${goals.focusLanguages.includes(lang)
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reminders */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="reminders"
                        checked={goals.reminders}
                        onChange={(e) => setGoals({ ...goals, reminders: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300"
                    />
                    <Label htmlFor="reminders" className="cursor-pointer">
                        Send me daily coding reminders
                    </Label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                        Save Goals
                    </Button>
                    <Button onClick={onClose} variant="outline" className="flex-1">
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
