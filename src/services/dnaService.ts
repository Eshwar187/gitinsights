import api from '../lib/api';

/**
 * DNA Analysis Types
 */
export interface DeveloperDNA {
    codingStyle: {
        type: 'night_owl' | 'early_bird' | 'balanced';
        peakHour: number;
        consistency: number; // 0-100
    };
    productivity: {
        type: 'burst' | 'steady' | 'weekend_warrior';
        avgCommitsPerDay: number;
        streakPower: number; // 0-100
    };
    languageGenome: {
        primary: string;
        secondary: string[];
        diversity: number; // 0-100
        evolution: { year: number; languages: string[] }[];
    };
    profile: {
        title: string;
        description: string;
        strengths: string[];
        archetype: string;
    };
    stats: {
        totalCommits: number;
        longestStreak: number;
        activeRepos: number;
        languageCount: number;
    };
}

/**
 * Analyze coding patterns to generate Developer DNA
 */
export const analyzeDeveloperDNA = async (): Promise<DeveloperDNA> => {
    const response = await api.get('/api/analytics/dna');
    return response.data.data;
};

/**
 * Calculate coding style based on contribution times
 */
export const calculateCodingStyle = (contributions: any[]) => {
    if (!contributions || contributions.length === 0) {
        return { type: 'balanced' as const, peakHour: 12, consistency: 50 };
    }

    // Analyze hour distribution
    const hourCounts: Record<number, number> = {};
    contributions.forEach(c => {
        const hour = new Date(c.contribution_date).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHourEntry = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0];
    const peakHour = peakHourEntry ? peakHourEntry[0] : '12';

    const peakHourNum = parseInt(peakHour, 10);

    let type: 'night_owl' | 'early_bird' | 'balanced';
    if (peakHourNum >= 22 || peakHourNum <= 4) {
        type = 'night_owl';
    } else if (peakHourNum >= 5 && peakHourNum <= 10) {
        type = 'early_bird';
    } else {
        type = 'balanced';
    }

    // Calculate consistency
    const daysCoding = new Set(contributions.map(c =>
        new Date(c.contribution_date).toISOString().split('T')[0]
    )).size;
    const totalDays = 365;
    const consistency = Math.round((daysCoding / totalDays) * 100);

    return { type, peakHour: peakHourNum, consistency };
};

/**
 * Calculate productivity pattern
 */
export const calculateProductivity = (contributions: any[], streak: number) => {
    if (!contributions || contributions.length === 0) {
        return { type: 'steady' as const, avgCommitsPerDay: 0, streakPower: 0 };
    }

    const totalCommits = contributions.reduce((sum, c) => sum + (c.commits_count || 1), 0);
    const activeDays = contributions.length;
    const avgCommitsPerDay = activeDays > 0 ? Math.round((totalCommits / activeDays) * 10) / 10 : 0;

    // Check day distribution
    const dayCounts: Record<number, number> = {};
    contributions.forEach(c => {
        const day = new Date(c.contribution_date).getDay();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const weekendCoding = (dayCounts[0] || 0) + (dayCounts[6] || 0);
    const weekdayCoding = Object.entries(dayCounts)
        .filter(([d]) => d !== '0' && d !== '6')
        .reduce((sum, [, count]) => sum + count, 0);

    let type: 'burst' | 'steady' | 'weekend_warrior';
    if (weekendCoding > weekdayCoding * 0.6) {
        type = 'weekend_warrior';
    } else if (avgCommitsPerDay > 3) {
        type = 'burst';
    } else {
        type = 'steady';
    }

    const streakPower = Math.min(100, Math.round((streak / 30) * 100));

    return { type, avgCommitsPerDay, streakPower };
};

/**
 * Calculate language genome
 */
export const calculateLanguageGenome = (languages: any[]) => {
    if (!languages || languages.length === 0) {
        return { primary: 'Unknown', secondary: [], diversity: 0, evolution: [] };
    }

    const sorted = [...languages].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    const primary = sorted[0]?.language || 'Unknown';
    const secondary = sorted.slice(1, 4).map(l => l.language);
    const diversity = Math.min(100, languages.length * 10);

    return { primary, secondary, diversity, evolution: [] };
};

/**
 * Generate developer profile/archetype
 */
export const generateProfile = (
    codingStyle: ReturnType<typeof calculateCodingStyle>,
    productivity: ReturnType<typeof calculateProductivity>,
    languageGenome: ReturnType<typeof calculateLanguageGenome>
) => {
    const archetypes: Record<string, { title: string; description: string; strengths: string[] }> = {
        'night_owl_burst': {
            title: '🦉 The Night Owl Ninja',
            description: 'You thrive in the quiet hours, delivering intense bursts of productivity when others sleep.',
            strengths: ['Deep focus sessions', 'Complex problem solving', 'Independent work']
        },
        'early_bird_steady': {
            title: '🌅 The Dawn Craftsman',
            description: 'You start early and maintain consistent output, building quality code brick by brick.',
            strengths: ['Reliability', 'Sustainable pace', 'Team collaboration']
        },
        'balanced_steady': {
            title: '⚖️ The Balanced Builder',
            description: 'You maintain a healthy work rhythm with consistent, quality contributions.',
            strengths: ['Work-life balance', 'Sustainable velocity', 'Adaptability']
        },
        'weekend_warrior': {
            title: '🚀 The Weekend Warrior',
            description: 'Your passion projects come alive on weekends, showing true dedication to the craft.',
            strengths: ['Side project master', 'Passion-driven', 'Self-motivated']
        },
        'default': {
            title: '💻 The Versatile Developer',
            description: 'You adapt to any situation, coding whenever inspiration strikes.',
            strengths: ['Flexibility', 'Adaptability', 'Diverse skills']
        }
    };

    const key = productivity.type === 'weekend_warrior'
        ? 'weekend_warrior'
        : `${codingStyle.type}_${productivity.type}`;

    const profile = archetypes[key] || archetypes['default'];

    return {
        ...profile,
        archetype: `${languageGenome.primary} ${profile.title}`
    };
};
