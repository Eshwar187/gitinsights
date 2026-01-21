import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Check, X, CreditCard, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentModalProps {
    plan: string;
    price: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentModal({ plan, price, isOpen, onClose }: PaymentModalProps) {
    const [step, setStep] = useState<"details" | "processing" | "success" | "error">("details");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const { refreshUser } = useAuth();

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isOpen) return null;

    const handlePay = async () => {
        setStep("processing");
        const tier = plan.toLowerCase();

        try {
            // First, try to create a Razorpay order
            const orderResponse = await fetch('/api/subscription/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    planId: tier === 'pro' ? 'pro' : 'premium',
                    billingCycle: 'monthly'
                })
            });

            const orderData = await orderResponse.json();

            if (orderData.success && orderData.data?.orderId && razorpayLoaded) {
                // Razorpay is configured - open payment modal
                const options = {
                    key: orderData.data.key,
                    amount: orderData.data.amount,
                    currency: orderData.data.currency,
                    name: 'GitInsights',
                    description: `${plan} Plan Subscription`,
                    order_id: orderData.data.orderId,
                    handler: async function (response: any) {
                        // Verify payment on backend
                        const verifyResponse = await fetch('/api/subscription/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                planId: tier === 'pro' ? 'pro' : 'premium',
                                billingCycle: 'monthly'
                            })
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            setStep("success");
                            await refreshUser();
                        } else {
                            setStep("error");
                        }
                    },
                    prefill: {
                        name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name : '',
                        email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '',
                    },
                    theme: {
                        color: '#6366f1'
                    },
                    modal: {
                        ondismiss: function () {
                            setStep("details");
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Razorpay not configured - use demo upgrade
                const upgradeResponse = await fetch('/api/subscription/upgrade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ tier })
                });

                const upgradeData = await upgradeResponse.json();

                if (upgradeData.success) {
                    setStep("success");
                    await refreshUser();
                } else {
                    throw new Error(upgradeData.message || 'Upgrade failed');
                }
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setStep("error");
            toast.error(error.message || 'Payment failed. Please try again.');
        }
    };

    const handleClose = () => {
        setStep("details");
        onClose();
        if (step === "success") {
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md relative">
                <button onClick={handleClose} className="absolute right-4 top-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                    <X className="h-4 w-4" />
                </button>

                {step === "details" && (
                    <>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-blue-500" />
                                Upgrade to {plan}
                            </CardTitle>
                            <CardDescription>Secure payment via Razorpay</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{price}/mo</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Cancel anytime</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Instant activation</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <span>256-bit SSL Encrypted</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                onClick={handlePay}
                            >
                                Pay {price}
                            </Button>
                        </CardFooter>
                    </>
                )}

                {step === "processing" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className="text-sm font-medium">Processing payment...</p>
                        <p className="text-xs text-slate-500">Please don't close this window</p>
                    </CardContent>
                )}

                {step === "success" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                            <Check className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Welcome to {plan}!</h3>
                            <p className="text-sm text-slate-500 mt-1">Your subscription is now active.</p>
                        </div>
                        <Button onClick={handleClose} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600">
                            Continue to Dashboard
                        </Button>
                    </CardContent>
                )}

                {step === "error" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-red-400 to-rose-500 flex items-center justify-center text-white shadow-lg">
                            <X className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Payment Failed</h3>
                            <p className="text-sm text-slate-500 mt-1">Please try again or contact support.</p>
                        </div>
                        <Button onClick={() => setStep("details")} variant="outline" className="mt-4">
                            Try Again
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
