import { scheduleGitHubSync } from './syncJob.js';
import { scheduleSubscriptionCheck } from './subscriptionJob.js';
import { scheduleAnalyticsRecalculation } from './analyticsJob.js';
import logger from '../utils/logger.js';

/**
 * Initialize all background jobs
 */
export const initializeJobs = () => {
    logger.info('Initializing background jobs...');

    scheduleGitHubSync();
    scheduleSubscriptionCheck();
    scheduleAnalyticsRecalculation();

    logger.info('All background jobs initialized');
};

export default initializeJobs;
