import { Trophy, GitCommit, GitPullRequest } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        name: 'Velocity Analytics',
        description: 'Track your commit frequency and PR merge times with precision.',
        className: 'lg:col-span-2 lg:row-span-2',
        visual: (
            <div className="absolute inset-0 flex items-end justify-center p-6 overflow-hidden">
                <div className="w-full h-48 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 relative">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Commit Velocity</span>
                        <span className="text-green-400">+12% vs last week</span>
                    </div>
                    {/* CSS Line Chart */}
                    <svg className="w-full h-32 overflow-visible">
                        <path d="M0,80 C50,80 100,40 150,50 C200,60 250,20 300,10 C350,0 400,30 450,20"
                            fill="none" stroke="#238636" strokeWidth="3" opacity="0.8" />
                        <path d="M0,80 L450,20 L450,120 L0,120 Z" fill="url(#gradient-green)" opacity="0.2" />
                        <defs>
                            <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#238636" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#238636" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Data Points */}
                        <circle cx="150" cy="50" r="4" fill="#238636" stroke="#0d1117" strokeWidth="2" />
                        <circle cx="300" cy="10" r="4" fill="#238636" stroke="#0d1117" strokeWidth="2" />
                    </svg>
                </div>
            </div>
        )
    },
    {
        name: 'Prestige Ranking',
        description: 'Earn badges and rank globally. Show off your engineering DNA.',
        className: 'lg:col-span-1 lg:row-span-2', // Made taller to fill the void
        visual: (
            <div className="absolute inset-0 flex items-center justify-center pt-20">
                <div className="relative scale-125">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                    <Trophy className="w-24 h-24 text-yellow-500 relative z-10 drop-shadow-lg" />
                    <div className="absolute -top-4 -right-4 bg-[#0d1117] border border-yellow-500/50 text-yellow-500 text-xs px-2 py-0.5 rounded-full font-bold animate-bounce">
                        Top 1%
                    </div>
                </div>
            </div>
        )
    },
];

export function Features() {
    return (
        <div className="bg-[#050505] py-24 sm:py-32 relative overflow-hidden border-t border-[#30363d]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                <div className="mx-auto max-w-2xl lg:text-center mb-20">
                    <h2 className="text-base font-semibold leading-7 text-green-400 font-mono">git commit -m "upgrade"</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">
                        Everything you need to ship faster
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-400">
                        Powerful tools integrated directly into your workflow. No context switching required.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 h-[600px] lg:h-[500px]">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative overflow-hidden rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-gray-600 transition-colors ${feature.className}`}
                            >
                                <div className="p-8 relative z-10 pointer-events-none">
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                                    <p className="text-sm text-gray-400 bg-[#161b22]/80 backdrop-blur-sm rounded inline-block">
                                        {feature.description}
                                    </p>
                                </div>
                                {feature.visual}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 flex justify-center">
                    <div className="flex items-center gap-8 text-gray-500 font-mono text-xs uppercase tracking-widest opacity-60">
                        <span className="flex items-center gap-2"><GitCommit className="w-4 h-4" /> 10k+ Commits Analyzed</span>
                        <span className="flex items-center gap-2"><GitPullRequest className="w-4 h-4" /> 5k+ PRs Reviewed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
