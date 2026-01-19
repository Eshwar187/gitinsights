-- Update subscription plans with new feature quotas

-- Add new quota columns to subscription_plans
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS max_code_reviews_monthly INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_ai_mentor_messages_monthly INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_coding_challenges_monthly INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_collaboration_rooms_monthly INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_collaboration_participants INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_collaboration_duration_hours INTEGER DEFAULT 2;

-- Update existing plans with new quotas
UPDATE subscription_plans 
SET max_code_reviews_monthly = 0,
    max_ai_mentor_messages_monthly = 0,
    max_coding_challenges_monthly = 0,
    max_collaboration_rooms_monthly = 0
WHERE name = 'free';

UPDATE subscription_plans 
SET max_code_reviews_monthly = 10,
    max_ai_mentor_messages_monthly = 50,
    max_coding_challenges_monthly = 5,
    max_collaboration_rooms_monthly = 3,
    max_collaboration_participants = 5,
    max_collaboration_duration_hours = 2
WHERE name = 'pro';

UPDATE subscription_plans 
SET max_code_reviews_monthly = -1, -- unlimited
    max_ai_mentor_messages_monthly = -1,
    max_coding_challenges_monthly = -1,
    max_collaboration_rooms_monthly = -1,
    max_collaboration_participants = 20,
    max_collaboration_duration_hours = -1
WHERE name = 'premium';

-- Add new usage fields to usage_tracking table
ALTER TABLE usage_tracking
ADD COLUMN IF NOT EXISTS code_reviews_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_mentor_messages_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS coding_challenges_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS collaboration_rooms_used INTEGER DEFAULT 0;

-- Create helper function to check feature quota
CREATE OR REPLACE FUNCTION check_feature_quota(
  p_user_id UUID,
  p_feature VARCHAR,
  OUT allowed BOOLEAN,
  OUT used INTEGER,
  OUT limit_value INTEGER,
  OUT reset_date DATE
)
AS $$
DECLARE
  v_plan_limits RECORD;
  v_current_usage INTEGER;
  v_month_start DATE;
BEGIN
  -- Get current month start
  v_month_start := DATE_TRUNC('month', CURRENT_DATE);
  reset_date := v_month_start + INTERVAL '1 month';
  
  -- Get user's subscription plan limits
  SELECT 
    CASE p_feature
      WHEN 'code_review' THEN sp.max_code_reviews_monthly
      WHEN 'ai_mentor' THEN sp.max_ai_mentor_messages_monthly
      WHEN 'coding_challenge' THEN sp.max_coding_challenges_monthly
      WHEN 'collaboration_room' THEN sp.max_collaboration_rooms_monthly
      ELSE 0
    END as feature_limit
  INTO v_plan_limits
  FROM users u
  LEFT JOIN user_subscriptions us ON us.user_id = u.id AND us.status = 'active'
  LEFT JOIN subscription_plans sp ON sp.id = us.plan_id
  WHERE u.id = p_user_id;
  
  -- If no subscription found, use free tier (0)
  limit_value := COALESCE(v_plan_limits.feature_limit, 0);
  
  -- -1 means unlimited
  IF limit_value = -1 THEN
    allowed := true;
    used := 0;
    RETURN;
  END IF;
  
  -- Get current month usage
  SELECT 
    CASE p_feature
      WHEN 'code_review' THEN COALESCE(code_reviews_used, 0)
      WHEN 'ai_mentor' THEN COALESCE(ai_mentor_messages_used, 0)
      WHEN 'coding_challenge' THEN COALESCE(coding_challenges_used, 0)
      WHEN 'collaboration_room' THEN COALESCE(collaboration_rooms_used, 0)
      ELSE 0
    END
  INTO v_current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND period_start >= v_month_start;
  
  used := COALESCE(v_current_usage, 0);
  allowed := used < limit_value;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to increment feature usage
CREATE OR REPLACE FUNCTION increment_feature_usage(
  p_user_id UUID,
  p_feature VARCHAR
)
RETURNS VOID AS $$
DECLARE
  v_month_start DATE;
  v_month_end DATE;
BEGIN
  v_month_start := DATE_TRUNC('month', CURRENT_DATE);
  v_month_end := v_month_start + INTERVAL '1 month';
  
  INSERT INTO usage_tracking (user_id, period_start, period_end)
  VALUES (p_user_id, v_month_start, v_month_end)
  ON CONFLICT (user_id, period_start) DO NOTHING;
  
  UPDATE usage_tracking
  SET 
    code_reviews_used = CASE WHEN p_feature = 'code_review' THEN code_reviews_used + 1 ELSE code_reviews_used END,
    ai_mentor_messages_used = CASE WHEN p_feature = 'ai_mentor' THEN ai_mentor_messages_used + 1 ELSE ai_mentor_messages_used END,
    coding_challenges_used = CASE WHEN p_feature = 'coding_challenge' THEN coding_challenges_used + 1 ELSE coding_challenges_used END,
    collaboration_rooms_used = CASE WHEN p_feature = 'collaboration_room' THEN collaboration_rooms_used + 1 ELSE collaboration_rooms_used END,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND period_start = v_month_start;
END;
$$ LANGUAGE plpgsql;
