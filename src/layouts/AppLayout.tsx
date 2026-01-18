import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
