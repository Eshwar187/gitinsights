import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

let socket: Socket | null = null;

/**
 * Initialize WebSocket connection
 */
export const initializeSocket = (token: string): Socket => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(WS_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
        console.log('✅ WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
    });

    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    return socket;
};

/**
 * Get socket instance
 */
export const getSocket = (): Socket | null => {
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Join collaboration room
 */
export const joinCollabRoom = (roomCode: string) => {
    if (!socket) throw new Error('Socket not initialized');
    socket.emit('join_room', { roomCode });
};

/**
 * Send code change
 */
export const sendCodeChange = (documentId: string, change: any) => {
    if (!socket) throw new Error('Socket not initialized');
    socket.emit('code_change', { documentId, change });
};

/**
 * Send cursor position
 */
export const sendCursorMove = (documentId: string, line: number, column: number) => {
    if (!socket) throw new Error('Socket not initialized');
    socket.emit('cursor_move', { documentId, line, column });
};

/**
 * Send chat message
 */
export const sendChatMessage = (content: string) => {
    if (!socket) throw new Error('Socket not initialized');
    socket.emit('chat_message', { content });
};

/**
 * Listen to room events
 */
export const onRoomJoined = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('room_joined', callback);
};

export const onUserJoined = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('user_joined', callback);
};

export const onUserLeft = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('user_left', callback);
};

export const onCodeChange = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('code_change', callback);
};

export const onCursorMove = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('cursor_move', callback);
};

export const onChatMessage = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('chat_message', callback);
};
