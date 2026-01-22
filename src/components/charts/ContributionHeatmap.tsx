import { cn } from "../../utils/cn";
import { eachDayOfInterval, subDays, format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getHeatmap } from "../../services/activityService";
import LoadingSpinner from "../LoadingSpinner";

export function ContributionHeatmap() {
    const today = new Date();
    const startDate = subDays(today, 364);

    const { data: heatmapData, isLoading } = useQuery({
        queryKey: ['activityHeatmap'],
        queryFn: () => getHeatmap(format(startDate, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd'))
    });

    const days = eachDayOfInterval({ start: startDate, end: today });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <LoadingSpinner size="sm" />
            </div>
        );
    }

    // Create a map of dates to contribution counts
    const contributionMap = new Map();
    let totalContributions = 0;

    if (heatmapData?.success && Array.isArray(heatmapData.data)) {
        heatmapData.data.forEach((item: any) => {
            const dateStr = format(parseISO(item.date), 'yyyy-MM-dd');
            contributionMap.set(dateStr, item.count);
            totalContributions += item.count;
        });
    }

    // Map days to contribution data
    const data = days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const count = contributionMap.get(dateStr) || 0;
        return {
            date: day,
            count,
            level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4,
        };
    });

    const getColor = (level: number) => {
        switch (level) {
            case 0: return "bg-slate-100 dark:bg-slate-800";
            case 1: return "bg-green-200 dark:bg-green-900";
            case 2: return "bg-green-400 dark:bg-green-700";
            case 3: return "bg-green-600 dark:bg-green-500";
            case 4: return "bg-green-800 dark:bg-green-300";
            default: return "bg-slate-100 dark:bg-slate-800";
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-semibold">
                    {totalContributions.toLocaleString()} contributions in the last year
                </h3>
                <div className="text-xs text-slate-500">
                    Less <span className="inline-block w-3 h-3 bg-slate-100 dark:bg-slate-800 sm:ml-1 rounded-sm" />
                    <span className="inline-block w-3 h-3 bg-green-200 dark:bg-green-900 ml-1 rounded-sm" />
                    <span className="inline-block w-3 h-3 bg-green-400 dark:bg-green-700 ml-1 rounded-sm" />
                    <span className="inline-block w-3 h-3 bg-green-600 dark:bg-green-500 ml-1 rounded-sm" />
                    <span className="inline-block w-3 h-3 bg-green-800 dark:bg-green-300 ml-1 rounded-sm" /> More
                </div>
            </div>
            <div className="flex flex-col gap-1 overflow-x-auto pb-2">
                {/* Simplified Grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                    {data.map((item, i) => (
                        <div
                            key={i}
                            className={cn("w-3 h-3 rounded-sm", getColor(item.level))}
                            title={`${item.count} contributions on ${format(item.date, "MMM d, yyyy")}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
