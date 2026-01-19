import * as collabService from '../services/collabService.js';
import { asyncHandler } from '../utils/errors.js';

export const createRoom = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await collabService.createRoom(userId, req.body);

    res.status(201).json({ success: true, data: result });
});

export const joinRoom = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await collabService.joinRoom(userId, req.body);

    res.json({ success: true, data: result });
});
