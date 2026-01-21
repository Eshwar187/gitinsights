import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from './ui/Button';
import type { SubscriptionTier } from '../hooks/useSubscription';
import { FEATURE_NAMES } from '../hooks/useSubscription';

interface UpgradePromptProps {
    feature: keyof typeof FEATURE_NAMES;
    requiredTier: SubscriptionTier;
}

export function UpgradePrompt({ feature, requiredTier }: UpgradePromptProps) {
    const navigate = useNavigate();

    const tierInfo = {
        pro: {
            name: 'Pro',
            price: '₹199/mo',
            color: 'from-purple-500 to-indigo-600',
            icon: Zap,
            benefits: [
                '🧬 Developer DNA Analysis',
                '🎄 GitHub Wrapped',
                '🏅 Achievements & Badges',
                '📊 Compare Stats',
                '10 AI Insights/month',
                '5 Syncs per day',
            ]
        },
        premium: {
            name: 'Premium',
            price: '₹499/mo',
            color: 'from-amber-500 to-orange-600',
            icon: Crown,
            benefits: [
                'Everything in Pro',
                '⏰ Time Machine',
                '💳 Profile Card Generator',
                '💚 Repository Health Score',
                '♾️ Unlimited AI Insights',
                '♾️ Unlimited Syncs',
            ]
        }
    };

    const tier = tierInfo[requiredTier === 'free' ? 'pro' : requiredTier];
    const TierIcon = tier.icon;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
                <div className="text-center mb-8">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${tier.color} mb-4`}>
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {FEATURE_NAMES[feature]} is a {tier.name} Feature
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Upgrade to {tier.name} to unlock this and other powerful features
                    </p>
                </div>

                <div className={`rounded-2xl bg-gradient-to-br ${tier.color} p-[2px]`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <TierIcon className="h-6 w-6 text-amber-500" />
                                <span className="text-xl font-bold">{tier.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold">{tier.price}</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {tier.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        <Button
                            className={`w-full bg-gradient-to-r ${tier.color} text-white hover:opacity-90`}
                            onClick={() => navigate('/settings')}
                        >
                            Upgrade to {tier.name}
                        </Button>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-4">
                    Cancel anytime • Secure payment via Razorpay
                </p>
            </div>
        </div>
    );
}
