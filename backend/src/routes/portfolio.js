import express from 'express';
import * as portfolioController from '../controllers/portfolioController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { createPortfolioValidation, updatePortfolioValidation, uuidValidation } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/:slug', optionalAuth, portfolioController.getBySlug);

// Protected routes
router.use(authenticate);

router.post('/', createPortfolioValidation, portfolioController.create);
router.get('/user/me', portfolioController.getByUser);
router.put('/:id', uuidValidation, updatePortfolioValidation, portfolioController.update);
router.delete('/:id', uuidValidation, portfolioController.deletePortfolio);
router.patch('/:id/visibility', uuidValidation, portfolioController.toggleVisibility);

export default router;
