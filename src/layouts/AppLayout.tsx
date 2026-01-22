import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, MobileHeader, SidebarOverlay } from "../components/Sidebar";
import { PageTransition } from "../components/PageTransition";

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            {/* Mobile Header */}
            <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

            {/* Sidebar overlay for mobile */}
            <SidebarOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-grid-black dark:bg-grid-white [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
                {/* Responsive padding: Push content down on mobile for fixed header */}
                <div className="container mx-auto px-4 py-6 sm:p-6 lg:p-8 relative z-10 pt-20 lg:pt-8">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
