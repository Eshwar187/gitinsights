import { Server } from 'socket.io';
import * as collabService from '../services/collabService.js';
import logger from '../utils/logger.js';


/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const user = await verifyToken(token);
            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        logger.info(`User ${socket.user.id} connected to WebSocket`);

        // Join room
        socket.on('join_room', async ({ roomCode }) => {
            try {
                const roomData = await collabService.joinRoom(socket.user.id, {
                    roomCode,
                    displayName: socket.user.name
                });

                socket.join(roomCode);
                socket.roomCode = roomCode;

                // Notify others
                socket.to(roomCode).emit('user_joined', {
                    userId: socket.user.id,
                    displayName: socket.user.name,
                    cursorColor: roomData.yourCursorColor
                });

                socket.emit('room_joined', roomData);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Code change
        socket.on('code_change', async ({ documentId, change }) => {
            try {
                await collabService.updateDocument(documentId, socket.user.id, change);

                socket.to(socket.roomCode).emit('code_change', {
                    documentId,
                    change,
                    userId: socket.user.id
                });
            } catch (error) {
                logger.error('Code change error:', error);
            }
        });

        // Cursor move
        socket.on('cursor_move', ({ documentId, line, column }) => {
            socket.to(socket.roomCode).emit('cursor_move', {
                documentId,
                line,
                column,
                userId: socket.user.id,
                displayName: socket.user.name
            });
        });

        // Chat message
        socket.on('chat_message', async ({ content }) => {
            io.to(socket.roomCode).emit('chat_message', {
                userId: socket.user.id,
                displayName: socket.user.name,
                content,
                timestamp: new Date().toISOString()
            });
        });

        // Disconnection
        socket.on('disconnect', () => {
            if (socket.roomCode) {
                socket.to(socket.roomCode).emit('user_left', {
                    userId: socket.user.id,
                    displayName: socket.user.name
                });
            }
            logger.info(`User ${socket.user.id} disconnected`);
        });
    });

    return io;
}

async function verifyToken(token) {
    const jwt = await import('jsonwebtoken');
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
}
