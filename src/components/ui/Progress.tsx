import * as React from "react";
import { cn } from "../../utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, showLabel = false, ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        return (
            <div
                ref={ref}
                className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800", className)}
                {...props}
            >
                <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
                {showLabel && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                        {Math.round(percentage)}%
                    </span>
                )}
            </div>
        );
    }
);
Progress.displayName = "Progress";

interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showValue?: boolean;
    color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    className,
    showValue = true,
    color = "#3B82F6"
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-slate-200 dark:text-slate-800"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(percentage)}</span>
                    <span className="text-xs text-slate-500">/ {max}</span>
                </div>
            )}
        </div>
    );
};

export { Progress, CircularProgress };
