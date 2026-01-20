import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <Card>
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        </div>

                        <p className="text-slate-500 mb-8">Last updated: January 20, 2026</p>

                        <div className="prose dark:prose-invert max-w-none space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    GitInsights ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">We collect information that you provide directly to us:</p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>GitHub account information (username, email, profile picture)</li>
                                    <li>Repository data and contribution statistics</li>
                                    <li>Payment information (processed securely via Razorpay)</li>
                                    <li>Communication data when you contact us</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>To provide and maintain our services</li>
                                    <li>To analyze your GitHub activity and generate insights</li>
                                    <li>To process payments and subscriptions</li>
                                    <li>To communicate with you about updates and features</li>
                                    <li>To improve our services and user experience</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We implement appropriate technical and organizational security measures to protect your personal information. Your payment data is processed securely through Razorpay and we never store your complete payment card details on our servers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We use third-party services including GitHub API for data access and Razorpay for payment processing. These services have their own privacy policies governing the use of your information.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">You have the right to:</p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    If you have questions about this Privacy Policy, please contact us at:
                                </p>
                                <div className="mt-2 text-slate-600 dark:text-slate-400">
                                    <p>Email: <a href="mailto:jeshwar.work@gmail.com" className="text-blue-600">jeshwar.work@gmail.com</a></p>
                                    <p>Phone: <a href="tel:+919761054596" className="text-blue-600">+91 9761054596</a></p>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
