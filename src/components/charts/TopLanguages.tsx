import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
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
};

export function TopLanguages() {
    const { data: langData, isLoading } = useQuery({
        queryKey: ['languageStats'],
        queryFn: getLanguageStats
    });

    if (isLoading) {
        return (
            <Card className="col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[200px]">
                        <LoadingSpinner size="sm" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Debug: Log what we're receiving from API
    console.log('TopLanguages API Response:', langData);

    const chartData = langData?.success && langData.data
        ? langData.data.map((lang: any) => ({
            name: lang.language,
            value: lang.percentage,
            color: LANGUAGE_COLORS[lang.language] || "#888888"
        }))
        : [];

    console.log('TopLanguages Chart Data:', chartData);

    return (
        <Card className="col-span-3 lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="text-center text-slate-500 py-8 text-sm">
                        No language data available
                    </div>
                ) : (
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend formatter={(value) => <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
