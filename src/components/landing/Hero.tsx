import { Button } from "../ui/Button";
import { Github, Terminal, GitCommit, GitPullRequest, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <div className="relative isolate overflow-hidden min-h-screen flex items-center bg-[#0c1222] text-white selection:bg-amber-500/30 selection:text-amber-400">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />

            {/* Animated Background Gradient */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-rose-500 opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>

            <div className="py-20 sm:py-24 lg:py-32 lg:pb-40 w-full relative z-10 pt-24 sm:pt-28 lg:pt-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Text Content */}
                        <div className="text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 sm:mb-6"
                            >
                                <span className="inline-flex items-center gap-x-2 rounded-md bg-[#111827] px-3 py-1 text-xs sm:text-sm font-medium text-gray-300 ring-1 ring-inset ring-gray-700/50">
                                    <GitCommit className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                                    v2.0: Now with Team Velocity
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white font-sans"
                            >
                                Unlock Your <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 font-mono">
                                    Engineering DNA
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400 max-w-xl"
                            >
                                Turn your GitHub activity into actionable insights. Visualize coding habits, track velocity, and generate a professional portfolio that speaks <b>code</b>.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-x-6"
                            >
                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/github`} className="block">
                                    <Button size="lg" className="w-full sm:w-auto h-12 px-6 sm:px-8 text-base font-semibold rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 border-0 transition-all">
                                        <Github className="mr-2 h-5 w-5" />
                                        Sign in with GitHub
                                    </Button>
                                </a>
                                <a href="/docs">
                                    <Button variant="ghost" className="h-12 px-6 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700 sm:border-transparent sm:hover:border-gray-600">
                                        View Documentation
                                    </Button>
                                </a>
                            </motion.div>
                        </div>

                        {/* Terminal / Stats Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 sm:mt-16 lg:mt-0 relative"
                        >
                            <div className="relative rounded-lg bg-[#0c1222] border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden font-mono text-xs sm:text-sm leading-6">
                                <div className="flex border-b border-gray-700/50 bg-[#111827] p-3 sm:p-4">
                                    <div className="flex space-x-2">
                                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-400" />
                                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400" />
                                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="flex-1 text-center text-[10px] sm:text-xs text-gray-500 truncate">user@gitinsights: ~/analytics</div>
                                </div>
                                <div className="p-4 sm:p-6 text-gray-300 space-y-3 sm:space-y-4">
                                    <div className="flex text-xs sm:text-sm">
                                        <span className="text-amber-400 mr-2">❯</span>
                                        <span className="text-cyan-400">~</span>
                                        <span className="ml-2 truncate">git insights --analyze user</span>
                                    </div>

                                    <div className="space-y-1 text-xs sm:text-sm">
                                        <div className="text-gray-500">Analysis in progress...</div>
                                        <div className="flex justify-between items-center text-emerald-400">
                                            <span>✓ Repositories scanned</span>
                                            <span>42</span>
                                        </div>
                                        <div className="flex justify-between items-center text-emerald-400">
                                            <span>✓ Commits analyzed</span>
                                            <span>1,337</span>
                                        </div>
                                        <div className="flex justify-between items-center text-emerald-400">
                                            <span className="hidden sm:inline">✓ Languages detected</span>
                                            <span className="sm:hidden">✓ Languages</span>
                                            <span className="text-right">TS, Rust, Go</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded bg-[#111827] border border-gray-700/50">
                                        <div className="flex justify-between mb-2 text-xs sm:text-sm">
                                            <span className="text-gray-400">Productivity Score</span>
                                            <span className="text-amber-400 font-bold">Top 1%</span>
                                        </div>
                                        <div className="w-full bg-[#0c1222] rounded-full h-2 sm:h-2.5">
                                            <div className="bg-gradient-to-r from-amber-400 to-rose-400 h-2 sm:h-2.5 rounded-full" style={{ width: '98%' }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        <div className="p-2 sm:p-3 rounded bg-[#111827] border border-gray-700/50 flex flex-col items-center">
                                            <GitPullRequest className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 mb-1" />
                                            <span className="text-[10px] sm:text-xs text-gray-500">PRs</span>
                                            <span className="font-bold text-white text-sm sm:text-base">142</span>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded bg-[#111827] border border-gray-700/50 flex flex-col items-center">
                                            <GitMerge className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mb-1" />
                                            <span className="text-[10px] sm:text-xs text-gray-500">Reviews</span>
                                            <span className="font-bold text-white text-sm sm:text-base">89</span>
                                        </div>
                                        <div className="p-2 sm:p-3 rounded bg-[#111827] border border-gray-700/50 flex flex-col items-center">
                                            <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mb-1" />
                                            <span className="text-[10px] sm:text-xs text-gray-500">Lines</span>
                                            <span className="font-bold text-white text-sm sm:text-base">45k</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Glow elements */}
                            <div className="absolute -z-10 -bottom-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 bg-amber-500/10 blur-[60px] sm:blur-[80px] rounded-full" />
                            <div className="absolute -z-10 -top-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 bg-rose-500/10 blur-[60px] sm:blur-[80px] rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

