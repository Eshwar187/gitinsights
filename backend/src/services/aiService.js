import axios from 'axios';
import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';
import { ExternalServiceError } from '../utils/errors.js';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Call Hugging Face API
 */
const callHuggingFace = async (model, inputs) => {
    try {
        const response = await axios.post(
            `${HUGGINGFACE_API_URL}/${model}`,
            { inputs },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data;
    } catch (error) {
        logger.error('Hugging Face API error:', error.response?.data || error.message);
        throw new ExternalServiceError('Failed to generate AI insights');
    }
};

/**
 * Generate developer profile summary
 */
export const generateProfileSummary = async (githubAccountId) => {
    try {
        // Get user data
        const { data: account } = await supabaseAdmin
            .from('github_accounts')
            .select('*, analytics(*), repositories(count)')
            .eq('id', githubAccountId)
            .single();

        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('language, stars_count, name')
            .eq('github_account_id', githubAccountId)
            .order('stars_count', { ascending: false })
            .limit(5);

        const analytics = account.analytics[0];
        const topLanguages = analytics?.top_languages || [];
        const topRepos = repos?.map(r => r.name).join(', ') || 'various projects';

        // Create prompt for AI
        const prompt = `Generate a professional 3-4 sentence developer profile summary for ${account.username}.
    
    Stats:
    - Overall Score: ${analytics?.overall_score || 0}/100
    - Top Languages: ${topLanguages.join(', ')}
    - Total Repositories: ${repos?.length || 0}
    - Top Projects: ${topRepos}
    - Activity Score: ${analytics?.activity_score || 0}/100
    - Quality Score: ${analytics?.quality_score || 0}/100
    
    Write a compelling, professional summary highlighting their strengths and expertise.`;

        // Use a text generation model
        const result = await callHuggingFace('facebook/bart-large-cnn', prompt);

        const summary = result[0]?.summary_text || result[0]?.generated_text ||
            `${account.username} is a developer with expertise in ${topLanguages.slice(0, 3).join(', ')}. ` +
            `They maintain ${repos?.length || 0} repositories and have demonstrated strong technical skills.`;

        return summary;
    } catch (error) {
        logger.error('Failed to generate profile summary:', error);
        // Return fallback summary
        return 'A passionate developer building innovative solutions.';
    }
};

/**
 * Identify strengths from commit patterns
 */
export const identifyStrengths = async (githubAccountId) => {
    try {
        const { data: analytics } = await supabaseAdmin
            .from('analytics')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .single();

        const strengths = [];

        if (analytics.activity_score >= 75) strengths.push('High Activity');
        if (analytics.quality_score >= 75) strengths.push('Code Quality');
        if (analytics.impact_score >= 75) strengths.push('Community Impact');
        if (analytics.collaboration_score >= 75) strengths.push('Team Collaboration');
        if (analytics.consistency_score >= 75) strengths.push('Consistency');

        if (analytics.longest_streak >= 30) strengths.push('Dedicated Contributor');
        if (analytics.total_stars_earned >= 100) strengths.push('Popular Projects');
        if (analytics.code_reviews_given >= 50) strengths.push('Code Reviewer');

        return strengths.length > 0 ? strengths : ['Active Developer'];
    } catch (error) {
        logger.error('Failed to identify strengths:', error);
        return ['Active Developer'];
    }
};

/**
 * Extract focus areas (top languages, technologies)
 */
export const extractFocusAreas = async (githubAccountId) => {
    try {
        const { data: analytics } = await supabaseAdmin
            .from('analytics')
            .select('top_languages, language_stats')
            .eq('github_account_id', githubAccountId)
            .single();

        const focusAreas = analytics?.top_languages || [];

        // Add technology categories based on languages
        const techStack = [];
        if (focusAreas.includes('JavaScript') || focusAreas.includes('TypeScript')) {
            techStack.push('Web Development');
        }
        if (focusAreas.includes('Python')) {
            techStack.push('Data Science', 'Backend Development');
        }
        if (focusAreas.includes('Java') || focusAreas.includes('Kotlin')) {
            techStack.push('Enterprise Applications');
        }
        if (focusAreas.includes('Go') || focusAreas.includes('Rust')) {
            techStack.push('Systems Programming');
        }

        return [...new Set([...focusAreas, ...techStack])];
    } catch (error) {
        logger.error('Failed to extract focus areas:', error);
        return [];
    }
};

/**
 * Generate personalized recommendations
 */
export const generateRecommendations = async (githubAccountId) => {
    try {
        const { data: analytics } = await supabaseAdmin
            .from('analytics')
            .select('*')
            .eq('github_account_id', githubAccountId)
            .single();

        const recommendations = [];

        if (analytics.quality_score < 50) {
            recommendations.push('Add README files and documentation to your projects');
            recommendations.push('Include tests in your repositories');
        }

        if (analytics.collaboration_score < 50) {
            recommendations.push('Contribute to open source projects');
            recommendations.push('Review code and provide feedback to others');
        }

        if (analytics.consistency_score < 50) {
            recommendations.push('Try to commit code regularly');
            recommendations.push('Set a goal for daily contributions');
        }

        if (analytics.impact_score < 50) {
            recommendations.push('Share your projects on social media');
            recommendations.push('Write blog posts about your work');
        }

        if (recommendations.length === 0) {
            recommendations.push('Keep up the great work!');
            recommendations.push('Consider mentoring other developers');
        }

        return recommendations;
    } catch (error) {
        logger.error('Failed to generate recommendations:', error);
        return ['Keep coding and learning!'];
    }
};

/**
 * Generate all AI insights
 */
export const generateAllInsights = async (githubAccountId) => {
    try {
        const [summary, strengths, focusAreas, recommendations] = await Promise.all([
            generateProfileSummary(githubAccountId),
            identifyStrengths(githubAccountId),
            extractFocusAreas(githubAccountId),
            generateRecommendations(githubAccountId)
        ]);

        // Update analytics with AI insights
        await supabaseAdmin
            .from('analytics')
            .update({
                profile_summary: summary,
                strengths,
                focus_areas: focusAreas,
                recommendations,
                ai_insights_generated_at: new Date().toISOString()
            })
            .eq('github_account_id', githubAccountId);

        return {
            summary,
            strengths,
            focusAreas,
            recommendations
        };
    } catch (error) {
        logger.error('Failed to generate all insights:', error);
        throw error;
    }
};

/**
 * Track AI usage
 */
export const trackAIUsage = async (userId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const periodEnd = new Date(today);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await supabaseAdmin.rpc('increment_usage', {
            p_user_id: userId,
            p_period_start: today.toISOString().split('T')[0],
            p_period_end: periodEnd.toISOString().split('T')[0],
            p_field: 'ai_insights_used'
        });
    } catch (error) {
        logger.error('Failed to track AI usage:', error);
    }
};
