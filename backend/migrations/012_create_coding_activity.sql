-- Create coding_activity table for tracking when users code

CREATE TABLE IF NOT EXISTS coding_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  github_account_id UUID REFERENCES github_accounts(id) ON DELETE CASCADE,
  
  -- Time tracking
  activity_date DATE NOT NULL,
  hour_of_day INTEGER NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  minutes_coded INTEGER NOT NULL CHECK (minutes_coded >= 0 AND minutes_coded <= 60),
  
  -- Activity details
  language VARCHAR(100),
  repository VARCHAR(255),
  commits_in_hour INTEGER DEFAULT 0,
  editor VARCHAR(50),
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one record per user, date, hour, language
  UNIQUE(user_id, activity_date, hour_of_day, language)
);

-- Create indexes
CREATE INDEX idx_coding_activity_user_id ON coding_activity(user_id);
CREATE INDEX idx_coding_activity_date ON coding_activity(activity_date DESC);
CREATE INDEX idx_coding_activity_user_date ON coding_activity(user_id, activity_date);
CREATE INDEX idx_coding_activity_user_date_hour ON coding_activity(user_id, activity_date, hour_of_day);
CREATE INDEX idx_coding_activity_language ON coding_activity(language);

-- Create updated_at trigger
CREATE TRIGGER update_coding_activity_updated_at
BEFORE UPDATE ON coding_activity
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create aggregation view for daily summaries
CREATE OR REPLACE VIEW daily_activity_summary AS
SELECT 
  user_id,
  activity_date,
  SUM(minutes_coded) as total_minutes,
  ARRAY_AGG(DISTINCT language) FILTER (WHERE language IS NOT NULL) as languages_used,
  (
    SELECT language 
    FROM coding_activity ca2 
    WHERE ca2.user_id = ca.user_id 
      AND ca2.activity_date = ca.activity_date
    GROUP BY language
    ORDER BY SUM(minutes_coded) DESC
    LIMIT 1
  ) as most_used_language,
  (
    SELECT hour_of_day 
    FROM coding_activity ca2 
    WHERE ca2.user_id = ca.user_id 
      AND ca2.activity_date = ca.activity_date
    GROUP BY hour_of_day
    ORDER BY SUM(minutes_coded) DESC
    LIMIT 1
  ) as peak_hour,
  SUM(commits_in_hour) as commits_total
FROM coding_activity ca
GROUP BY user_id, activity_date;

-- Enable Row Level Security
ALTER TABLE coding_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activity"
  ON coding_activity FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity"
  ON coding_activity FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own activity"
  ON coding_activity FOR UPDATE
  USING (user_id = auth.uid());
