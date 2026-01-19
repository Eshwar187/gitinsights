import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';
import * as usernameAuthController from '../controllers/usernameAuthController.js';
import { authenticate, authRateLimiter } from '../middleware/auth.js';
import {
    signupValidation,
    loginValidation,
    passwordResetValidation,
    passwordUpdateValidation
} from '../utils/validators.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', authRateLimiter, signupValidation, authController.signup);
router.post('/login', authRateLimiter, loginValidation, authController.login);
router.post('/login-by-username', authRateLimiter, usernameAuthController.loginByUsername); // NEW
router.post('/refresh', authController.refreshAccessToken);
router.post('/forgot-password', authRateLimiter, passwordResetValidation, authController.requestPasswordReset);
router.post('/reset-password', authRateLimiter, passwordUpdateValidation, authController.resetPassword);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'repo', 'read:user'] }));
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    authController.githubCallback
);

// Protected routes
router.get('/me', authenticate, authController.getProfile); // Alias for /profile
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

export default router;
