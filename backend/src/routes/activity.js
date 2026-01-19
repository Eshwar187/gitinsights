import express from 'express';
import * as activityController from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';
import { body, query } from 'express-validator';
import { validate } from '../utils/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation
const recordValidation = [
    body('date').isDate().withMessage('Valid date required'),
    body('hour').isInt({ min: 0, max: 23 }).withMessage('Hour must be between 0 and 23'),
    body('minutes').isInt({ min: 0, max: 60 }).withMessage('Minutes must be between 0 and 60'),
    body('language').notEmpty().isString().withMessage('Language is required'),
    body('repository').optional().isString(),
    validate
];

// Routes
router.post('/record', recordValidation, activityController.recordActivity);
router.get('/heatmap', activityController.getHeatmap);
router.get('/weekly', activityController.getWeeklySummary);
router.get('/languages', activityController.getLanguageBreakdown);

export default router;
