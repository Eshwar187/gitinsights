import express from 'express';
import * as githubController from '../controllers/githubController.js';
import { authenticate } from '../middleware/auth.js';
import { checkFeatureAccess } from '../middleware/subscription.js';
import { syncDataValidation, uuidValidation, paginationValidation } from '../utils/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GitHub account management
router.get('/accounts', githubController.getAccounts);
router.post('/connect', checkFeatureAccess('github_account'), githubController.connectAccount);
router.post('/sync', syncDataValidation, githubController.syncData);
router.delete('/accounts/:id', uuidValidation, githubController.disconnectAccount);

// Repository data
router.get('/accounts/:accountId/repositories', paginationValidation, githubController.getRepositories);

// Contribution data
router.get('/accounts/:accountId/contributions', githubController.getContributions);

// Rate limit status
router.get('/accounts/:accountId/rate-limit', githubController.getRateLimit);

export default router;
