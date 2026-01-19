import api from '../lib/api';

/**
 * Start coding session
 */
export const startSession = async (sessionData: {
    session_type: string;
    programming_language?: string;
    topic?: string;
    difficulty_level?: string;
}) => {
    const response = await api.post('/api/mentor/session/start', sessionData);
    return response.data;
};

/**
 * Chat with AI mentor
 */
export const chatWithMentor = async (chatData: {
    sessionId: string;
    message: string;
    codeSnippet?: string;
    language?: string;
    hasError?: boolean;
}) => {
    const response = await api.post('/api/mentor/chat', chatData);
    return response.data;
};

/**
 * Generate coding challenge
 */
export const generateChallenge = async (challengeData: {
    difficulty?: 'easy' | 'medium' | 'hard';
    topic?: string;
    weakAreas?: string[];
}) => {
    const response = await api.post('/api/mentor/challenge/generate', challengeData);
    return response.data;
};

/**
 * Submit challenge solution
 */
export const submitSolution = async (submissionData: {
    challengeId: string;
    solution: string;
    language: string;
}) => {
    const response = await api.post('/api/mentor/challenge/submit', submissionData);
    return response.data;
};

/**
 * Explain code
 */
export const explainCode = async (explainData: {
    code: string;
    language: string;
    explanationType?: 'line_by_line' | 'high_level' | 'beginner_friendly' | 'technical_deep_dive';
}) => {
    const response = await api.post('/api/mentor/explain', explainData);
    return response.data;
};

/**
 * Get debug help
 */
export const getDebugHelp = async (debugData: {
    errorMessage: string;
    code: string;
    stackTrace?: string;
    language: string;
    context?: string;
}) => {
    const response = await api.post('/api/mentor/debug', debugData);
    return response.data;
};
