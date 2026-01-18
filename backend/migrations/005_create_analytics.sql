-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_account_id UUID NOT NULL REFERENCES github_accounts(id) ON DELETE CASCADE,
  
  -- Developer Scores (0-100)
  activity_score DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(5,2) DEFAULT 0,
  impact_score DECIMAL(5,2) DEFAULT 0,
  collaboration_score DECIMAL(5,2) DEFAULT 0,
  consistency_score DECIMAL(5,2) DEFAULT 0,
  overall_score DECIMAL(5,2) DEFAULT 0,
  
  -- Rankings
  global_rank INTEGER,
  country_rank INTEGER,
  language_rank JSONB DEFAULT '{}', -- { "JavaScript": 1234, "Python": 567 }
  
  -- Badges earned
  badges JSONB DEFAULT '[]', -- Array of badge objects
  
  -- Language stats
  language_stats JSONB DEFAULT '{}', -- { "JavaScript": { "bytes": 12345, "percentage": 45.2 } }
  top_languages TEXT[], -- Array of top 5 languages
  
  -- Contribution stats
  total_contributions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  active_days INTEGER DEFAULT 0,
  
  -- Collaboration stats
  pull_requests_created INTEGER DEFAULT 0,
  pull_requests_merged INTEGER DEFAULT 0,
  code_reviews_given INTEGER DEFAULT 0,
  issues_opened INTEGER DEFAULT 0,
  issues_closed INTEGER DEFAULT 0,
  
  -- Impact stats
  total_stars_earned INTEGER DEFAULT 0,
  total_forks_earned INTEGER DEFAULT 0,
  contributors_attracted INTEGER DEFAULT 0,
  
  -- AI Insights
  profile_summary TEXT,
  strengths TEXT[],
  focus_areas TEXT[],
  recommendations TEXT[],
  ai_insights_generated_at TIMESTAMP,
  
  -- Calculation metadata
  last_calculated_at TIMESTAMP,
  calculation_version VARCHAR(50) DEFAULT '1.0',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(github_account_id)
);

-- Create indexes
CREATE INDEX idx_analytics_github_account_id ON analytics(github_account_id);
CREATE INDEX idx_analytics_overall_score ON analytics(overall_score DESC);
CREATE INDEX idx_analytics_global_rank ON analytics(global_rank);

-- Create updated_at trigger
CREATE TRIGGER update_analytics_updated_at
BEFORE UPDATE ON analytics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  USING (
    github_account_id IN (
      SELECT id FROM github_accounts WHERE user_id = auth.uid()
    )
  );
