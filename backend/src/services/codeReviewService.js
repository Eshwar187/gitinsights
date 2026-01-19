import { HfInference } from '@huggingface/inference';
import axios from 'axios';
import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';
import { ExternalServiceError } from '../utils/errors.js';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Fetch commit details from GitHub
 */
export const fetchCommitFromGitHub = async (owner, repo, commitSha, accessToken) => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
            {
                headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        return response.data;
    } catch (error) {
        logger.error('Failed to fetch commit from GitHub:', error);
        throw new ExternalServiceError('Failed to fetch commit from GitHub');
    }
};

/**
 * Analyze code changes using AI
 */
export const analyzeCodeWithAI = async (codeDiff, language) => {
    try {
        const prompt = `Analyze this ${language} code diff and provide a detailed code review:

${codeDiff}

Provide analysis in JSON format with:
1. security_issues: Array of security vulnerabilities (hardcoded secrets, SQL injection risks, etc.)
2. code_smells: Array of code quality issues (long functions, duplicated code, poor naming)
3. performance_issues: Array of performance concerns
4. strengths: Array of positive aspects
5. suggestions: Array of actionable improvements

Each issue should have: severity (critical/warning/info), line (line number), message, and suggestion.`;

        const response = await hf.textGeneration({
            model: 'bigcode/starcoder',
            inputs: prompt,
            parameters: {
                max_new_tokens: 1000,
                temperature: 0.3,
                return_full_text: false
            }
        });

        // Parse AI response
        try {
            const analysis = JSON.parse(response.generated_text);
            return analysis;
        } catch {
            // If JSON parsing fails, return structured response
            return {
                security_issues: [],
                code_smells: [],
                performance_issues: [],
                strengths: ['Code appears functional'],
                suggestions: ['Consider adding more comments', 'Add error handling']
            };
        }
    } catch (error) {
        logger.error('AI analysis failed:', error);
        // Return default analysis if AI fails
        return {
            security_issues: [],
            code_smells: [],
            performance_issues: [],
            strengths: [],
            suggestions: []
        };
    }
};

/**
 * Detect security issues in code
 */
export const detectSecurityIssues = (code) => {
    const issues = [];

    // Check for hardcoded secrets
    const secretPatterns = [
        { pattern: /password\s*=\s*["'][^"']+["']/gi, message: 'Hardcoded password detected' },
        { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/gi, message: 'Hardcoded API key detected' },
        { pattern: /secret\s*=\s*["'][^"']+["']/gi, message: 'Hardcoded secret detected' },
        { pattern: /token\s*=\s*["'][^"']+["']/gi, message: 'Hardcoded token detected' }
    ];

    secretPatterns.forEach(({ pattern, message }) => {
        const matches = code.match(pattern);
        if (matches) {
            issues.push({
                severity: 'critical',
                message,
                suggestion: 'Move sensitive data to environment variables'
            });
        }
    });

    // Check for SQL injection risks
    if (code.match(/execute\([^)]*\+[^)]*\)/gi)) {
        issues.push({
            severity: 'critical',
            message: 'Potential SQL injection vulnerability',
            suggestion: 'Use parameterized queries instead of string concatenation'
        });
    }

    return issues;
};

/**
 * Detect code smells
 */
