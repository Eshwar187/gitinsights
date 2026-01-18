-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_github_accounts_last_synced ON github_accounts(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_repositories_updated_at ON repositories(github_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_commits ON contributions(commits_count DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_last_calculated ON analytics(last_calculated_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_published_at ON portfolios(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period_end ON user_subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_payment_records_created_at ON payment_records(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_repositories_account_stars ON repositories(github_account_id, stars_count DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_account_date_range ON contributions(github_account_id, contribution_date DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_public ON portfolios(user_id, is_public);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_repositories_name_search ON repositories USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_repositories_description_search ON repositories USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_portfolios_title_search ON portfolios USING gin(to_tsvector('english', title));
