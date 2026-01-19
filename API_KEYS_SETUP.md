# GitInsights - Complete API Keys Setup Guide

This guide walks you through getting ALL the API keys needed for GitInsights and exactly where to put them.

---

## 📋 Required Services (6 Total)

1. **Supabase** (Database) - FREE
2. **GitHub OAuth** (Authentication) - FREE
3. **Razorpay** (Payments) - FREE tier available
4. **Hugging Face** (AI Features) - FREE
5. **SMTP Email** (Optional) - Gmail works
6. **JWT Secrets** (Generate yourself) - FREE

---

## 1. Supabase (Database)

### Get Your Keys (5 minutes)

**Step 1: Create Account**
- Go to: https://supabase.com
- Click "Start your project"
- Sign up with GitHub (recommended)

**Step 2: Create Project**
- Click "New Project"
- Name: `gitinsights`
- Database Password: **Save this!** (generate strong password)
- Region: Choose closest to you
- Click "Create new project" (takes ~2 minutes)

**Step 3: Get API Keys**
- Once project ready, go to **Settings** (left sidebar)
- Click **API** section
- Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (show & copy)
```

### Where to Put Them

**File: `backend/.env` or `backend/.env.production`**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT**: After getting keys, run the database migrations:
- Go to SQL Editor in Supabase
- Execute files `001_create_users.sql` through `016_update_subscriptions.sql` in order

---

## 2. GitHub OAuth (Authentication)

### Get Your Keys (3 minutes)

**Step 1: Create OAuth App**
- Go to: https://github.com/settings/developers
- Click **"OAuth Apps"** tab
- Click **"New OAuth App"**

**Step 2: Fill Details**

**For Development**:
```
Application name: GitInsights Dev
Homepage URL: http://localhost:5173
Authorization callback URL: http://localhost:5000/api/auth/github/callback
```

**For Production**:
```
Application name: GitInsights
Homepage URL: https://yourdomain.com
Authorization callback URL: https://api.yourdomain.com/api/auth/github/callback
```

**Step 3: Get Keys**
- Click "Register application"
- You'll see:
  - **Client ID**: `Iv1.a1b2c3d4e5f6g7h8`
  - Click **"Generate a new client secret"**
  - **Client Secret**: `1234567890abcdef...` (copy immediately!)

### Where to Put Them

**File: `backend/.env`**
```env
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=1234567890abcdef...
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

**File: `backend/.env.production`**
```env
GITHUB_CLIENT_ID=Iv1.PRODUCTION_CLIENT_ID
GITHUB_CLIENT_SECRET=PRODUCTION_SECRET
GITHUB_CALLBACK_URL=https://api.yourdomain.com/api/auth/github/callback
```

---

## 3. Razorpay (Payments)

### Get Your Keys (5 minutes)

**Step 1: Create Account**
- Go to: https://razorpay.com
- Click "Sign Up"
- Choose "India" as country
- Complete verification (may take 1-2 days for live account)

**Step 2: Get Test Keys** (Immediate)
- Login to dashboard: https://dashboard.razorpay.com
- **Toggle to "Test Mode"** (top left switch)
- Go to **Settings** → **API Keys**
- Click **"Generate Test Key"** if not already generated
- Save both:
  - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
  - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxx`

**Step 3: Get Webhook Secret**
- Go to **Settings** → **Webhooks**
- Click **"+ Create New Webhook"**
- Webhook URL: `https://api.yourdomain.com/api/subscription/webhook`
- Select events: `payment.authorized`, `subscription.charged`, `subscription.cancelled`
- Click **"Create Webhook"**
- Copy **Webhook Secret**: `whsec_xxxxxxxxxxxxx`

### Where to Put Them

**File: `backend/.env` (Test Mode)**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**File: `backend/.env.production` (Live Mode)**
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**💡 TIP**: Start with test mode for development. Switch to live keys only when ready for production.

---

## 4. Hugging Face (AI Features)

### Get Your Key (2 minutes)

**Step 1: Create Account**
- Go to: https://huggingface.co/join
- Sign up (free)

