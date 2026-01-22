import { motion } from "framer-motion";
import {
    BookOpen,
    Rocket,
    Shield,
    CreditCard,
    Code2,
    BarChart3,
    Award,
    Clock,
    CheckCircle,
    ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Documentation() {
    const features = [
        {
            icon: Code2,
            title: "GitHub Analytics",
            description: "Comprehensive analysis of your repositories, commits, languages, and contribution patterns."
        },
        {
            icon: BarChart3,
            title: "Developer Score",
            description: "A calculated score based on your GitHub activity, code quality, and contributions."
        },
        {
            icon: Award,
            title: "Achievements",
            description: "Unlock achievements as you hit milestones - 100 commits, 1000 stars, and more."
        },
        {
            icon: Clock,
            title: "Activity Tracking",
            description: "Track your coding habits, peak productivity times, and weekly trends."
        }
    ];

    const tiers = [
        {
            name: "Free",
            price: "₹0",
            color: "text-emerald-400",
            features: [
                "GitHub OAuth Integration",
                "Basic Analytics Dashboard",
                "Top Repositories View",
                "Language Statistics",
                "Contribution Heatmap",
                "1 Sync per Day"
            ]
        },
        {
            name: "Pro",
            price: "₹199/month",
            color: "text-blue-400",
            features: [
                "Everything in Free",
                "AI-Powered Insights",
                "Developer Score",
                "Achievements System",
                "Activity Analytics",
                "5 Syncs per Day",
                "PR & Code Review Stats"
            ]
        },
        {
            name: "Premium",
            price: "₹399/month",
            color: "text-purple-400",
            features: [
                "Everything in Pro",
                "Time Machine Feature",
                "Compare Stats with Others",
                "Developer DNA Profile",
                "GitHub Wrapped",
                "Unlimited Syncs",
                "Data Export (JSON)",
                "Priority Support"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            {/* Header */}
            <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                            GI
                        </div>
                        <span className="text-xl font-bold text-white">GitInsights</span>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" className="text-white hover:bg-[#21262d]">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Documentation</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Learn how to get the most out of GitInsights - your GitHub analytics and portfolio platform.
                    </p>
                </motion.div>

                {/* Getting Started */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Rocket className="w-6 h-6 text-blue-400" />
                        Getting Started
                    </h2>
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg mb-1">Step 1: Sign in with GitHub</h3>
                                <p className="text-slate-300">Click "Sign in with GitHub" to connect your account. We'll request read access to your public repositories.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg mb-1">Step 2: Sync Your Data</h3>
                                <p className="text-slate-300">Your GitHub data will sync automatically. The initial sync may take a few seconds depending on your repository count.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg mb-1">Step 3: Explore Your Dashboard</h3>
                                <p className="text-slate-300">View your stats, track achievements, and discover insights about your coding habits.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Code2 className="w-6 h-6 text-purple-400" />
                        Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <feature.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                                        <p className="text-slate-300">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Tiers */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <CreditCard className="w-6 h-6 text-green-400" />
                        Subscription Tiers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier) => (
                            <div key={tier.name} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className={`text-2xl font-bold ${tier.color} mb-4`}>{tier.price}</p>
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-slate-200">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Shield className="w-6 h-6 text-yellow-400" />
                        Security & Privacy
                    </h2>
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
                        <p className="text-slate-200">
                            <strong className="text-white">OAuth 2.0:</strong> We use GitHub's official OAuth flow. We never see or store your GitHub password.
                        </p>
                        <p className="text-slate-200">
                            <strong className="text-white">Read-Only Access:</strong> We only request read access to your public repositories. We cannot modify your code.
                        </p>
                        <p className="text-slate-200">
                            <strong className="text-white">Encrypted Storage:</strong> All sensitive data including tokens are encrypted using AES-256 encryption.
                        </p>
                        <p className="text-slate-200">
                            <strong className="text-white">Secure Payments:</strong> All payments are processed securely through Razorpay. We never store your card details.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-white">Need Help?</h2>
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                        <p className="text-slate-200 mb-4">
                            Have questions or need support? Reach out to us:
                        </p>
                        <ul className="space-y-3 text-slate-200">
                            <li className="flex items-center gap-2">
                                <span>📧</span>
                                <span>Email:</span>
                                <a href="mailto:jeshwar.work@gmail.com" className="text-blue-400 hover:underline font-medium">jeshwar.work@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>🐙</span>
                                <span>GitHub:</span>
                                <a href="https://github.com/Eshwar187" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">@Eshwar187</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>💼</span>
                                <span>LinkedIn:</span>
                                <a href="https://www.linkedin.com/in/j-eshwar-7b8854289/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">J Eshwar</a>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#30363d] mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
                    <p>&copy; 2026 GitInsights. Built with ❤️ by J Eshwar</p>
                </div>
            </footer>
        </div>
    );
}
