import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";
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
            <header className="border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                            GI
                        </div>
                        <span className="text-xl font-bold">GitInsights</span>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" className="text-gray-300 hover:text-white">
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
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Documentation</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Learn how to get the most out of GitInsights - your GitHub analytics and portfolio platform.
                    </p>
                </motion.div>

                {/* Getting Started */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-blue-500" />
                        Getting Started
                    </h2>
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Step 1: Sign in with GitHub</h3>
                                    <p className="text-gray-400">Click "Sign in with GitHub" to connect your account. We'll request read access to your public repositories.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Step 2: Sync Your Data</h3>
                                    <p className="text-gray-400">Your GitHub data will sync automatically. The initial sync may take a few seconds depending on your repository count.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Step 3: Explore Your Dashboard</h3>
                                    <p className="text-gray-400">View your stats, track achievements, and discover insights about your coding habits.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-purple-500" />
                        Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <feature.icon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Pricing Tiers */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        Subscription Tiers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier) => (
                            <Card key={tier.name}>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                    <p className="text-2xl font-bold text-blue-400 mb-4">{tier.price}</p>
                                    <ul className="space-y-2">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Security */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-yellow-500" />
                        Security & Privacy
                    </h2>
                    <Card>
                        <CardContent className="p-6 space-y-4 text-gray-400">
                            <p>
                                <strong className="text-white">OAuth 2.0:</strong> We use GitHub's official OAuth flow. We never see or store your GitHub password.
                            </p>
                            <p>
                                <strong className="text-white">Read-Only Access:</strong> We only request read access to your public repositories. We cannot modify your code.
                            </p>
                            <p>
                                <strong className="text-white">Encrypted Storage:</strong> All sensitive data including tokens are encrypted using AES-256 encryption.
                            </p>
                            <p>
                                <strong className="text-white">Secure Payments:</strong> All payments are processed securely through Razorpay. We never store your card details.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Need Help?</h2>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-gray-400 mb-4">
                                Have questions or need support? Reach out to us:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>📧 Email: <a href="mailto:jeshwar.work@gmail.com" className="text-blue-400 hover:underline">jeshwar.work@gmail.com</a></li>
                                <li>🐙 GitHub: <a href="https://github.com/Eshwar187" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@Eshwar187</a></li>
                                <li>💼 LinkedIn: <a href="https://www.linkedin.com/in/j-eshwar-7b8854289/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">J Eshwar</a></li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#21262d] mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2026 GitInsights. Built with ❤️ by J Eshwar</p>
                </div>
            </footer>
        </div>
    );
}
