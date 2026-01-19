export default function SkeletonLoader({ count = 1, height = 'h-4', className = '' }: { count?: number; height?: string; className?: string }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`${height} bg-slate-200 dark:bg-slate-700 rounded animate-pulse`}
                />
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded flex-1 animate-pulse" />
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
                </div>
            ))}
        </div>
    );
}
