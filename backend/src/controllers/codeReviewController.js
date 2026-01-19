import * as codeReviewService from '../services/codeReviewService.js';
import { asyncHandler } from '../utils/errors.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Analyze a commit
 * POST /api/code-review/analyze
 */
export const analyzeCommit = asyncHandler(async (req, res) => {
    const { commitSha, repositoryName, githubAccountId } = req.body;
    const userId = req.user.id;

    // Analyze commit
    const review = await codeReviewService.analyzeCommit(
        userId,
        githubAccountId || req.user.github_account_id,
        commitSha,
        repositoryName
    );

    // Increment usage quota
    await incrementFeatureUsage(userId, 'code_review');

    res.status(201).json({
        success: true,
        data: review
    });
});

/**
 * Get review history
 * GET /api/code-review/history
 */
export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { limit, offset, sort } = req.query;

    const result = await codeReviewService.getReviewHistory(userId, {
        limit: parseInt(limit) || 20,
        offset: parseInt(offset) || 0,
        sort: sort || 'date'
    });

    res.json({
        success: true,
        data: result.reviews,
        pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            hasMore: result.offset + result.limit < result.total
        }
    });
});

/**
 * Get single review by commit SHA
 * GET /api/code-review/:commitSha
 */
export const getReview = asyncHandler(async (req, res) => {
    const { commitSha } = req.params;
    const userId = req.user.id;

    const review = await codeReviewService.getReviewByCommitSha(userId, commitSha);

    if (!review) {
        throw new NotFoundError('Review not found');
    }

    res.json({
        success: true,
        data: review
    });
});

/**
 * Delete review
 * DELETE /api/code-review/:id
 */
export const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await codeReviewService.deleteReview(userId, id);

    res.json({
        success: true,
        message: 'Review deleted successfully'
    });
});

// Helper function to increment usage
async function incrementFeatureUsage(userId, feature) {
    const supabaseAdmin = (await import('../config/database.js')).default;
    await supabaseAdmin.rpc('increment_feature_usage', {
        p_user_id: userId,
        p_feature: feature
    });
}
