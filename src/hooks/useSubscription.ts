import { useAuth } from '../contexts/AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface FeatureAccess {
    // Free features
    dashboard: boolean;
    analytics: boolean;
    activity: boolean;
    repositories: boolean;
    skills: boolean;
    settings: boolean;
    // Pro features
    dna: boolean;
    wrapped: boolean;
    achievements: boolean;
    compare: boolean;
    // Premium features
    timeMachine: boolean;
    profileCard: boolean;
    repoHealth: boolean;
    // AI limits
    aiInsightsLimit: number;
    syncsPerDay: number;
}

const FEATURE_ACCESS: Record<SubscriptionTier, FeatureAccess> = {
    free: {
        dashboard: true,
        analytics: true,
        activity: true,
        repositories: true,
        skills: true,
        settings: true,
        dna: false,
        wrapped: false,
        achievements: false,
        compare: false,
        timeMachine: false,
        profileCard: false,
        repoHealth: false,
        aiInsightsLimit: 3,
        syncsPerDay: 1,
    },
    pro: {
        dashboard: true,
        analytics: true,
        activity: true,
        repositories: true,
        skills: true,
        settings: true,
        dna: true,
        wrapped: true,
        achievements: true,
        compare: true,
        timeMachine: false,
        profileCard: false,
        repoHealth: false,
        aiInsightsLimit: 10,
        syncsPerDay: 5,
    },
    premium: {
        dashboard: true,
        analytics: true,
        activity: true,
        repositories: true,
        skills: true,
        settings: true,
        dna: true,
        wrapped: true,
        achievements: true,
        compare: true,
        timeMachine: true,
        profileCard: true,
        repoHealth: true,
        aiInsightsLimit: Infinity,
        syncsPerDay: Infinity,
    },
};

export const FEATURE_NAMES: Record<keyof FeatureAccess, string> = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    activity: 'Activity',
    repositories: 'Repositories',
    skills: 'Skills',
    settings: 'Settings',
    dna: 'Developer DNA',
    wrapped: 'GitHub Wrapped',
    achievements: 'Achievements',
    compare: 'Compare Stats',
    timeMachine: 'Time Machine',
    profileCard: 'Profile Card',
    repoHealth: 'Repo Health',
    aiInsightsLimit: 'AI Insights',
    syncsPerDay: 'Daily Syncs',
};

export const FEATURE_REQUIRED_TIER: Record<string, SubscriptionTier> = {
    dna: 'pro',
    wrapped: 'pro',
    achievements: 'pro',
    compare: 'pro',
    timeMachine: 'premium',
    profileCard: 'premium',
    repoHealth: 'premium',
};

export function useSubscription() {
    const { user } = useAuth();

    const tier: SubscriptionTier = (user?.subscription_tier as SubscriptionTier) || 'free';
    const access = FEATURE_ACCESS[tier];

    const canAccess = (feature: keyof FeatureAccess): boolean => {
        return access[feature] === true || (typeof access[feature] === 'number' && access[feature] > 0);
    };

    const getRequiredTier = (feature: keyof FeatureAccess): SubscriptionTier => {
        return FEATURE_REQUIRED_TIER[feature] || 'free';
    };

    const isPro = tier === 'pro' || tier === 'premium';
    const isPremium = tier === 'premium';

    return {
        tier,
        access,
        canAccess,
        getRequiredTier,
        isPro,
        isPremium,
    };
}
