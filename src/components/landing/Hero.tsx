import { Button } from "../ui/Button";
import { Github, ArrowRight, Terminal, GitCommit, GitPullRequest, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <div className="relative isolate overflow-hidden min-h-screen flex items-center bg-[#0d1117] text-white selection:bg-green-500/30 selection:text-green-400">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.2]" />

            {/* Animated Contribution Graph Background (Simplified CSS representation) */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#238636] to-[#2f81f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>

            <div className="py-24 sm:py-32 lg:pb-40 w-full relative z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 gap-16 items-center">

                        {/* Text Content */}
                        <div className="text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-6"
                            >
                                <span className="inline-flex items-center gap-x-2 rounded-md bg-[#161b22] px-3 py-1 text-sm font-medium text-gray-300 ring-1 ring-inset ring-gray-700/50">
                                    <GitCommit className="h-4 w-4 text-green-400" />
                                    v2.0: Now with Team Velocity
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-5xl font-bold tracking-tight text-white sm:text-7xl font-sans"
                            >
                                Unlock Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-mono">
                                    Engineering DNA
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-6 text-lg leading-8 text-gray-400 max-w-xl"
                            >
                                Turn your GitHub activity into actionable insights. Visualize coding habits, track velocity, and generate a professional portfolio that speaks <b>code</b>.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-10 flex items-center gap-x-6"
                            >
                                <a href="http://localhost:5000/api/auth/github">
                                    <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-md bg-[#238636] text-white hover:bg-[#2ea043] shadow-sm border border-[rgba(240,246,252,0.1)] transition-all">
                                        <Github className="mr-2 h-5 w-5" />
                                        Sign in with GitHub
                                    </Button>
                                </a>
                                <Button variant="ghost" className="h-12 px-6 rounded-md text-gray-300 hover:text-white hover:bg-[#161b22] border border-transparent hover:border-gray-700">
                                    View Documentation
                                </Button>
                            </motion.div>
                        </div>

                        {/* Terminal / Stats Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-16 lg:mt-0 relative"
                        >
                            <div className="relative rounded-lg bg-[#0d1117] border border-[#30363d] shadow-2xl shadow-black/50 overflow-hidden font-mono text-sm leading-6">
                                <div className="flex border-b border-[#30363d] bg-[#161b22] p-4">
                                    <div className="flex space-x-2">
                                        <div className="h-3 w-3 rounded-full bg-[#fa7970]" />
                                        <div className="h-3 w-3 rounded-full bg-[#faa356]" />
                                        <div className="h-3 w-3 rounded-full bg-[#7ce38b]" />
                                    </div>
                                    <div className="flex-1 text-center text-xs text-gray-500">user@gitinsights: ~/analytics</div>
                                </div>
                                <div className="p-6 text-gray-300 space-y-4">
                                    <div className="flex">
                                        <span className="text-green-400 mr-2">➜</span>
                                        <span className="text-blue-400">~</span>
                                        <span className="ml-2">git insights --analyze user</span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-500">Analysis in progress...</div>
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>✓ Repositories scanned</span>
                                            <span>42</span>
                                        </div>
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>✓ Commits analyzed</span>
                                            <span>1,337</span>
                                        </div>
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>✓ Languages detected</span>
                                            <span>TypeScript, Rust, Go</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 rounded bg-[#161b22] border border-[#30363d]">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400">Productivity Score</span>
                                            <span className="text-green-400 font-bold">Top 1%</span>
                                        </div>
                                        <div className="w-full bg-[#0d1117] rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1 p-3 rounded bg-[#161b22] border border-[#30363d] flex flex-col items-center">
                                            <GitPullRequest className="h-5 w-5 text-purple-400 mb-1" />
                                            <span className="text-xs text-gray-500">PRs Merged</span>
                                            <span className="font-bold text-white">142</span>
                                        </div>
                                        <div className="flex-1 p-3 rounded bg-[#161b22] border border-[#30363d] flex flex-col items-center">
                                            <GitMerge className="h-5 w-5 text-blue-400 mb-1" />
                                            <span className="text-xs text-gray-500">Code Reviews</span>
                                            <span className="font-bold text-white">89</span>
                                        </div>
                                        <div className="flex-1 p-3 rounded bg-[#161b22] border border-[#30363d] flex flex-col items-center">
                                            <Terminal className="h-5 w-5 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Lines Code</span>
                                            <span className="font-bold text-white">45k</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Glow elements */}
                            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full sm:blur-[100px]" />
                            <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full sm:blur-[100px]" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
