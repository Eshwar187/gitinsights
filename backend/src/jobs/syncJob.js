import cron from 'node-cron';
import supabaseAdmin from '../config/database.js';
import * as githubController from '../controllers/githubController.js';
import logger from '../utils/logger.js';

/**
 * Sync GitHub data for all accounts based on subscription tier
 */
export const syncGitHubData = async () => {
    try {
        logger.info('Starting scheduled GitHub data sync...');

        // Get all active GitHub accounts
        const { data: accounts, error } = await supabaseAdmin
            .from('github_accounts')
            .select('*, user:users(id, subscription_tier)')
            .is('deleted_at', null);

        if (error || !accounts) {
            logger.error('Failed to fetch GitHub accounts for sync');
            return;
        }

        for (const account of accounts) {
            const tier = account.user.subscription_tier || 'free';
            const lastSynced = new Date(account.last_synced_at || 0);
            const now = new Date();
            const hoursSinceSync = (now - lastSynced) / (1000 * 60 * 60);

            // Determine sync frequency based on tier
            let syncFrequency = 24; // Free tier: 24 hours
            if (tier === 'pro') syncFrequency = 6;
            if (tier === 'premium') syncFrequency = 1;

            // Check if sync is due
            if (hoursSinceSync >= syncFrequency) {
                logger.info(`Syncing account: ${account.username} (${tier})`);

                // Trigger sync (this would need to be refactored to not use req/res)
                // For now, we'll call the sync logic directly
                try {
                    await supabaseAdmin
                        .from('github_accounts')
                        .update({ sync_status: 'pending' })
                        .eq('id', account.id);

                    // In production, you'd queue this as a background job
                    logger.info(`Queued sync for ${account.username}`);
                } catch (syncError) {
                    logger.error(`Failed to sync ${account.username}:`, syncError);
                }
            }
        }

        logger.info('GitHub data sync completed');
    } catch (error) {
        logger.error('GitHub sync job failed:', error);
    }
};

/**
 * Schedule GitHub sync job
 * Runs every hour
 */
export const scheduleGitHubSync = () => {
    cron.schedule('0 * * * *', syncGitHubData); // Every hour
    logger.info('GitHub sync job scheduled (runs every hour)');
};
