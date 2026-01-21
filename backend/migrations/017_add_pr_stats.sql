-- Add PR and Code Review stats columns to github_accounts table
-- This stores the aggregated counts fetched during GitHub sync

ALTER TABLE github_accounts
ADD COLUMN IF NOT EXISTS prs_merged INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prs_opened INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS code_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS issues_opened INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN github_accounts.prs_merged IS 'Total number of merged pull requests';
COMMENT ON COLUMN github_accounts.prs_opened IS 'Total number of opened pull requests';
COMMENT ON COLUMN github_accounts.code_reviews IS 'Total number of code reviews given';
COMMENT ON COLUMN github_accounts.issues_opened IS 'Total number of issues opened';
