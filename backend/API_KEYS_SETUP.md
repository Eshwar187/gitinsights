# API Keys & Credentials Setup Guide

This guide walks you through obtaining all the required API keys and credentials for the GitInsights backend.

---

## 1. Supabase (Database)

### What you need:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### How to get it:

1. **Sign up for Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub or email

2. **Create a new project**
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "gitinsights")
   - Create a strong database password
   - Select region (choose closest to your users)
   - Click "Create new project"

3. **Get your credentials**
   - Once project is created, go to **Settings** → **API**
   - Copy the following:
     - **Project URL** → `SUPABASE_URL`
     - **anon public** key → `SUPABASE_ANON_KEY`
     - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

4. **Run migrations**
   - Go to **SQL Editor** in Supabase dashboard
   - Copy and paste each migration file from `backend/migrations/` folder
   - Execute them in order (001 through 010)

**Cost**: Free tier includes 500MB database, 2GB bandwidth/month

---

## 2. GitHub OAuth App

### What you need:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`

### How to get it:

1. **Go to GitHub Developer Settings**
   - Visit [https://github.com/settings/developers](https://github.com/settings/developers)
   - Click **"OAuth Apps"** in the left sidebar
   - Click **"New OAuth App"**

2. **Fill in application details**
   - **Application name**: `GitInsights` (or your app name)
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Application description**: `GitHub Analytics Platform`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`

3. **Create the app**
   - Click **"Register application"**
   - You'll see your **Client ID** → `GITHUB_CLIENT_ID`
   - Click **"Generate a new client secret"**
   - Copy the secret immediately → `GITHUB_CLIENT_SECRET` (you won't see it again!)

4. **Set callback URL**
   - For development: `http://localhost:5000/api/auth/github/callback`
   - For production: `https://yourdomain.com/api/auth/github/callback`
   - Update this when you deploy

**Cost**: Free

**Important**: Keep your client secret secure! Never commit it to Git.

---

## 3. Razorpay (Payment Gateway)

### What you need:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

### How to get it:

1. **Sign up for Razorpay**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Click **"Sign Up"**
   - Fill in business details
   - Verify email and phone number

2. **Complete KYC (for production)**
   - For testing, you can skip this
   - For production, complete KYC verification

3. **Get API Keys**
   - Go to **Settings** → **API Keys**
   - Click **"Generate Test Key"** (for development)
   - You'll see:
     - **Key Id** → `RAZORPAY_KEY_ID`
     - **Key Secret** → `RAZORPAY_KEY_SECRET`

4. **Set up Webhook**
   - Go to **Settings** → **Webhooks**
   - Click **"Add New Webhook"**
   - **Webhook URL**: `http://localhost:5000/api/subscription/webhook` (for dev)
   - **Active Events**: Select all payment and subscription events
   - **Secret**: Generate and copy → `RAZORPAY_WEBHOOK_SECRET`

5. **For Production**
   - Switch to **Live Mode** in dashboard
   - Generate **Live API Keys**
   - Update webhook URL to production domain
   - Complete KYC verification

**Cost**: 
- Free to set up
- Transaction fees: 2% per transaction (standard pricing)

**Test Cards**:
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 4. Hugging Face (AI)

### What you need:
- `HUGGINGFACE_API_KEY`

### How to get it:

1. **Sign up for Hugging Face**
   - Go to [https://huggingface.co](https://huggingface.co)
   - Click **"Sign Up"**
   - Create account with email or GitHub

2. **Generate API Token**
   - Click your profile picture → **Settings**
   - Go to **Access Tokens** section
   - Click **"New token"**
   - **Name**: `GitInsights API`
   - **Role**: Select **"Read"** (sufficient for API inference)
   - Click **"Generate token"**
   - Copy the token → `HUGGINGFACE_API_KEY`

3. **Test the API** (optional)
   ```bash
   curl https://api-inference.huggingface.co/models/facebook/bart-large-cnn \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"inputs": "Test"}'
   ```

**Cost**: 
- Free tier: 30,000 requests/month
- Rate limit: ~1 request/second
- Upgrade for higher limits if needed

**Alternative Models** (if you want to change):
- `facebook/bart-large-cnn` - Text summarization
- `gpt2` - Text generation
- `distilbert-base-uncased` - Text classification

---

## 5. SMTP Email (Password Reset)

### What you need:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_FROM`

### Option A: Gmail (Easiest for Development)

1. **Enable 2-Factor Authentication**
   - Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable **2-Step Verification**

2. **Generate App Password**
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select **"Mail"** and **"Other"**
   - Name it "GitInsights"
   - Click **"Generate"**
   - Copy the 16-character password → `SMTP_PASSWORD`

3. **Set environment variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=GitInsights <your-email@gmail.com>
   ```

**Cost**: Free

### Option B: SendGrid (Better for Production)

1. **Sign up**: [https://sendgrid.com](https://sendgrid.com)
2. **Create API Key**: Settings → API Keys → Create API Key
3. **Set variables**:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=GitInsights <noreply@yourdomain.com>
   ```

**Cost**: Free tier includes 100 emails/day

### Option C: Mailgun, AWS SES, etc.
Similar process - get SMTP credentials from their dashboard.

---

## 6. JWT Secrets (Self-Generated)

### What you need:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ENCRYPTION_KEY`

### How to generate:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
- Visit [https://www.random.org/strings/](https://www.random.org/strings/)
- Generate 64-character random strings

**Set in .env**:
```env
JWT_SECRET=your-64-char-random-string-1
JWT_REFRESH_SECRET=your-64-char-random-string-2
ENCRYPTION_KEY=your-32-char-random-string-3
```

**Important**: 
- Use different secrets for each
- Never share or commit these
- `ENCRYPTION_KEY` must be exactly 32 characters

---

## Complete .env File Example

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
JWT_REFRESH_EXPIRES_IN=30d

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Hugging Face
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=GitInsights <your-email@gmail.com>

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## Quick Setup Checklist

- [ ] Create Supabase project and get credentials
- [ ] Run all 10 database migrations in Supabase SQL editor
- [ ] Create GitHub OAuth App and get client ID/secret
- [ ] Sign up for Razorpay and get test API keys
- [ ] Create Hugging Face account and generate API token
- [ ] Set up Gmail App Password or SendGrid for emails
- [ ] Generate JWT secrets and encryption key
- [ ] Copy `.env.example` to `.env` and fill in all values
- [ ] Test connection: `npm run dev`

---

## Testing Your Setup

1. **Test Database Connection**
   ```bash
   npm run dev
   # Should see: ✅ Database connection successful
   ```

2. **Test Authentication**
   ```bash
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
   ```

3. **Test GitHub OAuth**
   - Visit: `http://localhost:5000/api/auth/github`
   - Should redirect to GitHub login

4. **Test Razorpay**
   - Use test mode keys
   - Test card: 4111 1111 1111 1111

---

## Production Deployment

When deploying to production:

1. **Update URLs**:
   - `FRONTEND_URL` → Your production frontend URL
   - `GITHUB_CALLBACK_URL` → Production callback URL
   - `API_URL` → Production API URL

2. **Switch to Production Keys**:
   - Razorpay: Switch from test to live keys
   - GitHub OAuth: Update callback URL in GitHub app settings

3. **Secure Secrets**:
   - Use environment variables in hosting platform
   - Never commit `.env` file
   - Rotate secrets periodically

4. **Set NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

---

## Troubleshooting

### Supabase Connection Failed
- Check if project URL is correct
- Verify service role key (not anon key) is used
- Ensure migrations are run

### GitHub OAuth Not Working
- Verify callback URL matches exactly
- Check client secret is correct
- Ensure app is not suspended

### Razorpay Payments Failing
- Confirm you're using test keys in development
- Check webhook URL is accessible
- Verify webhook secret matches

### Hugging Face API Errors
- Check API token is valid
- Verify you haven't exceeded rate limits
- Try a different model if one is unavailable

### Email Not Sending
- For Gmail: Ensure 2FA is enabled and app password is used
- Check SMTP credentials
- Verify port 587 is not blocked

---

## Cost Summary

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Supabase** | 500MB DB, 2GB bandwidth | From $25/month |
| **GitHub OAuth** | Unlimited | Free |
| **Razorpay** | Free setup | 2% per transaction |
| **Hugging Face** | 30K requests/month | From $9/month |
| **Gmail SMTP** | Free | Free |
| **SendGrid** | 100 emails/day | From $15/month |

**Total for Development**: ₹0 (all free tiers)

---

## Need Help?

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **GitHub OAuth**: [docs.github.com/apps/oauth-apps](https://docs.github.com/apps/oauth-apps)
- **Razorpay**: [razorpay.com/docs](https://razorpay.com/docs)
- **Hugging Face**: [huggingface.co/docs](https://huggingface.co/docs)
