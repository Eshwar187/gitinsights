import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Quota middleware to check if user can use a feature
 */
export const checkQuota = (feature) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            // Call database function to check quota
            const { data, error } = await supabaseAdmin.rpc('check_feature_quota', {
                p_user_id: userId,
                p_feature: feature
            });

            if (error) {
                logger.error('Quota check error:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to check feature quota'
                });
            }

            const { allowed, used, limit_value, reset_date } = data;

            // If feature is locked (limit = 0)
            if (limit_value === 0) {
                return res.status(402).json({
                    success: false,
                    error: 'This feature requires a paid plan',
                    code: 'FEATURE_LOCKED',
                    requiredPlan: feature === 'code_review' || feature === 'ai_mentor' || feature === 'collaboration_room' ? 'pro' : 'pro',
                    currentPlan: req.user.subscription_tier || 'free',
                    upgradeUrl: '/pricing'
                });
            }

            // If quota exceeded
            if (!allowed) {
                return res.status(402).json({
                    success: false,
                    error: 'Monthly quota exceeded',
                    code: 'QUOTA_EXCEEDED',
                    quota: {
                        feature,
                        limit: limit_value,
                        used,
                        remaining: 0
                    },
                    resetDate: reset_date,
                    upgradeUrl: '/pricing'
                });
            }

            // Attach quota info to request
            req.quota = {
                feature,
                limit: limit_value,
                used,
                remaining: limit_value === -1 ? 'unlimited' : limit_value - used,
                resetDate: reset_date
            };

            next();
        } catch (error) {
            logger.error('Quota middleware error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    };
};

/**
 * Track feature usage (called after successful operation)
 */
export const trackUsage = (feature) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            await supabaseAdmin.rpc('increment_feature_usage', {
                p_user_id: userId,
                p_feature: feature
            });

            next();
        } catch (error) {
            logger.error('Failed to track usage:', error);
            // Don't fail the request if tracking fails
            next();
        }
    };
};

/**
 * Get user's current quota status
 */
export const getUserQuotas = async (userId) => {
    try {
        const features = ['code_review', 'ai_mentor', 'coding_challenge', 'collaboration_room'];
        const quotas = {};

        for (const feature of features) {
            const { data } = await supabaseAdmin.rpc('check_feature_quota', {
                p_user_id: userId,
                p_feature: feature
            });

            quotas[feature] = {
                limit: data.limit_value,
                used: data.used,
                remaining: data.limit_value === -1 ? 'unlimited' : data.limit_value - data.used,
                resetDate: data.reset_date
            };
        }

        return quotas;
    } catch (error) {
        logger.error('Failed to get user quotas:', error);
        throw error;
    }
};
