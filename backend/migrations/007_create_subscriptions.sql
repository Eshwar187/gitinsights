-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Plan details
  name VARCHAR(100) NOT NULL UNIQUE, -- free, pro, premium
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Pricing
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  
  -- Features and limits
  features JSONB DEFAULT '{}',
  max_github_accounts INTEGER DEFAULT 1,
  max_ai_insights_monthly INTEGER DEFAULT 0,
  max_api_calls_daily INTEGER DEFAULT 0,
  sync_frequency_hours INTEGER DEFAULT 24,
  historical_data_months INTEGER DEFAULT 3,
  custom_domain BOOLEAN DEFAULT false,
  remove_branding BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, features, max_github_accounts, max_ai_insights_monthly, max_api_calls_daily, sync_frequency_hours, historical_data_months, custom_domain, remove_branding, priority_support)
VALUES
  ('free', 'Free', 'Perfect for getting started', 0, 0, 
   '{"heatmap": true, "languageBreakdown": true, "publicPortfolio": true, "communitySupport": true}'::jsonb,
   1, 0, 0, 24, 3, false, false, false),
  
  ('pro', 'Pro', 'Most popular for serious developers', 199, 1999,
   '{"advancedAnalytics": true, "aiInsights": true, "commitQuality": true, "ranking": true, "apiAccess": true, "emailSupport": true}'::jsonb,
   3, 10, 100, 6, 12, false, true, false),
  
  ('premium', 'Premium', 'Everything you need at scale', 499, 4999,
   '{"teamCollaboration": true, "customDomain": true, "unlimitedAPI": true, "prioritySupport": true, "dataExport": true, "advancedTeamInsights": true}'::jsonb,
   10, 100, 999999, 1, 36, true, true, true);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  
  -- Subscription details
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired, past_due
  billing_cycle VARCHAR(50) NOT NULL, -- monthly, yearly
  
  -- Razorpay details
  razorpay_subscription_id VARCHAR(255) UNIQUE,
  razorpay_plan_id VARCHAR(255),
  razorpay_customer_id VARCHAR(255),
  
  -- Period
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint: one active subscription per user
  UNIQUE(user_id, status)
);

-- Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL, -- pending, success, failed, refunded
  
  -- Razorpay details
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_order_id VARCHAR(255),
  razorpay_signature VARCHAR(500),
  
  -- Invoice
  invoice_url VARCHAR(500),
  invoice_number VARCHAR(100),
  
  -- Metadata
  payment_method VARCHAR(100),
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Usage counters (reset monthly)
  ai_insights_used INTEGER DEFAULT 0,
  api_calls_used INTEGER DEFAULT 0,
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(user_id, period_start)
);

-- Create indexes
CREATE INDEX idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);

-- Create updated_at triggers
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_records_updated_at
BEFORE UPDATE ON payment_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
BEFORE UPDATE ON usage_tracking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own payment records"
  ON payment_records FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own usage tracking"
  ON usage_tracking FOR SELECT
  USING (user_id = auth.uid());
