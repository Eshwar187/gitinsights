/**
 * TEST ENDPOINT - Debug GitHub Token
 * 
 * This creates a simple test route to verify GitHub API works with a manual token
 * 
 * Usage:
 * 1. Go to https://github.com/settings/tokens
 * 2. Generate a new token with 'repo' and 'user' scopes
 * 3. POST to /api/github/test-token with { "testToken": "your_token_here" }
 * 4. Check if it returns your GitHub profile
 * 
 * This will tell us if the issue is with token storage or GitHub API setup
 */

import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/test-token', async (req, res) => {
    const { testToken } = req.body;

    if (!testToken) {
        return res.status(400).json({ error: 'testToken required' });
    }

    try {
        // Test GitHub API with the provided token
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${testToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        res.json({
            success: true,
            message: 'Token works!',
            user: {
                login: response.data.login,
                name: response.data.name,
                public_repos: response.data.public_repos
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

export default router;
