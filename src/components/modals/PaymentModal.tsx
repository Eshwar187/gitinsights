import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface PaymentModalProps {
    plan: string;
    price: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentModal({ plan, price, isOpen, onClose }: PaymentModalProps) {
    const [step, setStep] = useState<"details" | "processing" | "success" | "error">("details");

    if (!isOpen) return null;

    const handlePay = async () => {
        setStep("processing");

        try {
            // Get the tier name from plan
            const tier = plan.toLowerCase(); // 'pro' or 'premium'

            // Call API to update subscription
            const response = await fetch('/api/subscription/upgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tier })
            });

            const data = await response.json();

            if (data.success) {
                setStep("success");
                // Update local storage with new tier
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                userData.subscription_tier = tier;
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setStep("error");
            toast.error('Payment failed. Please try again.');
        }
    };

    const handleClose = () => {
        setStep("details");
        onClose();
        // Reload page to refresh user context
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
                            <CardTitle>Upgrade to {plan}</CardTitle>
                            <CardDescription>Secure payment via Razorpay</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-xl font-bold">{price}/mo</span>
                            </div>
                            <div className="text-xs text-slate-500 text-center">
                                <span className="flex items-center justify-center gap-1 mb-2">
                                    🔒 256-bit SSL Encrypted
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePay}>
                                Pay {price}
                            </Button>
                        </CardFooter>
                    </>
                )}

                {step === "processing" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className="text-sm font-medium">Processing payment...</p>
                    </CardContent>
                )}

                {step === "success" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                            <Check className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Payment Successful!</h3>
                            <p className="text-sm text-slate-500">Welcome to GitInsights {plan}.</p>
                        </div>
                        <Button onClick={handleClose} className="mt-4">Continue to Dashboard</Button>
                    </CardContent>
                )}

                {step === "error" && (
                    <CardContent className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                            <X className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Payment Failed</h3>
                            <p className="text-sm text-slate-500">Please try again.</p>
                        </div>
                        <Button onClick={() => setStep("details")} className="mt-4">Try Again</Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
