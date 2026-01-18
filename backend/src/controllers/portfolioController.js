import * as portfolioService from '../services/portfolioService.js';
import supabaseAdmin from '../config/database.js';
import { asyncHandler } from '../utils/errors.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Create portfolio
 */
export const create = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const portfolio = await portfolioService.createPortfolio(userId, req.body);

    res.status(201).json({
        success: true,
        data: portfolio
    });
});

/**
 * Get portfolio by slug (public)
 */
export const getBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const { data: portfolio, error } = await supabaseAdmin
        .from('portfolios')
        .select('*, user:users(name, avatar_url, bio, github_username, location, website)')
        .eq('slug', slug)
        .eq('is_public', true)
        .is('deleted_at', null)
        .single();

    if (error || !portfolio) {
        throw new NotFoundError('Portfolio not found');
    }

    // Track view
    await portfolioService.trackView(slug);

    res.json({
        success: true,
        data: portfolio
    });
});

/**
 * Get user's portfolios
 */
export const getByUser = asyncHandler(async (req, res) => {
    const { data: portfolios, error } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('user_id', req.user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error('Failed to fetch portfolios');
    }

    res.json({
        success: true,
        data: portfolios || []
    });
});

/**
 * Update portfolio
 */
export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const portfolio = await portfolioService.updatePortfolio(id, userId, req.body);

    res.json({
        success: true,
        data: portfolio
    });
});

/**
 * Delete portfolio
 */
export const deletePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { error } = await supabaseAdmin
        .from('portfolios')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', req.user.id);

    if (error) {
        throw new Error('Failed to delete portfolio');
    }

    res.json({
        success: true,
        message: 'Portfolio deleted successfully'
    });
});

/**
 * Toggle visibility
 */
export const toggleVisibility = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isPublic } = req.body;

    const { data: portfolio, error } = await supabaseAdmin
        .from('portfolios')
        .update({ is_public: isPublic })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

    if (error) {
        throw new Error('Failed to update visibility');
    }

    res.json({
        success: true,
        data: portfolio
    });
});
