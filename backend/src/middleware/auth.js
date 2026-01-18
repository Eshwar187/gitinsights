import passport from 'passport';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import supabaseAdmin from '../config/database.js';

/**
 * Authenticate user using JWT
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new AuthenticationError('Invalid or expired token'));
        }

        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};

/**
 * Require specific subscription tier
 */
export const requireSubscription = (minTier = 'free') => {
    const tierLevels = { free: 0, pro: 1, premium: 2 };

    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(new AuthenticationError());
            }

            const userTier = req.user.subscription_tier || 'free';
            const userLevel = tierLevels[userTier] || 0;
            const requiredLevel = tierLevels[minTier] || 0;

            if (userLevel < requiredLevel) {
                return next(new AuthorizationError(`This feature requires ${minTier} subscription`));
            }

            // Check if subscription is active
            if (userTier !== 'free' && req.user.subscription_status !== 'active') {
                return next(new AuthorizationError('Your subscription is not active'));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check if user has access to specific feature
 */
export const requireFeature = (featureName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(new AuthenticationError());
            }

            // Get user's subscription plan
            const { data: subscription, error } = await supabaseAdmin
                .from('user_subscriptions')
                .select('*, plan:subscription_plans(*)')
                .eq('user_id', req.user.id)
                .eq('status', 'active')
                .single();

            if (error || !subscription) {
                // Check if feature is available in free tier
                const freeFeatures = ['heatmap', 'languageBreakdown', 'publicPortfolio'];
                if (!freeFeatures.includes(featureName)) {
                    return next(new AuthorizationError(`This feature requires a subscription`));
                }
            } else {
                const features = subscription.plan.features || {};
                if (!features[featureName]) {
                    return next(new AuthorizationError(`This feature is not available in your plan`));
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Rate limiting middleware
 */
export const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later'
        });
    }
});

/**
 * Stricter rate limiting for auth endpoints
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true
});

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return decoded;
    } catch (error) {
        throw new AuthenticationError('Invalid refresh token');
    }
};
