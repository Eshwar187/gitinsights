import Razorpay from 'razorpay';
import crypto from 'crypto';
import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';
import { ExternalServiceError } from '../utils/errors.js';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay subscription
 */
export const createSubscription = async (userId, planId, billingCycle) => {
    try {
        // Get plan details
        const { data: plan } = await supabaseAdmin
            .from('subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (!plan) {
            throw new Error('Plan not found');
        }

        const amount = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `sub_${userId}_${Date.now()}`,
            notes: {
                user_id: userId,
                plan_id: planId,
                billing_cycle: billingCycle
            }
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        };
    } catch (error) {
        logger.error('Failed to create Razorpay subscription:', error);
        throw new ExternalServiceError('Failed to create subscription order');
    }
};

/**
 * Verify payment signature
 */
export const verifyPayment = (orderId, paymentId, signature) => {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

    return generated_signature === signature;
};

/**
 * Activate subscription after successful payment
 */
export const activateSubscription = async (userId, planId, billingCycle, razorpayData) => {
    try {
        const { data: plan } = await supabaseAdmin
            .from('subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();

        const now = new Date();
        const periodEnd = new Date(now);

        if (billingCycle === 'yearly') {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Create subscription record
        const { data: subscription, error } = await supabaseAdmin
            .from('user_subscriptions')
            .insert({
                user_id: userId,
                plan_id: planId,
                status: 'active',
                billing_cycle: billingCycle,
                razorpay_subscription_id: razorpayData.subscriptionId,
                razorpay_payment_id: razorpayData.paymentId,
                current_period_start: now.toISOString(),
                current_period_end: periodEnd.toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Update user's subscription tier
        await supabaseAdmin
            .from('users')
            .update({
                subscription_tier: plan.name,
                subscription_status: 'active'
            })
            .eq('id', userId);

        // Create payment record
        await supabaseAdmin
            .from('payment_records')
            .insert({
                user_id: userId,
                subscription_id: subscription.id,
                amount: billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly,
                currency: 'INR',
                status: 'success',
                razorpay_payment_id: razorpayData.paymentId,
                razorpay_order_id: razorpayData.orderId,
                razorpay_signature: razorpayData.signature
            });

        return subscription;
    } catch (error) {
        logger.error('Failed to activate subscription:', error);
        throw error;
    }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (userId) => {
    try {
        const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (!subscription) {
            throw new Error('No active subscription found');
        }

        // Mark for cancellation at period end
        await supabaseAdmin
            .from('user_subscriptions')
            .update({
                cancel_at_period_end: true,
                cancelled_at: new Date().toISOString()
            })
            .eq('id', subscription.id);

        return subscription;
    } catch (error) {
        logger.error('Failed to cancel subscription:', error);
        throw error;
    }
};

/**
 * Handle subscription expiry
 */
export const handleExpiredSubscription = async (subscriptionId) => {
    try {
        const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*')
            .eq('id', subscriptionId)
            .single();

        if (!subscription) return;

        // Update subscription status
        await supabaseAdmin
            .from('user_subscriptions')
            .update({ status: 'expired' })
            .eq('id', subscriptionId);

        // Downgrade user to free tier
        await supabaseAdmin
            .from('users')
            .update({
                subscription_tier: 'free',
                subscription_status: 'inactive'
            })
            .eq('id', subscription.user_id);

        logger.info(`Subscription ${subscriptionId} expired`);
    } catch (error) {
        logger.error('Failed to handle expired subscription:', error);
    }
};
