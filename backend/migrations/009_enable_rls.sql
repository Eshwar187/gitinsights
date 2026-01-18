-- Note: Row Level Security (RLS) policies are already defined in individual table migrations
-- This file serves as a reference and can be used to verify RLS is enabled

-- Verify RLS is enabled on all tables
DO $$
BEGIN
  -- Enable RLS on all tables if not already enabled
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE github_accounts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
  ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
  ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
END $$;

-- Create a helper function to get current user's subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(user_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
  tier VARCHAR;
BEGIN
  SELECT subscription_tier INTO tier
  FROM users
  WHERE id = user_uuid;
  
  RETURN COALESCE(tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to check feature access
CREATE OR REPLACE FUNCTION has_feature_access(user_uuid UUID, feature_name VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  tier VARCHAR;
  has_access BOOLEAN;
BEGIN
  tier := get_user_subscription_tier(user_uuid);
  
  -- Define feature access rules
  has_access := CASE
    WHEN tier = 'premium' THEN true
    WHEN tier = 'pro' AND feature_name IN ('ai_insights', 'advanced_analytics', 'api_access') THEN true
    WHEN tier = 'free' AND feature_name IN ('basic_analytics', 'heatmap', 'portfolio') THEN true
    ELSE false
  END;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
