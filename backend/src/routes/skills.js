import express from 'express';
import * as skillsController from '../controllers/skillsController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../utils/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation
const initValidation = [
    body('githubAccountId').isUUID().withMessage('Invalid GitHub account ID'),
    validate
];

const jobPathValidation = [
    body('jobTitle').notEmpty().isString().withMessage('Job title is required'),
    validate
];

// Routes
router.post('/initialize', initValidation, skillsController.initializeSkills);
router.get('/tree', skillsController.getSkillTree);
router.post('/sync', initValidation, skillsController.syncSkills);
router.post('/path-to-job', jobPathValidation, skillsController.getJobPath);

export default router;
