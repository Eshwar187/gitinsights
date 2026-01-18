import { cn } from "../../utils/cn";
import { eachDayOfInterval, subDays, format } from "date-fns";

export function ContributionHeatmap() {
    const today = new Date();
    const startDate = subDays(today, 364);
    const days = eachDayOfInterval({ start: startDate, end: today });

    // Mock data generation
    const data = days.map((day) => {
        // Bias towards more activity
        const activity = Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : 0;
        return {
            date: day,
            count: activity,
            level: activity === 0 ? 0 : activity < 3 ? 1 : activity < 6 ? 2 : activity < 9 ? 3 : 4,
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
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">3,245 contributions in the last year</h3>
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
