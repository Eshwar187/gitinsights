-- Create contributions table (for heatmap)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_account_id UUID NOT NULL REFERENCES github_accounts(id) ON DELETE CASCADE,
  
  -- Date
  contribution_date DATE NOT NULL,
  
  -- Activity counts
  commits_count INTEGER DEFAULT 0,
  pull_requests_count INTEGER DEFAULT 0,
  issues_count INTEGER DEFAULT 0,
  code_reviews_count INTEGER DEFAULT 0,
  
  -- Additional metrics
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  repositories_contributed TEXT[], -- Array of repo names
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(github_account_id, contribution_date)
);

-- Create indexes
CREATE INDEX idx_contributions_github_account_id ON contributions(github_account_id);
CREATE INDEX idx_contributions_date ON contributions(contribution_date DESC);
CREATE INDEX idx_contributions_account_date ON contributions(github_account_id, contribution_date);

-- Create updated_at trigger
CREATE TRIGGER update_contributions_updated_at
BEFORE UPDATE ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own contributions"
  ON contributions FOR SELECT
  USING (
    github_account_id IN (
      SELECT id FROM github_accounts WHERE user_id = auth.uid()
    )
  );
