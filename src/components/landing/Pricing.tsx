import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/Button";
import { PaymentModal } from "../modals/PaymentModal";

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        href: '#',
        priceMonthly: '₹0',
        description: 'Perfect for getting started.',
        features: [
            'Dashboard & Analytics',
            'GitHub Activity Heatmap',
            'Repository Overview',
            'Skills Visualization',
            '1 Sync per Day',
            'Community Support'
        ],
        mostPopular: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '#',
        priceMonthly: '₹199',
        description: 'For serious developers.',
        features: [
            'Everything in Free',
            '🧬 Developer DNA (3D Visualization)',
            '🎄 GitHub Wrapped (Yearly Summary)',
            '🏅 Achievements & Badges',
            '📊 Compare Stats & Rankings',
            '5 Syncs per Day',
            'Priority Support',
        ],
        mostPopular: true,
    },
    {
        name: 'Premium',
        id: 'tier-premium',
        href: '#',
        priceMonthly: '₹499',
        description: 'For power users.',
        features: [
            'Everything in Pro',
            '⏰ Time Machine (Coding Journey)',
            '💳 Profile Card Generator',
            '💚 Repository Health Score',
            '♾️ Unlimited Syncs',
            'Email Support',
        ],
        mostPopular: false,
    },
];

export function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState<{ name: string, priceMonthly: string } | null>(null);

    return (
        <div className="bg-slate-50 py-24 sm:py-32 dark:bg-slate-900">
            <PaymentModal
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                plan={selectedPlan?.name || ""}
                price={selectedPlan?.priceMonthly || ""}
            />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Choose the right plan for you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600 dark:text-slate-400">
                    Start for free and upgrade as you grow. No hidden fees.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-950 p-8 ring-1 ring-slate-200 dark:ring-slate-800 xl:p-10 ${tier.mostPopular ? 'ring-2 ring-blue-600 scale-105 z-10' : ''
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        id={tier.id}
                                        className={`text-lg font-semibold leading-8 ${tier.mostPopular ? 'text-blue-600' : 'text-slate-900 dark:text-white'
                                            }`}
                                    >
                                        {tier.name}
                                    </h3>
                                    {tier.mostPopular ? (
                                        <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                                            Most popular
                                        </span>
                                    ) : null}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{tier.description}</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{tier.priceMonthly}</span>
                                    <span className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">/month</span>
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                className={`mt-8 w-full ${tier.mostPopular ? '' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                variant={tier.mostPopular ? 'default' : 'outline'}
                                aria-describedby={tier.id}
                                onClick={() => setSelectedPlan(tier)}
                            >
                                Get started
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
