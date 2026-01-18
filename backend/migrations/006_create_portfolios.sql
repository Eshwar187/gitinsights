-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic info
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  tagline VARCHAR(500),
  about TEXT,
  
  -- Theme and customization
  theme VARCHAR(50) DEFAULT 'default', -- default, dark, minimal, colorful
  custom_domain VARCHAR(255),
  
  -- Display settings
  display_settings JSONB DEFAULT '{
    "showHeatmap": true,
    "showLanguages": true,
    "showBadges": true,
    "showRepositories": true,
    "showScores": true,
    "showAIInsights": true
  }',
  
  -- Featured content
  featured_repositories UUID[], -- Array of repository IDs
  custom_sections JSONB DEFAULT '[]', -- Array of custom section objects
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_image VARCHAR(500),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  published_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_is_public ON portfolios(is_public);
CREATE INDEX idx_portfolios_view_count ON portfolios(view_count DESC);

-- Create updated_at trigger
CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public portfolios"
  ON portfolios FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can manage their own portfolios"
  ON portfolios FOR ALL
  USING (user_id = auth.uid());
