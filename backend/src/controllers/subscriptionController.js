import * as razorpayService from '../services/razorpayService.js';
import supabaseAdmin from '../config/database.js';
import { asyncHandler } from '../utils/errors.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Get all subscription plans
 */
export const getPlans = asyncHandler(async (req, res) => {
    const { data: plans, error } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

    if (error) {
        throw new Error('Failed to fetch subscription plans');
    }

    res.json({
        success: true,
        data: plans
    });
});

/**
 * Create subscription order
 */
export const subscribe = asyncHandler(async (req, res) => {
    const { planId, billingCycle } = req.body;
    const userId = req.user.id;

    // Check if user already has active subscription
    const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    if (existingSub) {
        throw new ValidationError('You already have an active subscription');
    }

    const order = await razorpayService.createSubscription(userId, planId, billingCycle);

    res.json({
        success: true,
        data: order
    });
});

/**
 * Verify payment and activate subscription
 */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature, planId, billingCycle } = req.body;
    const userId = req.user.id;

    // Verify signature
    const isValid = razorpayService.verifyPayment(orderId, paymentId, signature);

    if (!isValid) {
        throw new ValidationError('Invalid payment signature');
    }

    // Activate subscription
    const subscription = await razorpayService.activateSubscription(
        userId,
        planId,
        billingCycle,
        { orderId, paymentId, signature }
    );

    res.json({
        success: true,
        message: 'Subscription activated successfully',
        data: subscription
    });
});

/**
 * Cancel subscription
 */
export const cancel = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const subscription = await razorpayService.cancelSubscription(userId);

    res.json({
        success: true,
        message: 'Subscription will be cancelled at the end of the billing period',
        data: subscription
    });
});

/**
 * Get current subscription
 */
export const getCurrentSubscription = asyncHandler(async (req, res) => {
    const { data: subscription } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('user_id', req.user.id)
        .eq('status', 'active')
        .single();

    res.json({
        success: true,
        data: subscription || null
    });
});

/**
 * Get usage statistics
 */
export const getUsage = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: usage } = await supabaseAdmin
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('period_start', today.toISOString())
        .single();

    const { data: subscription } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    const plan = subscription?.plan || {
        max_ai_insights_monthly: 0,
        max_api_calls_daily: 0
    };

    res.json({
        success: true,
        data: {
            aiInsights: {
                used: usage?.ai_insights_used || 0,
                limit: plan.max_ai_insights_monthly
            },
            apiCalls: {
                used: usage?.api_calls_used || 0,
                limit: plan.max_api_calls_daily
            }
        }
    });
});

/**
 * Razorpay webhook handler
 */
export const webhook = asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different webhook events
    switch (event) {
        case 'payment.captured':
            // Payment successful
            logger.info('Payment captured:', payload.payment.entity.id);
            break;

        case 'payment.failed':
            // Payment failed
            logger.error('Payment failed:', payload.payment.entity.id);
            break;

        case 'subscription.cancelled':
            // Subscription cancelled
            logger.info('Subscription cancelled:', payload.subscription.entity.id);
            break;

        default:
            logger.info('Unhandled webhook event:', event);
    }

    res.json({ success: true });
});

/**
 * Simple upgrade subscription (for demo/testing without Razorpay)
 * When Razorpay is configured, this will be replaced with actual payment flow
 */
export const upgradeSubscription = asyncHandler(async (req, res) => {
    const { tier } = req.body;
    const userId = req.user.id;

    // Validate tier
    const validTiers = ['free', 'pro', 'premium'];
    if (!validTiers.includes(tier)) {
        throw new ValidationError('Invalid subscription tier');
    }

    // Update user's subscription tier in users table
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            subscription_tier: tier,
            subscription_status: tier === 'free' ? 'inactive' : 'active'
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
    }

    res.json({
        success: true,
        message: `Successfully upgraded to ${tier} plan`,
        data: { tier }
    });
});
