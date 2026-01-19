-- Create AI Mentor system tables

-- Coding sessions with AI mentor
CREATE TABLE IF NOT EXISTS coding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session details
  session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('debug_help', 'code_review', 'learning', 'challenge', 'pair_programming')),
  programming_language VARCHAR(100),
  topic VARCHAR(255),
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Status
  session_status VARCHAR(50) DEFAULT 'active' CHECK (session_status IN ('active', 'paused', 'completed', 'abandoned')),
  
  -- Activity
  code_written TEXT,
  problems_solved INTEGER DEFAULT 0,
  ai_suggestions_given INTEGER DEFAULT 0,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  
  -- Time tracking
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversation history
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES coding_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message details
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('user_message', 'ai_response', 'code_snippet', 'error_help', 'explanation')),
  message_content TEXT NOT NULL,
  code_snippet TEXT,
  language VARCHAR(50),
  
  -- Error handling
  has_error BOOLEAN DEFAULT false,
  error_type VARCHAR(100),
  
  -- AI metadata
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  was_helpful BOOLEAN,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated coding challenges
CREATE TABLE IF NOT EXISTS coding_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Challenge details
  challenge_title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  topic VARCHAR(100),
  
  -- Code
  starter_code TEXT,
  optimal_solution TEXT,
  user_solution TEXT,
  
  -- Test cases
  test_cases JSONB DEFAULT '[]', -- [{ input, expectedOutput, description }]
  hints JSONB DEFAULT '[]',
  
  -- Complexity
  time_complexity VARCHAR(100),
  space_complexity VARCHAR(100),
  tags JSONB DEFAULT '[]',
  
  -- Generation metadata
  generated_reason TEXT,
  
  -- Progress
  status VARCHAR(50) DEFAULT 'not_attempted' CHECK (status IN ('not_attempted', 'in_progress', 'completed', 'given_up')),
  attempts_count INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  passed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  
  -- Timestamps
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalized learning paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Path details
  path_name VARCHAR(255) NOT NULL,
  goal TEXT NOT NULL,
  current_skill_level VARCHAR(50) CHECK (current_skill_level IN ('beginner', 'intermediate', 'advanced')),
  target_skill_level VARCHAR(50) CHECK (target_skill_level IN ('intermediate', 'advanced', 'expert')),
  
  -- Timeline
  estimated_duration_days INTEGER,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Steps
  steps JSONB DEFAULT '[]', -- [{ stepNumber, title, description, resources, estimatedHours, status, completedAt }]
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_completion DATE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code explanations cache
CREATE TABLE IF NOT EXISTS code_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Code
  original_code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  
  -- Explanation
  explanation_type VARCHAR(50) CHECK (explanation_type IN ('line_by_line', 'high_level', 'beginner_friendly', 'technical_deep_dive')),
  explanation_content JSONB, -- { summary, lineExplanations, keyConcepts, analogies }
  complexity_analysis TEXT,
  improvement_suggestions JSONB DEFAULT '[]',
  alternative_approaches JSONB DEFAULT '[]',
  related_concepts JSONB DEFAULT '[]',
  
  -- Feedback
  was_helpful BOOLEAN,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debugging sessions
CREATE TABLE IF NOT EXISTS debugging_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Error details
  error_message TEXT NOT NULL,
  error_type VARCHAR(100),
  language VARCHAR(50) NOT NULL,
  framework VARCHAR(100),
  problematic_code TEXT,
  stack_trace TEXT,
  context TEXT,
  
  -- AI diagnosis
  ai_diagnosis TEXT,
  suggested_fixes JSONB DEFAULT '[]', -- [{ fixDescription, codeChange, explanation, confidence }]
  solution_applied TEXT,
  
  -- Resolution
  resolution_time_seconds INTEGER,
  was_resolved BOOLEAN DEFAULT false,
  follow_up_questions JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User learning progress tracking
CREATE TABLE IF NOT EXISTS user_progress_tracking (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Overall stats
  total_sessions INTEGER DEFAULT 0,
  total_challenges_completed INTEGER DEFAULT 0,
  total_bugs_solved INTEGER DEFAULT 0,
  total_learning_hours INTEGER DEFAULT 0, -- in minutes
  
  -- Streaks
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  
  -- Skills
  skill_levels JSONB DEFAULT '{}', -- { "JavaScript": "advanced", "Python": "intermediate" }
  weak_areas JSONB DEFAULT '[]',
  strong_areas JSONB DEFAULT '[]',
  
  -- Learning pace
  learning_pace VARCHAR(50) CHECK (learning_pace IN ('slow', 'moderate', 'fast', 'very_fast')),
  
  -- Activity
  last_session_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_coding_sessions_user_id ON coding_sessions(user_id);
CREATE INDEX idx_coding_sessions_status ON coding_sessions(session_status);
CREATE INDEX idx_coding_sessions_started_at ON coding_sessions(started_at DESC);

CREATE INDEX idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_timestamp ON ai_conversations(timestamp DESC);

CREATE INDEX idx_coding_challenges_user_id ON coding_challenges(user_id);
CREATE INDEX idx_coding_challenges_status ON coding_challenges(status);
CREATE INDEX idx_coding_challenges_difficulty ON coding_challenges(difficulty);

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_code_explanations_user_id ON code_explanations(user_id);
CREATE INDEX idx_debugging_sessions_user_id ON debugging_sessions(user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_progress_tracking_updated_at
BEFORE UPDATE ON user_progress_tracking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE coding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE debugging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can manage their own sessions"
  ON coding_sessions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own conversations"
  ON ai_conversations FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own challenges"
  ON coding_challenges FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own learning paths"
  ON learning_paths FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own code explanations"
  ON code_explanations FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own debugging sessions"
  ON debugging_sessions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own progress"
  ON user_progress_tracking FOR ALL
  USING (user_id = auth.uid());
