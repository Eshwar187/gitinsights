-- Create skills system tables

-- Reference table for all possible skills
CREATE TABLE IF NOT EXISTS skills_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'devops', 'mobile', 'other')),
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  icon_url TEXT,
  description TEXT,
  prerequisites JSONB DEFAULT '[]', -- Array of skill IDs
  max_xp INTEGER DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skill progress tracking
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  github_account_id UUID REFERENCES github_accounts(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills_master(id) ON DELETE CASCADE,
  
  -- Progress
  status VARCHAR(50) DEFAULT 'locked' CHECK (status IN ('locked', 'learning', 'mastered')),
  current_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  
  -- Usage statistics
  repos_using_skill INTEGER DEFAULT 0,
  commits_using_skill INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  
  -- Dates
  last_used DATE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  mastered_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, skill_id)
);

-- Skill achievements and badges
CREATE TABLE IF NOT EXISTS skill_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  skill_id UUID REFERENCES skills_master(id) ON DELETE SET NULL,
  icon_url TEXT,
  rarity VARCHAR(50) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_skills_master_category ON skills_master(category);
CREATE INDEX idx_skills_master_difficulty ON skills_master(difficulty);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_status ON user_skills(status);
CREATE INDEX idx_user_skills_level ON user_skills(level DESC);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

CREATE INDEX idx_skill_achievements_user_id ON skill_achievements(user_id);
CREATE INDEX idx_skill_achievements_earned_at ON skill_achievements(earned_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_user_skills_updated_at
BEFORE UPDATE ON user_skills
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE skills_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view skills master data"
  ON skills_master FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own skill progress"
  ON user_skills FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own skill progress"
  ON user_skills FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own achievements"
  ON skill_achievements FOR SELECT
  USING (user_id = auth.uid());

-- Insert default skills
INSERT INTO skills_master (skill_name, category, difficulty, description, max_xp) VALUES
  -- Frontend
  ('HTML', 'frontend', 'beginner', 'Hypertext Markup Language', 1000),
  ('CSS', 'frontend', 'beginner', 'Cascading Style Sheets', 1500),
  ('JavaScript', 'frontend', 'intermediate', 'JavaScript programming language', 2500),
  ('TypeScript', 'frontend', 'intermediate', 'Typed superset of JavaScript', 2500),
  ('React', 'frontend', 'intermediate', 'React.js library', 3000),
  ('Vue.js', 'frontend', 'intermediate', 'Vue.js framework', 3000),
  ('Angular', 'frontend', 'advanced', 'Angular framework', 3500),
  ('Next.js', 'frontend', 'advanced', 'React framework with SSR', 3000),
  ('Svelte', 'frontend', 'intermediate', 'Svelte framework', 2500),
  ('Tailwind CSS', 'frontend', 'beginner', 'Utility-first CSS framework', 1500),
  
  -- Backend
  ('Node.js', 'backend', 'intermediate', 'JavaScript runtime', 2500),
  ('Express.js', 'backend', 'intermediate', 'Web framework for Node.js', 2000),
  ('Python', 'backend', 'intermediate', 'Python programming language', 2500),
  ('Django', 'backend', 'advanced', 'Python web framework', 3000),
  ('Flask', 'backend', 'intermediate', 'Python micro framework', 2000),
  ('Java', 'backend', 'advanced', 'Java programming language', 3500),
  ('Spring Boot', 'backend', 'advanced', 'Java framework', 3500),
  ('Go', 'backend', 'intermediate', 'Go programming language', 2500),
  ('Rust', 'backend', 'expert', 'Rust programming language', 4000),
  ('Ruby on Rails', 'backend', 'intermediate', 'Ruby web framework', 2500),
  
  -- Database
  ('PostgreSQL', 'database', 'intermediate', 'Relational database', 2500),
  ('MySQL', 'database', 'intermediate', 'Relational database', 2500),
  ('MongoDB', 'database', 'intermediate', 'NoSQL database', 2500),
  ('Redis', 'database', 'intermediate', 'In-memory data store', 2000),
  ('Firebase', 'database', 'beginner', 'Backend-as-a-Service platform', 1500),
  ('Supabase', 'database', 'intermediate', 'Open source Firebase alternative', 2000),
  
  -- DevOps
  ('Docker', 'devops', 'intermediate', 'Containerization platform', 2500),
  ('Kubernetes', 'devops', 'advanced', 'Container orchestration', 3500),
  ('CI/CD', 'devops', 'intermediate', 'Continuous Integration/Deployment', 2500),
  ('AWS', 'devops', 'advanced', 'Amazon Web Services', 3500),
  ('Azure', 'devops', 'advanced', 'Microsoft Azure', 3500),
  ('GCP', 'devops', 'advanced', 'Google Cloud Platform', 3500),
  ('Git', 'devops', 'beginner', 'Version control system', 1500),
  ('GitHub Actions', 'devops', 'intermediate', 'CI/CD platform', 2000),
  
  -- Mobile
  ('React Native', 'mobile', 'intermediate', 'Mobile app framework', 2500),
  ('Flutter', 'mobile', 'intermediate', 'Mobile app framework', 2500),
  ('Swift', 'mobile', 'advanced', 'iOS development language', 3000),
  ('Kotlin', 'mobile', 'advanced', 'Android development language', 3000),
  
  -- Other
  ('GraphQL', 'other', 'intermediate', 'Query language for APIs', 2500),
  ('REST API', 'other', 'beginner', 'RESTful API design', 2000),
  ('WebSocket', 'other', 'intermediate', 'Real-time communication', 2500),
  ('Microservices', 'other', 'advanced', 'Microservices architecture', 3500),
  ('System Design', 'other', 'expert', 'Large-scale system design', 4000)
ON CONFLICT (skill_name) DO NOTHING;
