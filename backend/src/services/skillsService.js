import supabaseAdmin from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Initialize user skills from GitHub repositories
 */
export const initializeUserSkills = async (userId, githubAccountId) => {
    try {
        // Get user's repositories
        const { data: repos } = await supabaseAdmin
            .from('repositories')
            .select('*')
            .eq('github_account_id', githubAccountId);

        if (!repos || repos.length === 0) {
            return { message: 'No repositories found', skills: [] };
        }

        // Detect skills from repositories
        const skillsDetected = {};

        repos.forEach(repo => {
            // Detect from primary language
            if (repo.language) {
                const skillName = mapLanguageToSkill(repo.language);
                if (skillName) {
                    if (!skillsDetected[skillName]) {
                        skillsDetected[skillName] = {
                            repos: 0,
                            commits: 0
                        };
                    }
                    skillsDetected[skillName].repos++;
                }
            }

            // Detect from languages object
            if (repo.languages) {
                Object.keys(repo.languages).forEach(lang => {
                    const skillName = mapLanguageToSkill(lang);
                    if (skillName && !skillsDetected[skillName]) {
                        skillsDetected[skillName] = {
                            repos: 0,
                            commits: 0
                        };
                    }
                });
            }
        });

        // Create user_skills records
        const createdSkills = [];

        for (const [skillName, stats] of Object.entries(skillsDetected)) {
            // Get skill from master
            const { data: skill } = await supabaseAdmin
                .from('skills_master')
                .select('*')
                .eq('skill_name', skillName)
                .single();

            if (skill) {
                // Calculate XP
                const xp = stats.repos * 100 + stats.commits * 2;
                const level = Math.min(10, Math.floor(xp / 250) + 1);
                const status = level >= 8 ? 'mastered' : 'learning';

                // Create or update user skill
                const { data: userSkill } = await supabaseAdmin
                    .from('user_skills')
                    .upsert({
                        user_id: userId,
                        github_account_id: githubAccountId,
                        skill_id: skill.id,
                        status,
                        current_xp: xp,
                        level,
                        repos_using_skill: stats.repos,
                        unlocked_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,skill_id'
                    })
                    .select('*, skill:skills_master(*)')
                    .single();

                if (userSkill) {
                    createdSkills.push(userSkill);
                }
            }
        }

        logger.info(`Initialized ${createdSkills.length} skills for user ${userId}`);
        return { message: 'Skills initialized', skills: createdSkills };
    } catch (error) {
        logger.error('Failed to initialize skills:', error);
        throw error;
    }
};

/**
 * Map programming language to skill name
 */
function mapLanguageToSkill(language) {
    const mapping = {
        'JavaScript': 'JavaScript',
        'TypeScript': 'TypeScript',
        'Python': 'Python',
        'Java': 'Java',
        'Go': 'Go',
        'Rust': 'Rust',
        'C++': 'C++',
        'C#': 'C#',
        'Ruby': 'Ruby',
        'PHP': 'PHP',
        'Swift': 'Swift',
        'Kotlin': 'Kotlin',
        'HTML': 'HTML',
        'CSS': 'CSS'
    };

    return mapping[language] || null;
}

/**
 * Get user's skill tree
 */
