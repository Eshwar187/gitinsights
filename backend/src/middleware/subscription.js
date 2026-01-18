import { SubscriptionError } from '../utils/errors.js';
import supabaseAdmin from '../config/database.js';

/**
 * Check if user has reached their feature limit
 */
export const checkFeatureAccess = (featureName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(new Error('User not authenticated'));
            }

            const userId = req.user.id;
            const tier = req.user.subscription_tier || 'free';

            // Get subscription plan limits
            const { data: subscription } = await supabaseAdmin
                .from('user_subscriptions')
                .select('*, plan:subscription_plans(*)')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            const plan = subscription?.plan || {
                max_github_accounts: 1,
                max_ai_insights_monthly: 0,
                max_api_calls_daily: 0
            };

            // Check specific feature limits
            switch (featureName) {
                case 'github_account':
                    const { count: accountCount } = await supabaseAdmin
                        .from('github_accounts')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId)
                        .is('deleted_at', null);

                    if (accountCount >= plan.max_github_accounts) {
                        return next(new SubscriptionError(
                            `You've reached the maximum number of GitHub accounts (${plan.max_github_accounts}). Upgrade to add more.`
                        ));
                    }
                    break;

                case 'ai_insights':
                    if (plan.max_ai_insights_monthly === 0) {
                        return next(new SubscriptionError('AI insights require a Pro or Premium subscription'));
                    }

                    // Check monthly usage
                    const currentMonth = new Date();
                    currentMonth.setDate(1);
                    currentMonth.setHours(0, 0, 0, 0);

                    const { data: usage } = await supabaseAdmin
                        .from('usage_tracking')
                        .select('ai_insights_used')
                        .eq('user_id', userId)
                        .gte('period_start', currentMonth.toISOString())
                        .single();

                    const used = usage?.ai_insights_used || 0;
                    if (used >= plan.max_ai_insights_monthly) {
                        return next(new SubscriptionError(
                            `You've reached your monthly AI insights limit (${plan.max_ai_insights_monthly}). Upgrade for more.`
                        ));
                    }

                    req.aiInsightsUsed = used;
                    break;

                case 'api_access':
                    if (plan.max_api_calls_daily === 0) {
                        return next(new SubscriptionError('API access requires a Pro or Premium subscription'));
                    }

                    // Check daily usage
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const { data: apiUsage } = await supabaseAdmin
                        .from('usage_tracking')
                        .select('api_calls_used')
                        .eq('user_id', userId)
                        .gte('period_start', today.toISOString())
                        .single();

                    const apiUsed = apiUsage?.api_calls_used || 0;
                    if (apiUsed >= plan.max_api_calls_daily) {
                        return next(new SubscriptionError(
                            `You've reached your daily API call limit (${plan.max_api_calls_daily}). Upgrade for more.`
                        ));
                    }
                    break;
            }

            req.subscriptionPlan = plan;
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Track feature usage
 */
export const trackUsage = (usageType) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next();
            }

            const userId = req.user.id;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const periodEnd = new Date(today);
            periodEnd.setMonth(periodEnd.getMonth() + 1);

            // Upsert usage tracking
            const updateField = usageType === 'ai' ? 'ai_insights_used' : 'api_calls_used';

            await supabaseAdmin.rpc('increment_usage', {
                p_user_id: userId,
                p_period_start: today.toISOString().split('T')[0],
                p_period_end: periodEnd.toISOString().split('T')[0],
                p_field: updateField
            });

            next();
        } catch (error) {
            // Don't fail the request if usage tracking fails
            console.error('Usage tracking error:', error);
            next();
        }
    };
};

/**
 * Check quota helper function
 */
export const checkQuota = async (userId, quotaType) => {
    const { data: subscription } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    const plan = subscription?.plan || {};

    const quotas = {
        github_accounts: plan.max_github_accounts || 1,
        ai_insights: plan.max_ai_insights_monthly || 0,
        api_calls: plan.max_api_calls_daily || 0,
        sync_frequency: plan.sync_frequency_hours || 24,
        historical_data: plan.historical_data_months || 3
    };

    return quotas[quotaType] || 0;
};
