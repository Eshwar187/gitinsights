import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function RefundPolicy() {
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
                            <RotateCcw className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold">Refund & Cancellation Policy</h1>
                        </div>

                        <p className="text-slate-500 mb-8">Last updated: January 20, 2026</p>

                        <div className="prose dark:prose-invert max-w-none space-y-6">
                            <section>
                                <h2 className="text-xl font-semibold mb-3">1. Subscription Cancellation</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    You may cancel your subscription at any time through your account settings.Upon cancellation:
                                </p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                                    <li>You will continue to have access to premium features until the end of your billing period</li>
                                    <li>Your account will automatically downgrade to the free tier after the billing period ends</li>
                                    <li>No further charges will be made to your payment method</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">2. Refund Eligibility</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">
                                    Refunds are only available under the following exceptional conditions:
                                </p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li><strong>Technical issues:</strong> If we are unable to provide the service due to technical problems on our end that cannot be resolved</li>
                                    <li><strong>Duplicate charges:</strong> If you were charged multiple times in error</li>
                                </ul>
                                <p className="text-slate-600 dark:text-slate-400 mt-3 font-medium">
                                    Note: All subscriptions are non-refundable once payment is processed. Please review our service before subscribing.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">3. Non-Refundable Situations</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-2">
                                    Refunds will NOT be provided in the following cases:
                                </p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>Change of mind after purchase</li>
                                    <li>If you have violated our Terms of Service</li>
                                    <li>For partial months of service</li>
                                    <li>If the service was used before requesting refund</li>
                                    <li>Subscription renewals (auto-renewals can be cancelled before the renewal date)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">4. How to Request a Refund</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    To request a refund, please contact our support team with:
                                </p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                                    <li>Your registered email address</li>
                                    <li>Transaction ID or order number</li>
                                    <li>Reason for the refund request</li>
                                    <li>Date of purchase</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">5. Refund Processing Time</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Once a refund is approved:
                                </p>
                                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                                    <li>Refunds will be processed within 5-7 business days</li>
                                    <li>The amount will be credited to the original payment method</li>
                                    <li>Bank processing times may vary (additional 3-5 days)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">6. Free Trial</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    If you signed up for a free trial, you will not be charged unless you continue after the trial period. You can cancel anytime during the trial without any charges.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3">7. Contact for Refunds</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    For refund requests or questions about our cancellation policy:
                                </p>
                                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-slate-700 dark:text-slate-300">
                                        <strong>Email:</strong> <a href="mailto:jeshwar.work@gmail.com" className="text-blue-600">jeshwar.work@gmail.com</a>
                                    </p>
                                    <p className="text-slate-700 dark:text-slate-300">
                                        <strong>Phone:</strong> <a href="tel:+919761054596" className="text-blue-600">+91 9761054596</a>
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Response time: Within 24-48 hours
                                    </p>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
