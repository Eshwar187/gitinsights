import express from 'express';
import * as codeReviewController from '../controllers/codeReviewController.js';
import { authenticate } from '../middleware/auth.js';
import { checkQuota } from '../middleware/quota.js';
import { body, query, param } from 'express-validator';
import { validate } from '../utils/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const analyzeValidation = [
    body('commitSha').notEmpty().isString().withMessage('Commit SHA is required'),
    body('repositoryName').notEmpty().isString().withMessage('Repository name is required'),
    body('githubAccountId').optional().isUUID().withMessage('Invalid GitHub account ID'),
    validate
];

const historyValidation = [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    query('sort').optional().isIn(['date', 'score']).withMessage('Sort must be date or score'),
    validate
];

const commitShaValidation = [
    param('commitSha').notEmpty().isString().withMessage('Commit SHA is required'),
    validate
];

const idValidation = [
    param('id').isUUID().withMessage('Invalid review ID'),
    validate
];

// Routes
router.post(
    '/analyze',
    checkQuota('code_review'),
    analyzeValidation,
    codeReviewController.analyzeCommit
);

router.get(
    '/history',
    historyValidation,
    codeReviewController.getHistory
);

router.get(
    '/:commitSha',
    commitShaValidation,
    codeReviewController.getReview
);

router.delete(
    '/:id',
    idValidation,
    codeReviewController.deleteReview
);

export default router;
