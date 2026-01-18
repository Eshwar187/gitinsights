import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface LanguageData {
    day: string;
    JavaScript: number;
    Python: number;
    TypeScript: number;
    Other: number;
}

interface LanguageBreakdownProps {
    data: LanguageData[];
}

export const LanguageBreakdown: React.FC<LanguageBreakdownProps> = ({ data }) => {
    const languages = [
        { name: "JavaScript", color: "#F7DF1E" },
        { name: "Python", color: "#3776AB" },
        { name: "TypeScript", color: "#3178C6" },
        { name: "Other", color: "#6C757D" }
    ];

    const getTotal = (day: LanguageData) => {
        return day.JavaScript + day.Python + day.TypeScript + day.Other;
    };

    const getPercentage = (value: number, total: number) => {
        return total > 0 ? (value / total) * 100 : 0;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Language Breakdown</CardTitle>
                <p className="text-sm text-slate-500">Time spent by language</p>
            </CardHeader>
            <CardContent className="space-y-3">
                {data.map((day, index) => {
                    const total = getTotal(day);
                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{day.day}</span>
                                <span className="text-xs text-slate-500">{total} min</span>
                            </div>
                            <div className="flex h-6 rounded-full overflow-hidden">
                                {languages.map(lang => {
                                    const value = day[lang.name as keyof Omit<LanguageData, 'day'>];
                                    const percentage = getPercentage(value, total);

                                    if (percentage === 0) return null;

                                    return (
                                        <div
                                            key={lang.name}
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: lang.color
                                            }}
                                            className="flex items-center justify-center text-xs font-medium text-white"
                                            title={`${lang.name}: ${Math.round(percentage)}%`}
                                        >
                                            {percentage > 10 && `${Math.round(percentage)}%`}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {languages.map(lang => (
                        <div key={lang.name} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400">{lang.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
