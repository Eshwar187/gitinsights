import { nanoid } from 'nanoid';
import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Generate unique room code
 */
function generateRoomCode() {
    return `CODE-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
}

/**
 * Create collaboration room
 */
export const createRoom = async (userId, roomData) => {
    const { roomName, roomType, isPublic, maxParticipants, password } = roomData;

    try {
        const roomCode = generateRoomCode();

        const { data: room, error } = await supabaseAdmin
            .from('collaboration_rooms')
            .insert({
                room_code: roomCode,
                room_name: roomName,
                created_by: userId,
                room_type: roomType || 'pair_programming',
                is_public: isPublic !== false,
                max_participants: maxParticipants || 10,
                password_hash: password ? await hashPassword(password) : null,
                room_status: 'active'
            })
            .select()
            .single();

        if (error) throw error;

        // Add creator as host
        await supabaseAdmin
            .from('room_participants')
            .insert({
                room_id: room.id,
                user_id: userId,
                display_name: 'Host',
                role: 'host',
                cursor_color: '#FF5733',
                is_active: true
            });

        return {
            roomId: room.id,
            roomCode: room.room_code,
            joinUrl: `${process.env.FRONTEND_URL}/collab/${room.room_code}`
        };
    } catch (error) {
        logger.error('Failed to create room:', error);
        throw error;
    }
};

/**
 * Join room
 */
export const joinRoom = async (userId, roomData) => {
    const { roomCode, displayName } = roomData;

    try {
        // Get room
        const { data: room } = await supabaseAdmin
            .from('collaboration_rooms')
            .select('*')
            .eq('room_code', roomCode)
            .eq('room_status', 'active')
            .single();

        if (!room) {
            throw new Error('Room not found');
        }

        // Check if room is full
        const { count } = await supabaseAdmin
            .from('room_participants')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id)
            .eq('is_active', true);

        if (count >= room.max_participants) {
            throw new Error('Room is full');
        }

        // Add participant
        const cursorColors = ['#3498DB', '#9B59B6', '#E74C3C', '#2ECC71', '#F39C12'];
        const colorIndex = count % cursorColors.length;

        await supabaseAdmin
            .from('room_participants')
            .insert({
                room_id: room.id,
                user_id: userId,
                display_name: displayName || 'Anonymous',
                role: 'participant',
                cursor_color: cursorColors[colorIndex],
                is_active: true
            });

        // Get all participants
        const { data: participants } = await supabaseAdmin
            .from('room_participants')
            .select('*')
            .eq('room_id', room.id)
            .eq('is_active', true);

        // Get documents
        const { data: documents } = await supabaseAdmin
            .from('collaborative_documents')
            .select('*')
            .eq('room_id', room.id);

        return {
            roomId: room.id,
            roomName: room.room_name,
            participants: participants || [],
            documents: documents || [],
            yourCursorColor: cursorColors[colorIndex]
        };
    } catch (error) {
        logger.error('Failed to join room:', error);
        throw error;
    }
};

/**
 * Create document in room
 */
export const createDocument = async (roomId, userId, documentData) => {
    const { documentName, language } = documentData;

    const { data, error } = await supabaseAdmin
        .from('collaborative_documents')
        .insert({
            room_id: roomId,
            document_name: documentName,
            language,
            content: '',
            last_edited_by: userId
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update document content
 */
export const updateDocument = async (documentId, userId, change) => {
    // Log the change
    await supabaseAdmin
        .from('code_changes_log')
        .insert({
            document_id: documentId,
            user_id: userId,
            change_type: change.type,
            start_position: change.position,
            new_content: change.content,
            timestamp: new Date().toISOString()
        });

    // Update document
    const { data } = await supabaseAdmin
        .from('collaborative_documents')
        .update({
            content: change.fullContent,
            last_edited_by: userId,
            version: supabaseAdmin.sql`version + 1`
        })
        .eq('id', documentId)
        .select()
        .single();

    return data;
};

async function hashPassword(password) {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(password, 10);
}
