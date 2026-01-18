import * as React from "react";
import { cn } from "../../utils/cn";

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    status?: "online" | "offline" | "away" | "busy";
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = "Avatar",
    fallback,
    size = "md",
    className,
    status
}) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg"
    };

    const statusColors = {
        online: "bg-green-500",
        offline: "bg-slate-400",
        away: "bg-yellow-500",
        busy: "bg-red-500"
    };

    const getInitials = () => {
        if (fallback) {
            return fallback.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
        return alt.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className={cn("relative inline-block", className)}>
            <div
                className={cn(
                    "rounded-full overflow-hidden flex items-center justify-center font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
                    sizeClasses[size]
                )}
            >
                {src && !imageError ? (
                    <img
                        src={src}
                        alt={alt}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span>{getInitials()}</span>
                )}
            </div>

            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900",
                        statusColors[status]
                    )}
                />
            )}
        </div>
    );
};
