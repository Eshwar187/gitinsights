import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5 font-bold text-xl text-slate-900 dark:text-white">
                            GitInsights
                        </a>
                    </div>
                    <div className="flex flex-1 justify-end gap-x-4">
                        <Link to="/auth/login"><Button variant="ghost">Log in</Button></Link>
                        <Link to="/auth/signup"><Button>Sign up</Button></Link>
                    </div>
                </nav>
            </header>

            <main>
                <Hero />
                <Features />
                <Pricing />
            </main>

            <footer className="bg-slate-900 py-12 text-slate-400 text-center text-sm">
                <p>&copy; 2026 GitInsights. All rights reserved.</p>
            </footer>
        </div>
    );
}