export const detectCodeSmells = (code) => {
    const smells = [];

    // Check for long functions (>50 lines)
    const functions = code.match(/function\s+\w+[^{]*{[\s\S]*?}/g) || [];
    functions.forEach(func => {
        const lines = func.split('\n').length;
        if (lines > 50) {
            smells.push({
                severity: 'warning',
                message: `Function is ${lines} lines long (recommended: <50)`,
                suggestion: 'Consider breaking this function into smaller, focused functions'
            });
        }
    });

    // Check for single-letter variables
    const singleLetterVars = code.match(/\b[a-z]\s*=/gi);
    if (singleLetterVars && singleLetterVars.length > 3) {
        smells.push({
            severity: 'info',
            message: 'Multiple single-letter variable names found',
            suggestion: 'Use descriptive variable names for better readability'
        });
    }

    // Check for missing error handling
    if (code.includes('async') && !code.includes('try') && !code.includes('catch')) {
        smells.push({
            severity: 'warning',
            message: 'Async code without error handling',
            suggestion: 'Add try-catch blocks for async operations'
        });
    }

    return smells;
};

/**
 * Calculate overall code quality score
 */
export const calculateScore = (securityIssues, codeSmells, performanceIssues) => {
    let score = 10;

    // Deduct points for issues
    score -= securityIssues.filter(i => i.severity === 'critical').length * 2;
    score -= securityIssues.filter(i => i.severity === 'warning').length * 1;
    score -= codeSmells.length * 0.5;
    score -= performanceIssues.length * 0.5;

    return Math.max(0, Math.min(10, score));
};

/**
 * Analyze commit and save review
 */
export const analyzeCommit = async (userId, githubAccountId, commitSha, repositoryName) => {
    try {
        // Get GitHub access token
        const { data: account } = await supabaseAdmin
            .from('github_accounts')
            .select('access_token, username')
            .eq('id', githubAccountId)
            .single();

        if (!account) {
            throw new Error('GitHub account not found');
        }

        // Parse repository owner and name
        const [owner, repo] = repositoryName.split('/');

        // Fetch commit from GitHub
        const commit = await fetchCommitFromGitHub(owner || account.username, repo, commitSha, account.access_token);

        // Extract code diff
        const codeDiff = commit.files ? commit.files.map(f => f.patch || '').join('\n\n') : '';

        // Analyze code
        const aiAnalysis = await analyzeCodeWithAI(codeDiff, 'javascript'); // Could detect language
        const securityIssues = detectSecurityIssues(codeDiff);
        const codeSmells = detectCodeSmells(codeDiff);

        // Combine issues
        const allIssues = [
            ...securityIssues.map(i => ({ ...i, type: 'security' })),
            ...codeSmells.map(s => ({ ...s, type: 'code_smell' })),
            ...(aiAnalysis.security_issues || []).map(i => ({ ...i, type: 'security' })),
            ...(aiAnalysis.code_smells || []).map(s => ({ ...s, type: 'code_smell' }))
        ];

        // Calculate score
        const overallScore = calculateScore(
            securityIssues,
            [...codeSmells, ...(aiAnalysis.code_smells || [])],
            aiAnalysis.performance_issues || []
        );

        // Save review to database
        const { data: review, error } = await supabaseAdmin
            .from('code_reviews')
            .insert({
                user_id: userId,
                github_account_id: githubAccountId,
                commit_sha: commitSha,
                commit_message: commit.commit.message,
                commit_date: commit.commit.author.date,
                repository_name: repositoryName,
                files_changed: commit.files?.length || 0,
                additions: commit.stats?.additions || 0,
                deletions: commit.stats?.deletions || 0,
                overall_score: overallScore,
                strengths: aiAnalysis.strengths || [],
                issues: allIssues,
                security_issues: securityIssues.length,
                code_smells: codeSmells.length,
                performance_issues: (aiAnalysis.performance_issues || []).length,
                suggestions: aiAnalysis.suggestions || [],
                ai_model: 'bigcode/starcoder',
                confidence_score: 0.85,
                status: 'completed'
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        logger.info(`Code review completed for commit ${commitSha}`);
        return review;
    } catch (error) {
        logger.error('Failed to analyze commit:', error);
        throw error;
    }
};

/**
 * Get review history for user
 */
export const getReviewHistory = async (userId, options = {}) => {
    const { limit = 20, offset = 0, sort = 'date' } = options;

    let query = supabaseAdmin
        .from('code_reviews')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .range(offset, offset + limit - 1);

    if (sort === 'score') {
        query = query.order('overall_score', { ascending: false });
    } else {
        query = query.order('reviewed_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) {
        throw error;
    }

    return {
        reviews: data || [],
        total: count || 0,
        limit,
        offset
    };
};

/**
 * Get single review by commit SHA
 */
export const getReviewByCommitSha = async (userId, commitSha) => {
    const { data, error } = await supabaseAdmin
        .from('code_reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('commit_sha', commitSha)
        .single();

    if (error) {
        throw error;
    }

    return data;
};

/**
 * Delete review
 */
export const deleteReview = async (userId, reviewId) => {
    const { error } = await supabaseAdmin
        .from('code_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', userId);

    if (error) {
        throw error;
    }

    return true;
};
