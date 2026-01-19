import api from '../lib/api';

/**
 * Create collaboration room
 */
export const createRoom = async (roomData: {
    roomName: string;
    roomType?: string;
    isPublic?: boolean;
    maxParticipants?: number;
    password?: string;
}) => {
    const response = await api.post('/api/collab/room/create', roomData);
    return response.data;
};

/**
 * Join room
 */
export const joinRoom = async (roomData: {
    roomCode: string;
    displayName?: string;
}) => {
    const response = await api.post('/api/collab/room/join', roomData);
    return response.data;
};
