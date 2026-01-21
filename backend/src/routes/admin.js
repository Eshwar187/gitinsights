import express from 'express';
import jwt from 'jsonwebtoken';
import supabaseAdmin from '../config/database.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

// Hardcoded admin credentials (in production, use hashed passwords in DB)
const ADMIN_USERNAME = 'eshwar187';
const ADMIN_PASSWORD = 'Eshwar@2005';
const ADMIN_SECRET = process.env.JWT_SECRET || 'admin-secret-key';

/**
 * Admin login
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign(
            { isAdmin: true, username },
            ADMIN_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            token,
            message: 'Admin authenticated successfully'
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
    });
}));

/**
 * Middleware to verify admin token
 */
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, ADMIN_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

/**
 * Get admin stats and user list
 */
router.get('/stats', verifyAdmin, asyncHandler(async (req, res) => {
    // Get all users
    const { data: users, error } = await supabaseAdmin
        .from('accounts')
        .select('id, name, email, github_username, subscription_tier, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error('Failed to fetch users');
    }

    // Calculate stats
    const totalUsers = users?.length || 0;
    const proUsers = users?.filter(u => u.subscription_tier === 'pro').length || 0;
    const premiumUsers = users?.filter(u => u.subscription_tier === 'premium').length || 0;
    const totalRevenue = (proUsers * 199) + (premiumUsers * 499);

    res.json({
        success: true,
        stats: {
            totalUsers,
            proUsers,
            premiumUsers,
            totalRevenue,
            activeToday: 0
        },
        users: users || []
    });
}));

/**
 * Update user subscription
 */
router.post('/update-subscription', verifyAdmin, asyncHandler(async (req, res) => {
    const { userId, tier } = req.body;

    const { error } = await supabaseAdmin
        .from('accounts')
        .update({ subscription_tier: tier })
        .eq('id', userId);

    if (error) {
        throw new Error('Failed to update subscription');
    }

    res.json({
        success: true,
        message: `Subscription updated to ${tier}`
    });
}));

/**
 * Delete user
 */
router.delete('/delete-user/:userId', verifyAdmin, asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Delete related data first
    await supabaseAdmin.from('repositories').delete().eq('github_account_id', userId);
    await supabaseAdmin.from('analytics').delete().eq('github_account_id', userId);
    await supabaseAdmin.from('contributions').delete().eq('github_account_id', userId);
    await supabaseAdmin.from('github_accounts').delete().eq('user_id', userId);

    // Delete user account
    const { error } = await supabaseAdmin
        .from('accounts')
        .delete()
        .eq('id', userId);

    if (error) {
        throw new Error('Failed to delete user');
    }

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
}));

export default router;
