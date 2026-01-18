import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const data = [
    { name: "TypeScript", value: 45, color: "#3178c6" },
    { name: "Python", value: 25, color: "#3572A5" },
    { name: "JavaScript", value: 20, color: "#f1e05a" },
    { name: "Rust", value: 10, color: "#dea584" },
];

export function TopLanguages() {
    return (
        <Card className="col-span-3 lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
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
            </CardContent>
        </Card>
    );
}
