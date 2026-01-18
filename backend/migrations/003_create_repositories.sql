-- Create repositories table
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_account_id UUID NOT NULL REFERENCES github_accounts(id) ON DELETE CASCADE,
  
  -- Repository info
  github_repo_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  homepage VARCHAR(500),
  
  -- Stats
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  watchers_count INTEGER DEFAULT 0,
  open_issues_count INTEGER DEFAULT 0,
  
  -- Metadata
  language VARCHAR(100),
  languages JSONB DEFAULT '{}', -- Language breakdown
  topics TEXT[], -- Array of topics
  is_private BOOLEAN DEFAULT false,
  is_fork BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  -- Dates
  github_created_at TIMESTAMP,
  github_updated_at TIMESTAMP,
  github_pushed_at TIMESTAMP,
  
  -- Commit stats
  total_commits INTEGER DEFAULT 0,
  user_commits INTEGER DEFAULT 0, -- Commits by the account owner
  
  -- Quality metrics
  has_readme BOOLEAN DEFAULT false,
  has_license BOOLEAN DEFAULT false,
  has_contributing BOOLEAN DEFAULT false,
  has_tests BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_repositories_github_account_id ON repositories(github_account_id);
CREATE INDEX idx_repositories_github_repo_id ON repositories(github_repo_id);
CREATE INDEX idx_repositories_language ON repositories(language);
CREATE INDEX idx_repositories_stars_count ON repositories(stars_count DESC);
CREATE INDEX idx_repositories_is_private ON repositories(is_private);

-- Create updated_at trigger
CREATE TRIGGER update_repositories_updated_at
BEFORE UPDATE ON repositories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own repositories"
  ON repositories FOR SELECT
  USING (
    github_account_id IN (
      SELECT id FROM github_accounts WHERE user_id = auth.uid()
    )
  );
