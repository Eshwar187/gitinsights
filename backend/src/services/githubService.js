import axios from 'axios';
import { decrypt } from '../utils/encryption.js';
import { ExternalServiceError, RateLimitError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Create GitHub API client with authentication
 */
const createGitHubClient = (accessToken) => {
    return axios.create({
        baseURL: GITHUB_API_BASE,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitInsights-App'
        }
    });
};

/**
 * Handle GitHub API rate limiting
 */
const handleRateLimit = async (error) => {
    if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const resetDate = new Date(resetTime * 1000);
        throw new RateLimitError(`GitHub API rate limit exceeded. Resets at ${resetDate.toISOString()}`);
    }
    throw error;
};

/**
 * Retry logic for API calls
 */
const retryRequest = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1 || error.response?.status === 404 || error.response?.status === 403) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

/**
 * Fetch GitHub user profile
 */
export const fetchUserProfile = async (accessToken) => {
    try {
        const client = createGitHubClient(accessToken);

        const { data } = await retryRequest(() => client.get('/user'));

        return {
            github_id: data.id,
            username: data.login,
            name: data.name,
            avatar_url: data.avatar_url,
            bio: data.bio,
            location: data.location,
            email: data.email,
            blog: data.blog,
            twitter_username: data.twitter_username,
            public_repos: data.public_repos,
            public_gists: data.public_gists,
            followers: data.followers,
            following: data.following,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    } catch (error) {
        await handleRateLimit(error);
        logger.error('Failed to fetch GitHub user profile:', error);
        throw new ExternalServiceError('Failed to fetch GitHub profile');
    }
};

/**
 * Fetch all user repositories
 */
export const fetchRepositories = async (accessToken, username) => {
    try {
        const client = createGitHubClient(accessToken);

        let allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const { data } = await retryRequest(() =>
                client.get(`/user/repos`, {
                    params: {
                        per_page: 100,
                        page,
                        sort: 'updated',
                        affiliation: 'owner,collaborator'
                    }
                })
            );

            allRepos = allRepos.concat(data);
            hasMore = data.length === 100;
            page++;

            // Limit to prevent excessive API calls
            if (page > 10) break;
        }

        return allRepos.map(repo => ({
            github_repo_id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            stars_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            watchers_count: repo.watchers_count,
            open_issues_count: repo.open_issues_count,
            language: repo.language,
            topics: repo.topics || [],
            is_private: repo.private,
            is_fork: repo.fork,
            is_archived: repo.archived,
            github_created_at: repo.created_at,
            github_updated_at: repo.updated_at,
            github_pushed_at: repo.pushed_at,
            has_readme: true, // Would need separate API call to verify
            has_license: repo.license !== null
        }));
    } catch (error) {
        await handleRateLimit(error);
        logger.error('Failed to fetch repositories:', error);
        throw new ExternalServiceError('Failed to fetch repositories');
    }
};

/**
 * Fetch commit statistics for a repository
 */
export const fetchCommitStats = async (accessToken, owner, repo) => {
    try {
        const client = createGitHubClient(accessToken);

        // Get commit activity
        const { data: commits } = await retryRequest(() =>
            client.get(`/repos/${owner}/${repo}/commits`, {
                params: { per_page: 100 }
            })
        );

        return {
            total_commits: commits.length,
            recent_commits: commits.slice(0, 10).map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date
            }))
        };
    } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 409) {
            return { total_commits: 0, recent_commits: [] };
        }
        logger.error(`Failed to fetch commits for ${owner}/${repo}:`, error.message);
        return { total_commits: 0, recent_commits: [] };
    }
};

/**
 * Fetch language statistics for a repository
 */
export const fetchLanguageStats = async (accessToken, owner, repo) => {
    try {
        const client = createGitHubClient(accessToken);

        const { data } = await retryRequest(() =>
            client.get(`/repos/${owner}/${repo}/languages`)
        );

        return data;
    } catch (error) {
        if (error.response?.status === 404) {
            return {};
        }
        logger.error(`Failed to fetch languages for ${owner}/${repo}:`, error.message);
        return {};
    }
};

