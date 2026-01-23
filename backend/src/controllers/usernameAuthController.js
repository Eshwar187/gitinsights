import supabaseAdmin from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Login by GitHub username (for returning users)
 * POST /api/auth/login-by-username
 */
export const loginByUsername = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            error: 'GitHub username is required'
        });
    }

    logger.info(`Login attempt for username: ${username}`);

    try {
        // First, find the user directly by github_username in users table
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .ilike('github_username', username)
            .single();

        logger.info(`User lookup result: found=${!!user}, error=${userError?.message || 'none'}`);

        if (userError || !user) {
            // Try searching in github_accounts as fallback
            const { data: githubAccount, error: ghError } = await supabaseAdmin
                .from('github_accounts')
                .select('user_id, username, avatar_url')
                .ilike('username', username)
                .single();

            logger.info(`GitHub account lookup: found=${!!githubAccount}, error=${ghError?.message || 'none'}`);

            if (ghError || !githubAccount) {
                return res.status(404).json({
                    success: false,
                    error: 'Username not found. Please connect with GitHub first.'
                });
            }

            // Get user by ID from github_accounts
            const { data: userById } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', githubAccount.user_id)
                .single();

            if (!userById) {
                return res.status(404).json({
                    success: false,
                    error: 'User account not found'
                });
            }

            // Generate token and return
            const token = generateToken(userById.id);

            return res.json({
                success: true,
                token,
                user: {
                    id: userById.id,
                    name: userById.name,
                    email: userById.email,
                    github_username: githubAccount.username,
                    avatar_url: githubAccount.avatar_url || userById.avatar_url,
                    subscription_tier: userById.subscription_tier || 'free'
                }
            });
        }

        // User found directly - generate token
        const token = generateToken(user.id);

        logger.info(`User logged in by username: ${username}`);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                github_username: user.github_username,
                avatar_url: user.avatar_url,
                subscription_tier: user.subscription_tier || 'free'
            }
        });
    } catch (error) {
        logger.error('Login by username failed:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});
