import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            {/* Navbar could go here if shared across public pages */}
            <main>
                <Outlet />
            </main>
            {/* Footer could go here */}
        </div>
    );
};

export default PublicLayout;