/**
 * Fetch contribution calendar data
 */
export const fetchContributions = async (accessToken, username) => {
    try {

        // Use GitHub GraphQL API for contribution data
        const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

        const { data } = await retryRequest(() =>
            axios.post('https://api.github.com/graphql', {
                query,
                variables: { username }
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        );

        const calendar = data.data.user.contributionsCollection.contributionCalendar;
        const contributions = [];

        calendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                if (day.contributionCount > 0) {
                    contributions.push({
                        date: day.date,
                        count: day.contributionCount
                    });
                }
            });
        });

        return {
            total: calendar.totalContributions,
            daily: contributions
        };
    } catch (error) {
        logger.error('Failed to fetch contributions:', error);
        throw new ExternalServiceError('Failed to fetch contribution data');
    }
};

/**
 * Fetch pull requests
 */
export const fetchPullRequests = async (accessToken, username) => {
    try {
        const client = createGitHubClient(accessToken);

        // Fetch all PRs authored by this user
        const { data } = await retryRequest(() =>
            client.get('/search/issues', {
                params: {
                    q: `author:${username} type:pr`,
                    per_page: 100,
                    sort: 'created',
                    order: 'desc'
                }
            })
        );

        logger.info(`Fetched ${data.items?.length || 0} PRs for user ${username}`);

        // For merged status, we check if the PR is closed
        // The search API includes pull_request.merged_at for merged PRs
        const pullRequests = data.items.map(pr => ({
            id: pr.id,
            title: pr.title,
            state: pr.state,
            created_at: pr.created_at,
            closed_at: pr.closed_at,
            // GitHub search API includes this for merged PRs
            merged_at: pr.pull_request?.merged_at || null,
            // A PR is "merged" if it's closed AND has merged_at, OR if state includes "merged"
            is_merged: !!(pr.pull_request?.merged_at),
            repository: pr.repository_url.split('/').slice(-2).join('/')
        }));

        // Log merge stats for debugging
        const mergedCount = pullRequests.filter(pr => pr.is_merged).length;
        logger.info(`PR Stats for ${username}: ${pullRequests.length} total, ${mergedCount} merged`);

        return pullRequests;
    } catch (error) {
        logger.error('Failed to fetch pull requests:', error);
        return [];
    }
};

/**
 * Fetch issues
 */
export const fetchIssues = async (accessToken, username) => {
    try {
        const client = createGitHubClient(accessToken);

        const { data } = await retryRequest(() =>
            client.get('/search/issues', {
                params: {
                    q: `author:${username} type:issue`,
                    per_page: 100,
                    sort: 'created',
                    order: 'desc'
                }
            })
        );

        return data.items.map(issue => ({
            id: issue.id,
            title: issue.title,
            state: issue.state,
            created_at: issue.created_at,
            closed_at: issue.closed_at,
            repository: issue.repository_url.split('/').slice(-2).join('/')
        }));
    } catch (error) {
        logger.error('Failed to fetch issues:', error);
        return [];
    }
};

/**
 * Fetch code reviews
 */
export const fetchCodeReviews = async (accessToken, username) => {
    try {
        const client = createGitHubClient(accessToken);

        const { data } = await retryRequest(() =>
            client.get('/search/issues', {
                params: {
                    q: `reviewed-by:${username} type:pr`,
                    per_page: 100,
                    sort: 'created',
                    order: 'desc'
                }
            })
        );

        return data.items.length;
    } catch (error) {
        logger.error('Failed to fetch code reviews:', error);
        return 0;
    }
};

/**
 * Get rate limit status
 */
export const getRateLimitStatus = async (accessToken) => {
    try {
        const client = createGitHubClient(accessToken);

        const { data } = await client.get('/rate_limit');

        return {
            limit: data.rate.limit,
            remaining: data.rate.remaining,
            reset: new Date(data.rate.reset * 1000),
            used: data.rate.used
        };
    } catch (error) {
        logger.error('Failed to fetch rate limit:', error);
        return null;
    }
};
