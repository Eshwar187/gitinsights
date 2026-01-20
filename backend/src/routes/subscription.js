import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { subscribeValidation } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/plans', subscriptionController.getPlans);
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.webhook);

// Protected routes
router.use(authenticate);

router.post('/subscribe', subscribeValidation, subscriptionController.subscribe);
router.post('/verify', subscriptionController.verifyPayment);
router.post('/upgrade', subscriptionController.upgradeSubscription);
router.post('/cancel', subscriptionController.cancel);
router.get('/current', subscriptionController.getCurrentSubscription);
router.get('/usage', subscriptionController.getUsage);

export default router;
