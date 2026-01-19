import * as skillsService from '../services/skillsService.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Initialize user skills
 * POST /api/skills/initialize
 */
export const initializeSkills = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { githubAccountId } = req.body;

    const result = await skillsService.initializeUserSkills(userId, githubAccountId);

    res.status(201).json({
        success: true,
        data: result
    });
});

/**
 * Get skill tree
 * GET /api/skills/tree
 */
export const getSkillTree = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const tree = await skillsService.getSkillTree(userId);

    res.json({
        success: true,
        data: tree
    });
});

/**
 * Update skill progress
 * POST /api/skills/sync
 */
export const syncSkills = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { githubAccountId } = req.body;

    const result = await skillsService.updateSkillProgress(userId, githubAccountId);

    res.json({
        success: true,
        data: result
    });
});

/**
 * Generate job learning path
 * POST /api/skills/path-to-job
 */
export const getJobPath = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { jobTitle } = req.body;

    const path = await skillsService.generateJobPath(userId, jobTitle);

    res.json({
        success: true,
        data: path
    });
});