export const getSkillTree = async (userId) => {
    try {
        // Get all skills from master
        const { data: allSkills } = await supabaseAdmin
            .from('skills_master')
            .select('*')
            .order('category')
            .order('difficulty');

        // Get user's progress
        const { data: userSkills } = await supabaseAdmin
            .from('user_skills')
            .select('*')
            .eq('user_id', userId);

        // Build skill tree with user progress
        const skillTree = (allSkills || []).map(skill => {
            const userProgress = (userSkills || []).find(us => us.skill_id === skill.id);

            return {
                id: skill.id,
                name: skill.skill_name,
                category: skill.category,
                difficulty: skill.difficulty,
                description: skill.description,
                icon_url: skill.icon_url,
                prerequisites: skill.prerequisites || [],
                maxXp: skill.max_xp,
                status: userProgress?.status || 'locked',
                currentXp: userProgress?.current_xp || 0,
                level: userProgress?.level || 0,
                progress: userProgress ? (userProgress.current_xp / skill.max_xp * 100).toFixed(1) : 0,
                repos: userProgress?.repos_using_skill || 0,
                commits: userProgress?.commits_using_skill || 0,
                canUnlock: canUnlockSkill(skill, userSkills || []),
                unlockedAt: userProgress?.unlocked_at,
                masteredAt: userProgress?.mastered_at
            };
        });

        // Calculate stats
        const stats = {
            totalSkills: skillTree.length,
            masteredSkills: skillTree.filter(s => s.status === 'mastered').length,
            learningSkills: skillTree.filter(s => s.status === 'learning').length,
            lockedSkills: skillTree.filter(s => s.status === 'locked').length
        };

        return {
            skills: skillTree,
            stats
        };
    } catch (error) {
        logger.error('Failed to get skill tree:', error);
        throw error;
    }
};

/**
 * Check if user can unlock a skill
 */
function canUnlockSkill(skill, userSkills) {
    if (!skill.prerequisites || skill.prerequisites.length === 0) {
        return true;
    }

    // Check if all prerequisites are mastered
    return skill.prerequisites.every(prereqId => {
        const prereqSkill = userSkills.find(us => us.skill_id === prereqId);
        return prereqSkill && prereqSkill.status === 'mastered';
    });
}

/**
 * Update skill progress
 */
export const updateSkillProgress = async (userId, githubAccountId) => {
    try {
        // Re-analyze repositories
        await initializeUserSkills(userId, githubAccountId);

        // Check for level ups and achievements
        const { data: userSkills } = await supabaseAdmin
            .from('user_skills')
            .select('*, skill:skills_master(*)')
            .eq('user_id', userId);

        const levelUps = [];
        const achievements = [];

        (userSkills || []).forEach(userSkill => {
            // Check if leveled up to mastered
            if (userSkill.level >= 8 && userSkill.status === 'learning') {
                supabaseAdmin
                    .from('user_skills')
                    .update({
                        status: 'mastered',
                        mastered_at: new Date().toISOString()
                    })
                    .eq('id', userSkill.id)
                    .then(() => {
                        levelUps.push(userSkill.skill.skill_name);
                    });
            }
        });

        return {
            message: 'Skills updated',
            levelUps,
            achievements
        };
    } catch (error) {
        logger.error('Failed to update skill progress:', error);
        throw error;
    }
};

/**
 * Generate learning path for job
 */
export const generateJobPath = async (userId, jobTitle) => {
    try {
        // Define job requirements (simplified - would use AI in production)
        const jobRequirements = {
            'Full Stack Developer': [
                'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
                'PostgreSQL', 'MongoDB', 'Git', 'REST API'
            ],
            'Frontend Developer': [
                'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js'
            ],
            'Backend Developer': [
                'Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker'
            ]
        };

        const requiredSkills = jobRequirements[jobTitle] || [];

        // Get user's current skills
        const { data: userSkills } = await supabaseAdmin
            .from('user_skills')
            .select('*, skill:skills_master(*)')
            .eq('user_id', userId)
            .in('skill.skill_name', requiredSkills);

        const masteredSkills = (userSkills || [])
            .filter(us => us.status === 'mastered')
            .map(us => us.skill.skill_name);

        const missingSkills = requiredSkills.filter(skill =>
            !masteredSkills.includes(skill)
        );

        const currentMatch = (masteredSkills.length / requiredSkills.length * 100).toFixed(1);

        // Generate learning path
        const learningPath = missingSkills.map(skillName => ({
            skill: skillName,
            currentLevel: 0,
            targetLevel: 7,
            estimatedTime: '2-3 months',
            resources: ['Official Documentation', 'Online Courses']
        }));

        return {
            currentMatch: parseFloat(currentMatch),
            requiredSkills,
            masteredSkills,
            missingSkills,
            learningPath
        };
    } catch (error) {
        logger.error('Failed to generate job path:', error);
        throw error;
    }
};
