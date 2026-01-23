import supabaseAdmin from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
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

    try {
        // Find user by GitHub username (case-insensitive)
        const { data: githubAccount, error } = await supabaseAdmin
            .from('github_accounts')
            .select('*, user:users!github_accounts_user_id_fkey(*)')
            .ilike('username', username)
            .single();

        console.log('Login by username lookup:', { username, found: !!githubAccount, error });

        if (!githubAccount) {
            throw new NotFoundError('User not found. Please connect with GitHub first.');
        }

        const user = githubAccount.user;

        if (!user) {
            throw new NotFoundError('User account not found');
        }

        // Get user's active subscription
        const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*, plan:subscription_plans(*)')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        // Generate JWT token
        const token = generateToken(user.id);

        logger.info(`User logged in by username: ${username}`);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    github_username: username,
                    avatar_url: githubAccount.avatar_url,
                    subscription_tier: subscription?.plan?.name || 'free'
                },
                token
            }
        });
    } catch (error) {
        logger.error('Login by username failed:', error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});
