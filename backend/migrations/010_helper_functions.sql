-- Helper function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_period_start DATE,
  p_period_end DATE,
  p_field VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, period_start, period_end, ai_insights_used, api_calls_used)
  VALUES (
    p_user_id,
    p_period_start,
    p_period_end,
    CASE WHEN p_field = 'ai_insights_used' THEN 1 ELSE 0 END,
    CASE WHEN p_field = 'api_calls_used' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    ai_insights_used = CASE 
      WHEN p_field = 'ai_insights_used' THEN usage_tracking.ai_insights_used + 1
      ELSE usage_tracking.ai_insights_used
    END,
    api_calls_used = CASE 
      WHEN p_field = 'api_calls_used' THEN usage_tracking.api_calls_used + 1
      ELSE usage_tracking.api_calls_used
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Helper function to increment portfolio views
CREATE OR REPLACE FUNCTION increment_portfolio_views(p_slug VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE portfolios
  SET view_count = view_count + 1
  WHERE slug = p_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old data based on subscription tier
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
  retention_months INTEGER;
BEGIN
  FOR user_record IN
    SELECT id, subscription_tier FROM users WHERE deleted_at IS NULL
  LOOP
    -- Determine retention period based on tier
    retention_months := CASE user_record.subscription_tier
      WHEN 'free' THEN 3
      WHEN 'pro' THEN 12
      WHEN 'premium' THEN 36
      ELSE 3
    END;
    
    -- Delete old contributions
    DELETE FROM contributions
    WHERE github_account_id IN (
      SELECT id FROM github_accounts WHERE user_id = user_record.id
    )
    AND contribution_date < NOW() - (retention_months || ' months')::INTERVAL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
