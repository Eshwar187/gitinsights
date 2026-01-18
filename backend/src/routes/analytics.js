import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { checkFeatureAccess, trackUsage } from '../middleware/subscription.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Developer scores
router.get('/accounts/:accountId/scores', analyticsController.getDeveloperScores);
router.post('/accounts/:accountId/scores/recalculate', analyticsController.recalculateScores);

// Contribution heatmap
router.get('/accounts/:accountId/heatmap', analyticsController.getHeatmap);

// Language statistics
router.get('/accounts/:accountId/languages', analyticsController.getLanguageStats);

// Badges
router.get('/accounts/:accountId/badges', analyticsController.getBadges);

// AI Insights (requires subscription)
router.get(
    '/accounts/:accountId/insights',
    checkFeatureAccess('ai_insights'),
    analyticsController.getAIInsights
);

router.post(
    '/accounts/:accountId/insights/regenerate',
    checkFeatureAccess('ai_insights'),
    trackUsage('ai'),
    analyticsController.regenerateInsights
);

export default router;
