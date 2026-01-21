import bcrypt from 'bcrypt';
import supabaseAdmin from '../config/database.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { ValidationError, AuthenticationError, ConflictError } from '../utils/errors.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

/**
 * User signup with email and password
 */
export const signup = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .insert({
            email,
            password_hash: passwordHash,
            name,
            email_verification_token: crypto.randomBytes(32).toString('hex')
        })
        .select()
        .single();

    if (error) {
        throw new Error('Failed to create user');
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Send verification email (optional)
    // await sendVerificationEmail(user.email, user.email_verification_token);

    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                subscription_tier: user.subscription_tier
            },
            token,
            refreshToken
        }
    });
});

/**
 * User login with email and password
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .is('deleted_at', null)
        .single();

    if (error || !user) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Check if user has password (might be OAuth-only)
    if (!user.password_hash) {
        throw new AuthenticationError('Please login with GitHub');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await supabaseAdmin
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id);

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar_url: user.avatar_url,
                subscription_tier: user.subscription_tier,
                subscription_status: user.subscription_status
            },
            token,
            refreshToken
        }
    });
});

/**
 * GitHub OAuth callback handler
 */
export const githubCallback = asyncHandler(async (req, res) => {
    const { user, accessToken, profile } = req.user;

    // Debug logging
    logger.info('GitHub OAuth Callback:', {
        userId: user.id,
        username: profile.username,
        hasAccessToken: !!accessToken,
        tokenLength: accessToken ? accessToken.length : 0
    });

    // Import encryption utilities
    const { encrypt } = await import('../utils/encryption.js');

    // Check if GitHub account already exists for this user
    const { data: existingAccount } = await supabaseAdmin
        .from('github_accounts')
        .select('id')
        .eq('user_id', user.id)
        .single();

    let githubAccount;
    let error;

    if (existingAccount) {
        // Check if we need to get full account info to compare github_id
        const { data: fullExistingAccount } = await supabaseAdmin
            .from('github_accounts')
            .select('id, github_id')
            .eq('user_id', user.id)
            .single();

        // If switching to a DIFFERENT GitHub account, clear old data
        if (fullExistingAccount && fullExistingAccount.github_id !== profile.id.toString()) {
            logger.info(`Switching GitHub account from ${fullExistingAccount.github_id} to ${profile.id} - clearing old data`);

            // Delete old repositories
            await supabaseAdmin
                .from('repositories')
                .delete()
                .eq('github_account_id', fullExistingAccount.id);

            // Delete old analytics
            await supabaseAdmin
                .from('analytics')
                .delete()
                .eq('github_account_id', fullExistingAccount.id);

            // Delete old contributions
            await supabaseAdmin
                .from('contributions')
                .delete()
                .eq('github_account_id', fullExistingAccount.id);

            logger.info('Old data cleared successfully');
        }

        // Update existing account
        logger.info(`Updating existing GitHub account for user ${user.id}`);
        const result = await supabaseAdmin
            .from('github_accounts')
            .update({
                github_id: profile.id.toString(),
                username: profile.username,
                access_token: encrypt(accessToken),
                profile_data: profile,
                sync_status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single();

        githubAccount = result.data;
        error = result.error;
    } else {
        // Insert new account
        logger.info(`Creating new GitHub account for user ${user.id}`);
        const result = await supabaseAdmin
            .from('github_accounts')
            .insert({
                user_id: user.id,
                github_id: profile.id.toString(),
                username: profile.username,
                access_token: encrypt(accessToken),
                profile_data: profile,
                sync_status: 'pending'
            })
            .select()
            .single();

        githubAccount = result.data;
        error = result.error;
    }

    if (error) {
        console.error('Failed to store GitHub account:', error);
        logger.error('GitHub account storage error:', error);
        // Redirect with error
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/auth/login?error=github_connection_failed`);
    }

    logger.info(`GitHub account stored successfully: ${githubAccount.id}`);

    // Generate JWT tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&refresh=${refreshToken}`);
});

/**
 * Refresh access token
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newToken = generateToken(decoded.userId);

    res.json({
        success: true,
        data: {
            token: newToken
        }
    });
});

/**
 * Request password reset
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, email, name')
        .eq('email', email)
        .is('deleted_at', null)
        .single();

    // Always return success (don't reveal if email exists)
    if (!user) {
        return res.json({
            success: true,
            message: 'If the email exists, a password reset link has been sent'
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token
    await supabaseAdmin
        .from('users')
        .update({
            password_reset_token: resetToken,
            password_reset_expires: resetExpires.toISOString()
        })
        .eq('id', user.id);

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Request - GitInsights',
            html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
        });
    } catch (error) {
        console.error('Failed to send reset email:', error);
    }

    res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
    });
});

/**
 * Reset password with token
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Find user with valid reset token
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('password_reset_token', token)
        .gt('password_reset_expires', new Date().toISOString())
        .is('deleted_at', null)
        .single();

    if (error || !user) {
        throw new ValidationError('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await supabaseAdmin
        .from('users')
        .update({
            password_hash: passwordHash,
            password_reset_token: null,
            password_reset_expires: null
        })
        .eq('id', user.id);

    res.json({
        success: true,
        message: 'Password has been reset successfully'
    });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, bio, avatar_url, github_username, location, website, twitter_handle, linkedin_url, subscription_tier, subscription_status, created_at')
        .eq('id', req.user.id)
        .single();

    if (error) {
        throw new Error('Failed to fetch user profile');
    }

    res.json({
        success: true,
        user: user  // Changed from 'data' to 'user' for frontend compatibility
    });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = ['name', 'bio', 'avatar_url', 'location', 'website', 'twitter_handle', 'linkedin_url'];
    const updates = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const { data: user, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', req.user.id)
        .select()
        .single();

    if (error) {
        throw new Error('Failed to update profile');
    }

    res.json({
        success: true,
        data: user
    });
});
