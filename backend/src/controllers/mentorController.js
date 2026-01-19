import * as mentorService from '../services/mentorService.js';
import { asyncHandler } from '../utils/errors.js';

export const startSession = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.startSession(userId, req.body);

    res.status(201).json({ success: true, data: result });
});

export const chat = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.chatWithMentor(userId, req.body);

    res.json({ success: true, data: result });
});

export const generateChallenge = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.generateChallenge(userId, req.body);

    res.status(201).json({ success: true, data: result });
});

export const submitSolution = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.submitSolution(userId, req.body);

    res.json({ success: true, data: result });
});

export const explainCode = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.explainCode(userId, req.body);

    res.json({ success: true, data: result });
});

export const debugHelp = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await mentorService.debugHelp(userId, req.body);

    res.json({ success: true, data: result });
});
