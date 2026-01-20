import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsConditions() {
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
                            <FileText className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold">Terms and Conditions</h1>
                        </div>

                        <p className="text-slate-500 mb-8">Last updated: January 20, 2026</p>

                        <div className="prose dark:prose-invert max-w-none space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    By accessing and using GitInsights, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    GitInsights provides analytics and insights for GitHub users, including repository analysis, contribution tracking, developer scoring, and profile generation tools.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>You must have a valid GitHub account to use our services</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                    <li>You must provide accurate and complete information</li>
                                    <li>You must be at least 13 years old to use this service</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. Subscription and Payments</h2>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>Some features require a paid subscription</li>
                                    <li>Payments are processed securely through Razorpay</li>
                                    <li>Subscription fees are billed in advance on a monthly/yearly basis</li>
                                    <li>Prices are subject to change with prior notice</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">You agree not to:</p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>Use the service for any unlawful purpose</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Interfere with or disrupt the service</li>
                                    <li>Reverse engineer or attempt to extract source code</li>
                                    <li>Use automated systems to access the service excessively</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    All content, features, and functionality of GitInsights are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    GitInsights is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    For questions about these Terms, contact us at:
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
