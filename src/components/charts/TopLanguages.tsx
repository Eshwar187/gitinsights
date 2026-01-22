import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { getLanguageStats } from "../../services/analyticsService";
import LoadingSpinner from "../LoadingSpinner";

const LANGUAGE_COLORS: Record<string, string> = {
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "Python": "#3572A5",
    "Java": "#b07219",
    "Rust": "#dea584",
    "Go": "#00ADD8",
    "C++": "#f34b7d",
    "Ruby": "#701516",
    "C": "#555555",
    "CSS": "#563d7c",
    "HTML": "#e34c26",
    "Shell": "#89e051",
};

export function TopLanguages() {
    const { data: langData, isLoading } = useQuery({
        queryKey: ['languageStats'],
        queryFn: getLanguageStats
    });

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[250px]">
                        <LoadingSpinner size="sm" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = langData?.success && langData.data
        ? langData.data.map((lang: any) => ({
            name: lang.language,
            value: lang.percentage,
            color: LANGUAGE_COLORS[lang.language] || "#888888"
        }))
        : [];

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="text-center text-slate-500 py-8 text-sm">
                        No language data available
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {/* Chart Container */}
                        <div className="h-[160px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="50%"
                                        outerRadius="85%"
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value) => [`${(value as number).toFixed(1)}%`, '']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-4 px-2">
                            {chartData.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <div
                                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {entry.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
