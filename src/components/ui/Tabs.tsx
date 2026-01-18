import * as React from "react";
import { cn } from "../../utils/cn";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultTab,
    onChange,
    className
}) => {
    const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={cn("w-full", className)}>
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors relative",
                            activeTab === tab.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon}
                            {tab.label}
                        </div>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTabContent}
            </div>
        </div>
    );
};
