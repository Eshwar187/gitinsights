import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeeklyTrendChartProps {
    data: { date: string; minutes: number }[];
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Trend</CardTitle>
                <p className="text-sm text-slate-500">Last 28 days</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgb(15 23 42)',
                                border: '1px solid rgb(51 65 85)',
                                borderRadius: '0.5rem'
                            }}
                            labelStyle={{ color: 'rgb(148 163 184)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="minutes"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