**Step 2: Get API Token**
- Go to: https://huggingface.co/settings/tokens
- Click **"New token"**
- Name: `GitInsights`
- Type: **Read**
- Click **"Generate token"**
- Copy token: `hf_xxxxxxxxxxxxxxxxxxxxxxxxx`

### Where to Put It

**File: `backend/.env`**
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxx
```

**Same for production** (`backend/.env.production`)

---

## 5. SMTP Email (Password Reset - Optional)

You have two options:

### Option A: Gmail (Easiest)

**Step 1: Enable 2-Factor Auth**
- Go to: https://myaccount.google.com/security
- Enable 2-Step Verification

**Step 2: Create App Password**
- Go to: https://myaccount.google.com/apppasswords
- Select app: **Mail**
- Select device: **Other** (name it "GitInsights")
- Click **Generate**
- Copy 16-character password: `abcd efgh ijkl mnop`

**Where to Put:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=GitInsights <your.email@gmail.com>
```

### Option B: Skip (Not Required for MVP)

Leave empty or comment out:
```env
# EMAIL_HOST=
# EMAIL_PORT=
# EMAIL_USER=
# EMAIL_PASSWORD=
```

---

## 6. JWT Secrets (Generate Yourself)

### Generate Strong Secrets

**Run these commands in terminal:**

```bash
# JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...

# JWT Refresh Secret (different from above)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6...

# Encryption Key (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Output: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### Where to Put Them

**File: `backend/.env`**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
JWT_REFRESH_SECRET=x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6...
ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

**⚠️ CRITICAL**: Use **different** secrets in production!

---

## Complete Environment Files

### Backend `.env` (Development)

```env
# Node Environment
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database (Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secrets
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
JWT_REFRESH_SECRET=x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6...

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=1234567890abcdef...
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Hugging Face
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxx

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=GitInsights <your.email@gmail.com>

# Encryption
ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### Frontend `.env` (Development)

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

---

## Quick Setup Steps

### 1. Copy Example Files
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp .env.example .env
```

### 2. Fill in API Keys
Open each `.env` file and fill in the keys you obtained above.

### 3. Verify Setup
```bash
# Backend
cd backend
npm run dev
# Should start without errors

# Frontend
npm run dev
# Should start on http://localhost:5173
```

---

## Verification Checklist

- [ ] Supabase: Can connect to database
- [ ] GitHub OAuth: Can click "Connect with GitHub" and login
- [ ] Razorpay: Can view subscription plans
- [ ] Hugging Face: AI features work (code review, mentor)
- [ ] SMTP: Password reset emails send (optional)
- [ ] JWT: Can login and token works

---

## Troubleshooting

### "Supabase connection failed"
- Check URL format: `https://xxxxx.supabase.co`
- Verify anon and service role keys are different
- Run database migrations

### "GitHub OAuth redirect error"
- Verify callback URL exactly matches: `http://localhost:5000/api/auth/github/callback`
- Check client ID and secret are correct
- Ensure app is registered in GitHub settings

### "Razorpay initialization failed"
- Confirm you're in test mode
- Check key format: `rzp_test_` for test, `rzp_live_` for production
- Verify both key ID and secret are present

### "AI features not working"
- Check Hugging Face token starts with `hf_`
- Verify token has read permissions
- Check rate limits (free tier: 1000 requests/day)

---

## Security Reminders

✅ **DO**:
- Keep `.env` files in `.gitignore`
- Use different secrets for dev and production
- Rotate secrets regularly
- Use environment variables, never hardcode

❌ **DON'T**:
- Commit `.env` files to git
- Share API keys publicly
- Use production keys in development
- Reuse the same JWT secret everywhere

---

## Cost Summary

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Supabase | 500MB DB, 50MB files | $25/month |
| GitHub OAuth | Unlimited | Free |
| Razorpay | Test mode free | 2% + GST per transaction |
| Hugging Face | 1000 requests/day | $9-30/month |
| Gmail SMTP | 500 emails/day | Free |

**Total cost to start**: **₹0** (Everything has a free tier!)

---

## Need Help?

1. Check error logs: `npm run dev` output
2. Verify all keys are filled in `.env`
3. Restart servers after changing `.env`
4. Check the service dashboard for API key status

**You're all set!** 🎉
