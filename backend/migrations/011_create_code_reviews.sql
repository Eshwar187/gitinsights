-- Create code_reviews table for AI-powered commit analysis

CREATE TABLE IF NOT EXISTS code_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  github_account_id UUID NOT NULL REFERENCES github_accounts(id) ON DELETE CASCADE,
  
  -- Commit information
  commit_sha VARCHAR(255) NOT NULL,
  commit_message TEXT,
  commit_date TIMESTAMP WITH TIME ZONE,
  repository_name VARCHAR(255) NOT NULL,
  
  -- Change statistics
  files_changed INTEGER DEFAULT 0,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  
  -- Analysis results
  overall_score DECIMAL(4,2) CHECK (overall_score >= 0 AND overall_score <= 10),
  strengths JSONB DEFAULT '[]',
  issues JSONB DEFAULT '[]', -- [{ severity, lineNumber, filename, message, suggestion }]
  
  -- Issue counts
  security_issues INTEGER DEFAULT 0,
  performance_issues INTEGER DEFAULT 0,
  code_smells INTEGER DEFAULT 0,
  
  -- AI recommendations
  suggestions JSONB DEFAULT '[]',
  
  -- AI metadata
  ai_model VARCHAR(100) DEFAULT 'huggingface/codebert-base',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Status
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  
  -- Timestamps
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate reviews
  UNIQUE(github_account_id, commit_sha)
);

-- Create indexes
CREATE INDEX idx_code_reviews_user_id ON code_reviews(user_id);
CREATE INDEX idx_code_reviews_github_account_id ON code_reviews(github_account_id);
CREATE INDEX idx_code_reviews_commit_sha ON code_reviews(commit_sha);
CREATE INDEX idx_code_reviews_overall_score ON code_reviews(overall_score DESC);
CREATE INDEX idx_code_reviews_reviewed_at ON code_reviews(reviewed_at DESC);
CREATE INDEX idx_code_reviews_status ON code_reviews(status);

-- Enable Row Level Security
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own code reviews"
  ON code_reviews FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own code reviews"
  ON code_reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own code reviews"
  ON code_reviews FOR DELETE
  USING (user_id = auth.uid());
