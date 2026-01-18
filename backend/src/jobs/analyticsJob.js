import cron from 'node-cron';
import supabaseAdmin from '../config/database.js';
import * as analyticsService from '../services/analyticsService.js';
import logger from '../utils/logger.js';

/**
 * Recalculate developer scores for all accounts
 */
export const recalculateScores = async () => {
    try {
        logger.info('Starting weekly analytics recalculation...');

        const { data: accounts, error } = await supabaseAdmin
            .from('github_accounts')
            .select('id, username')
            .is('deleted_at', null);

        if (error || !accounts) {
            logger.error('Failed to fetch GitHub accounts for analytics');
            return;
        }

        for (const account of accounts) {
            try {
                await analyticsService.calculateAllScores(account.id);
                await analyticsService.aggregateLanguageStats(account.id);
                await analyticsService.assignBadges(account.id);

                logger.info(`Recalculated analytics for ${account.username}`);
            } catch (error) {
                logger.error(`Failed to recalculate analytics for ${account.username}:`, error);
            }
        }

        logger.info('Analytics recalculation completed');
    } catch (error) {
        logger.error('Analytics job failed:', error);
    }
};

/**
 * Schedule analytics recalculation job
 * Runs weekly on Sunday at 2 AM
 */
export const scheduleAnalyticsRecalculation = () => {
    cron.schedule('0 2 * * 0', recalculateScores); // Sunday at 2 AM
    logger.info('Analytics recalculation job scheduled (runs weekly on Sunday at 2 AM)');
};
