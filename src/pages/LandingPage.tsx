import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-[#0c1222] text-white">
            <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-800/50 bg-[#0c1222]/80 backdrop-blur-md">
                <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5 font-bold text-xl text-white font-mono flex items-center gap-2">
                            <span className="text-amber-500">✦</span>
                            <span className="hidden sm:inline">GitInsights</span>
                            <span className="sm:hidden">GI</span>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden lg:flex flex-1 justify-end gap-x-4">
                        <a href="/auth/login">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-amber-500/50">Sign In</Button>
                        </a>
                    </div>
                </nav>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden px-4 pb-4 space-y-2 bg-[#0c1222] border-t border-gray-800/50">
                        <a href="/auth/login" className="block">
                            <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50">
                                Sign In
                            </Button>
                        </a>
                    </div>
                )}
            </header>

            <main>
                <Hero />
                <Features />
                <Pricing />
            </main>

            <footer className="bg-[#0a0f1a] py-8 sm:py-12 text-gray-400 border-t border-gray-800/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-white font-bold text-lg mb-4 font-mono">GitInsights</h3>
                            <p className="text-sm">Transform your GitHub activity into powerful insights and analytics.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</a></li>
                                <li><a href="/refund" className="hover:text-amber-400 transition-colors">Refund Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
                                <li><a href="mailto:jeshwar.work@gmail.com" className="hover:text-amber-400 transition-colors text-xs sm:text-sm break-all">jeshwar.work@gmail.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/Eshwar187" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">GitHub</a></li>
                                <li><a href="https://www.linkedin.com/in/j-eshwar-7b8854289/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800/50 pt-8 text-center text-sm font-mono text-gray-500">
                        <p>&copy; 2026 GitInsights. Open Source.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
