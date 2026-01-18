import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tooltip } from "../ui/Tooltip";
import { cn } from "../../utils/cn";

interface HeatmapData {
    day: string;
    hour: number;
    minutes: number;
    language: string;
}

interface HourlyHeatmapProps {
    data: HeatmapData[];
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data }) => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

    const getIntensityColor = (minutes: number) => {
        if (minutes === 0) return "bg-slate-100 dark:bg-slate-800";
        if (minutes <= 30) return "bg-blue-200 dark:bg-blue-900";
        if (minutes <= 60) return "bg-blue-400 dark:bg-blue-700";
        if (minutes <= 120) return "bg-blue-600 dark:bg-blue-500";
        return "bg-blue-800 dark:bg-blue-300";
    };

    const getCellData = (day: string, hour: number) => {
        return data.find(d => d.day === day && d.hour === hour) || { minutes: 0, language: "" };
    };

    const currentHour = new Date().getHours();
    const currentDay = dayNames[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Coding Activity Heatmap</CardTitle>
                <p className="text-sm text-slate-500">Last 7 days - Hover for details</p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Hour labels */}
                        <div className="flex mb-2">
                            <div className="w-24" /> {/* Space for day labels */}
                            {hours.map(hour => (
                                <div key={hour} className="w-8 text-center text-xs text-slate-500">
                                    {hour.toString().padStart(2, '0')}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap grid */}
                        {dayNames.map(day => (
                            <div key={day} className="flex items-center mb-1">
                                <div className="w-24 text-sm text-slate-600 dark:text-slate-400 pr-2">
                                    {day}
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: 24 }).map((_, hour) => {
                                        const cellData = getCellData(day, hour);
                                        const isCurrentCell = day === currentDay && hour === currentHour;

                                        return (
                                            <Tooltip
                                                key={hour}
                                                content={
                                                    cellData.minutes > 0
                                                        ? `${day}, ${hour}:00 - ${Math.floor(cellData.minutes / 60)}h ${cellData.minutes % 60}m in ${cellData.language}`
                                                        : `${day}, ${hour}:00 - No activity`
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        "w-7 h-7 rounded-sm transition-all hover:scale-110 cursor-pointer",
                                                        getIntensityColor(cellData.minutes),
                                                        isCurrentCell && "ring-2 ring-blue-500 ring-offset-1"
                                                    )}
                                                />
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800" />
                        <div className="w-4 h-4 rounded-sm bg-blue-200 dark:bg-blue-900" />
                        <div className="w-4 h-4 rounded-sm bg-blue-400 dark:bg-blue-700" />
                        <div className="w-4 h-4 rounded-sm bg-blue-600 dark:bg-blue-500" />
                        <div className="w-4 h-4 rounded-sm bg-blue-800 dark:bg-blue-300" />
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    );
};
