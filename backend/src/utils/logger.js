import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';
const isSilent = process.env.LOG_SILENT === 'true';

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logs directory if it doesn't exist
if (!existsSync('logs')) {
    mkdirSync('logs');
}

// Define transports
const transports = [
    // Error log file (always enabled)
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),
    // Combined log file (always enabled)
    new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
    })
];

// Only add console transport in development AND if not silent
if (!isProduction && !isSilent) {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        })
    );
}

// Create logger instance
const logger = winston.createLogger({
    // In production or silent mode, only log errors. In dev, log info and above.
    level: (isProduction || isSilent) ? 'error' : (process.env.LOG_LEVEL || 'info'),
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports,
    // Complete silence if LOG_SILENT is true
    silent: isSilent
});

export default logger;
