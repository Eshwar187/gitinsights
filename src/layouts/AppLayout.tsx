import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { PageTransition } from "../components/PageTransition";

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-grid-black dark:bg-grid-white [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
                <div className="container mx-auto p-8 relative z-10">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
