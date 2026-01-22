import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { checkFeatureAccess, trackUsage } from '../middleware/subscription.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Simplified routes (auto-detect user's GitHub account)
router.get('/scores', analyticsController.getUserScores);
router.get('/languages', analyticsController.getUserLanguageStats);
router.get('/heatmap', analyticsController.getUserHeatmap);
router.get('/badges', analyticsController.getUserBadges);
router.get('/ai-insights', checkFeatureAccess('ai_insights'), analyticsController.getUserAIInsights);
router.post('/ai-insights', checkFeatureAccess('ai_insights'), trackUsage('ai'), analyticsController.regenerateUserAIInsights);

// Account-specific routes (original)
router.get('/accounts/:accountId/scores', analyticsController.getDeveloperScores);
router.post('/accounts/:accountId/scores/recalculate', analyticsController.recalculateScores);
router.get('/accounts/:accountId/heatmap', analyticsController.getHeatmap);
router.get('/accounts/:accountId/languages', analyticsController.getLanguageStats);
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
