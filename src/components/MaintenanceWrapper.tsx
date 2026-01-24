import { useState, useEffect, type ReactNode } from "react";
import MaintenancePage from "../pages/MaintenancePage";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface MaintenanceWrapperProps {
    children: ReactNode;
}

export default function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                const response = await fetch(`${API_URL}/api/admin/maintenance`);
                const data = await response.json();

                if (data.success) {
                    setIsMaintenanceMode(data.maintenanceMode);
                }
            } catch (error) {
                // If we can't reach the server, assume not in maintenance
                console.error('Failed to check maintenance status:', error);
                setIsMaintenanceMode(false);
            } finally {
                setLoading(false);
            }
        };

        checkMaintenance();

        // Check every 30 seconds for maintenance mode changes
        const interval = setInterval(checkMaintenance, 30000);

        return () => clearInterval(interval);
    }, []);

    // Check if user is on admin routes - always allow admin access
    const isAdminRoute = window.location.pathname.startsWith('/admin');

    if (isAdminRoute) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c1222] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    if (isMaintenanceMode) {
        return <MaintenancePage />;
    }

    return <>{children}</>;
}
