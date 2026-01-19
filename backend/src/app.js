import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import { testConnection } from './config/database.js';
import { errorHandler } from './utils/errors.js';
import { rateLimiter } from './middleware/auth.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';
import analyticsRoutes from './routes/analytics.js';
import portfolioRoutes from './routes/portfolio.js';
import subscriptionRoutes from './routes/subscription.js';
import codeReviewRoutes from './routes/codeReview.js';
import activityRoutes from './routes/activity.js';
import skillsRoutes from './routes/skills.js';
import mentorRoutes from './routes/mentor.js';
import collabRoutes from './routes/collab.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'GitInsights API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/code-review', codeReviewRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/collab', collabRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Test database connection on startup
testConnection().then(connected => {
    if (!connected) {
        logger.error('Failed to connect to database. Please check your configuration.');
    }
});

export default app;
