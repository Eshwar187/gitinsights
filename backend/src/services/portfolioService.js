import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';
import { ConflictError } from '../utils/errors.js';

/**
 * Generate unique slug
 */
export const generateSlug = async (baseSlug, userId) => {
    let slug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
        const { data } = await supabaseAdmin
            .from('portfolios')
            .select('id')
            .eq('slug', uniqueSlug)
            .neq('user_id', userId)
            .single();

        if (!data) break;

        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
};

/**
 * Create portfolio
 */
export const createPortfolio = async (userId, portfolioData) => {
    try {
        const slug = await generateSlug(portfolioData.slug || portfolioData.title, userId);

        const { data: portfolio, error } = await supabaseAdmin
            .from('portfolios')
            .insert({
                user_id: userId,
                slug,
                title: portfolioData.title,
                tagline: portfolioData.tagline,
                about: portfolioData.about,
                theme: portfolioData.theme || 'default',
                display_settings: portfolioData.display_settings,
                is_public: portfolioData.is_public !== false,
                published_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        logger.info(`Portfolio created: ${slug}`);
        return portfolio;
    } catch (error) {
        logger.error('Failed to create portfolio:', error);
        throw error;
    }
};

/**
 * Update portfolio
 */
export const updatePortfolio = async (portfolioId, userId, updates) => {
    try {
        const { data: portfolio, error } = await supabaseAdmin
            .from('portfolios')
            .update(updates)
            .eq('id', portfolioId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return portfolio;
    } catch (error) {
        logger.error('Failed to update portfolio:', error);
        throw error;
    }
};

/**
 * Track portfolio view
 */
export const trackView = async (slug) => {
    try {
        await supabaseAdmin.rpc('increment_portfolio_views', { p_slug: slug });
    } catch (error) {
        logger.error('Failed to track portfolio view:', error);
    }
};

/**
 * Generate SEO metadata
 */
export const generateSEOMetadata = (portfolio, user) => {
    const metaTitle = portfolio.meta_title || `${user.name} - Developer Portfolio`;
    const metaDescription = portfolio.meta_description ||
        `Check out ${user.name}'s developer portfolio featuring projects, skills, and contributions.`;

    return {
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_image: portfolio.meta_image || user.avatar_url
    };
};
