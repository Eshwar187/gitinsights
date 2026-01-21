import { useState } from "react";
import { Check, Info, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { PaymentModal } from "../modals/PaymentModal";
import { motion, AnimatePresence } from "framer-motion";

const tiers = [
    {
        name: 'Hobbyist',
        id: 'tier-hobby',
        priceMonthly: '₹0',
        priceYearly: '₹0',
        description: 'For personal projects and experiments.',
        features: [
            'Public Repositories Only',
            '30-Day History',
            'Basic Analytics',
            'Community Support',
            '1 Sync / Day'
        ],
        mostPopular: false,
        buttonText: 'Start for Free',
        buttonVariant: 'outline' as const
    },
    {
        name: 'Professional',
        id: 'tier-pro',
        priceMonthly: '₹199',
        priceYearly: '₹1999',
        description: 'For innovative developers building careers.',
        features: [
            'Unlimited Private Repositories',
            'Unlimited History',
            'Advanced Velocity Metrics',
            'Developer DNA (3D)',
            'Priority Email Support',
            '5 Syncs / Day',
            'Export Reports'
        ],
        mostPopular: true,
        buttonText: 'Start Pro Trial',
        buttonVariant: 'default' as const
    },
    {
        name: 'Organization',
        id: 'tier-org',
        priceMonthly: '₹499',
        priceYearly: '₹4999',
        description: 'For engineering teams and leaders.',
        features: [
            'Team Velocity Dashboard',
            'Repository Health Scores',
            'SSO / SAML (Coming Soon)',
            'Unlimited Syncs',
            'Dedicated Success Manager',
            'Custom Invoicing',
            'On-Premise Option'
        ],
        mostPopular: false,
        buttonText: 'Contact Sales',
        buttonVariant: 'outline' as const
    },
];

export function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState<{ name: string, priceMonthly: string } | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="bg-[#050505] py-24 sm:py-32 border-t border-[#30363d] relative overflow-hidden">
            <PaymentModal
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                plan={selectedPlan?.name || ""}
                price={selectedPlan?.priceMonthly || ""}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-green-400 font-mono uppercase tracking-widest">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl font-sans">
                        Invest in your <span className="text-green-400">career velocity</span>
                    </p>
                    <p className="mt-4 text-lg text-gray-400">
                        Simple, transparent pricing. No credit card required to start.
                    </p>

                    {/* Billing Toggle */}
                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-4 bg-[#161b22] px-1 p-1 rounded-lg border border-[#30363d]">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${billingCycle === 'monthly' ? 'bg-[#238636] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors relative ${billingCycle === 'yearly' ? 'bg-[#238636] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            >
                                Yearly
                                <span className="absolute -top-3 -right-3 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    -20%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-2xl p-8 ring-1 transition-all ${tier.mostPopular
                                    ? 'bg-[#161b22] ring-[#238636] shadow-xl shadow-green-900/20 scale-105 z-10'
                                    : 'bg-[#0d1117] ring-[#30363d] hover:bg-[#161b22]'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-x-4">
                                <h3 id={tier.id} className={`text-lg font-semibold leading-8 ${tier.mostPopular ? 'text-white' : 'text-gray-300'}`}>
                                    {tier.name}
                                </h3>
                                {tier.mostPopular && (
                                    <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                                        Suggested
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm leading-6 text-gray-400 h-12">{tier.description}</p>

                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-white">
                                    {billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                                </span>
                                <span className="text-sm font-semibold leading-6 text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </p>

                            <Button
                                onClick={() => setSelectedPlan(tier)}
                                variant={tier.mostPopular ? "default" : "outline"}
                                className={`mt-6 w-full ${tier.mostPopular
                                        ? 'bg-[#238636] hover:bg-[#2ea043] text-white border-0'
                                        : 'bg-transparent border-[#30363d] text-white hover:bg-[#21262d] hover:border-[#8b949e]'
                                    }`}
                            >
                                {tier.buttonText}
                            </Button>

                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-400">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3 text-gray-300">
                                        <Check className="h-6 w-5 flex-none text-green-400" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-500 flex justify-center items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Secure payment processing via Razorpay. cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
