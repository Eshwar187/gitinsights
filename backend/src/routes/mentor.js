import express from 'express';
import * as mentorController from '../controllers/mentorController.js';
import { authenticate } from '../middleware/auth.js';
import { checkQuota, trackUsage } from '../middleware/quota.js';

const router = express.Router();

router.use(authenticate);

router.post('/session/start', mentorController.startSession);
router.post('/chat', checkQuota('ai_mentor'), trackUsage('ai_mentor'), mentorController.chat);
router.post('/challenge/generate', checkQuota('coding_challenge'), mentorController.generateChallenge);
router.post('/challenge/submit', mentorController.submitSolution);
router.post('/explain', checkQuota('ai_mentor'), mentorController.explainCode);
router.post('/debug', checkQuota('ai_mentor'), mentorController.debugHelp);

export default router;
