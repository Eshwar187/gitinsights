import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Auth validation rules
 */
export const signupValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    validate
];

export const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

export const passwordResetValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    validate
];

export const passwordUpdateValidation = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    validate
];

/**
 * Portfolio validation rules
 */
export const createPortfolioValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug')
        .optional()
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('theme')
        .optional()
        .isIn(['default', 'dark', 'minimal', 'colorful'])
        .withMessage('Invalid theme'),
    validate
];

export const updatePortfolioValidation = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('tagline').optional().trim(),
    body('about').optional().trim(),
    body('theme')
        .optional()
        .isIn(['default', 'dark', 'minimal', 'colorful'])
        .withMessage('Invalid theme'),
    validate
];

/**
 * GitHub validation rules
 */
export const syncDataValidation = [
    body('accountId').optional().isUUID().withMessage('Invalid account ID'),
    validate
];

/**
 * Subscription validation rules
 */
export const subscribeValidation = [
    body('planId').isUUID().withMessage('Valid plan ID is required'),
    body('billingCycle')
        .isIn(['monthly', 'yearly'])
        .withMessage('Billing cycle must be monthly or yearly'),
    validate
];

/**
 * Common validation rules
 */
export const uuidValidation = [
    param('id').isUUID().withMessage('Invalid ID format'),
    validate
];

export const paginationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate
];
