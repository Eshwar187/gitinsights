import { Button } from "../components/ui/Button";
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
                        <a href="http://localhost:5000/api/auth/github">
                            <Button>Connect with GitHub</Button>
                        </a>
                    </div>
                </nav>
            </header>

            <main>
                <Hero />
                <Features />
                <Pricing />
            </main>

            <footer className="bg-slate-900 py-12 text-slate-400">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">GitInsights</h3>
                            <p className="text-sm">Transform your GitHub activity into powerful insights and analytics.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                                <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="mailto:jeshwar.work@gmail.com" className="hover:text-white transition-colors">jeshwar.work@gmail.com</a></li>
                                <li><a href="tel:+919761054596" className="hover:text-white transition-colors">+91 9761054596</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com" className="hover:text-white transition-colors">GitHub</a></li>
                                <li><a href="https://twitter.com" className="hover:text-white transition-colors">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm">
                        <p>&copy; 2026 GitInsights. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
