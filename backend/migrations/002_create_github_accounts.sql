-- Create github_accounts table
CREATE TABLE IF NOT EXISTS github_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- GitHub info
  github_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT, -- Encrypted
  token_expires_at TIMESTAMP,
  
  -- Profile data
  profile_data JSONB DEFAULT '{}', -- Full GitHub profile
  
  -- Sync info
  last_synced_at TIMESTAMP,
  sync_status VARCHAR(50) DEFAULT 'pending', -- pending, syncing, completed, failed
  sync_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_github_accounts_user_id ON github_accounts(user_id);
CREATE INDEX idx_github_accounts_github_id ON github_accounts(github_id);
CREATE INDEX idx_github_accounts_username ON github_accounts(username);
CREATE INDEX idx_github_accounts_sync_status ON github_accounts(sync_status);

-- Create updated_at trigger
CREATE TRIGGER update_github_accounts_updated_at
BEFORE UPDATE ON github_accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE github_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own GitHub accounts"
  ON github_accounts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own GitHub accounts"
  ON github_accounts FOR ALL
  USING (user_id = auth.uid());
