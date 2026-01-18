import cron from 'node-cron';
import supabaseAdmin from '../config/database.js';
import * as razorpayService from '../services/razorpayService.js';
import logger from '../utils/logger.js';

/**
 * Check for expired subscriptions
 */
export const checkExpiredSubscriptions = async () => {
    try {
        logger.info('Checking for expired subscriptions...');

        const now = new Date();

        // Get subscriptions that have expired
        const { data: expiredSubs, error } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*')
            .eq('status', 'active')
            .lt('current_period_end', now.toISOString());

        if (error || !expiredSubs) {
            logger.error('Failed to fetch expired subscriptions');
            return;
        }

        for (const sub of expiredSubs) {
            if (sub.cancel_at_period_end) {
                // Cancel subscription
                await razorpayService.handleExpiredSubscription(sub.id);
                logger.info(`Cancelled subscription ${sub.id}`);
            } else {
                // In production, you'd attempt to renew the subscription
                logger.info(`Subscription ${sub.id} needs renewal`);
            }
        }

        logger.info(`Processed ${expiredSubs.length} expired subscriptions`);
    } catch (error) {
        logger.error('Subscription check job failed:', error);
    }
};

/**
 * Schedule subscription check job
 * Runs daily at midnight
 */
export const scheduleSubscriptionCheck = () => {
    cron.schedule('0 0 * * *', checkExpiredSubscriptions); // Daily at midnight
    logger.info('Subscription check job scheduled (runs daily at midnight)');
};
