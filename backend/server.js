import app from './src/app.js';
import { createServer } from 'http';
import initializeJobs from './src/jobs/index.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Start server
httpServer.listen(PORT, () => {
    logger.info(`🚀 GitInsights API server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 API URL: http://localhost:${PORT}`);

    // Initialize background jobs
    if (process.env.NODE_ENV !== 'test') {
        initializeJobs();
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    httpServer.close(() => {
        process.exit(1);
    });
});

export default httpServer;
