# GitInsights Backend API

A comprehensive GitHub analytics platform backend built with Node.js, Express, and Supabase.

## Features

- 🔐 **Authentication**: Email/password and GitHub OAuth
- 📊 **GitHub Integration**: Sync repositories, commits, contributions, PRs, and issues
- 📈 **Analytics Engine**: Calculate developer scores (Activity, Quality, Impact, Collaboration, Consistency)
- 🤖 **AI Insights**: Hugging Face integration for profile summaries and recommendations
- 💼 **Portfolio Management**: Create customizable developer portfolios
- 💳 **Subscription System**: Razorpay integration with 3-tier pricing (Free, Pro, Premium)
- ⏰ **Background Jobs**: Automated data syncing and analytics recalculation
- 🔒 **Security**: JWT authentication, rate limiting, Row Level Security

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Passport.js (JWT + GitHub OAuth)
- **Payments**: Razorpay
- **AI**: Hugging Face API
- **Jobs**: node-cron
- **Logging**: Winston

## Prerequisites

- Node.js 18+ 
- Supabase account and project
- GitHub OAuth App credentials
- Razorpay account (for payments)
- Hugging Face API key (for AI features)

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your credentials:
   - Supabase URL and keys
   - GitHub OAuth credentials
   - Razorpay keys
   - Hugging Face API key
   - JWT secrets
   - SMTP settings (for password reset emails)

4. **Run database migrations**
   
   Execute the SQL migration files in order in your Supabase SQL editor:
   ```
   migrations/001_create_users.sql
   migrations/002_create_github_accounts.sql
   migrations/003_create_repositories.sql
   migrations/004_create_contributions.sql
   migrations/005_create_analytics.sql
   migrations/006_create_portfolios.sql
   migrations/007_create_subscriptions.sql
   migrations/008_create_indexes.sql
   migrations/009_enable_rls.sql
   migrations/010_helper_functions.sql
   ```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### GitHub Integration
- `GET /api/github/accounts` - List connected GitHub accounts
- `POST /api/github/sync` - Sync GitHub data
- `GET /api/github/accounts/:accountId/repositories` - Get repositories
- `GET /api/github/accounts/:accountId/contributions` - Get contribution heatmap
- `DELETE /api/github/accounts/:id` - Disconnect GitHub account

### Analytics
- `GET /api/analytics/accounts/:accountId/scores` - Get developer scores
- `POST /api/analytics/accounts/:accountId/scores/recalculate` - Recalculate scores
- `GET /api/analytics/accounts/:accountId/heatmap` - Get contribution heatmap
- `GET /api/analytics/accounts/:accountId/languages` - Get language statistics
- `GET /api/analytics/accounts/:accountId/badges` - Get earned badges
- `GET /api/analytics/accounts/:accountId/insights` - Get AI insights (Pro/Premium)
- `POST /api/analytics/accounts/:accountId/insights/regenerate` - Regenerate AI insights

### Portfolio
- `GET /api/portfolio/:slug` - Get public portfolio by slug
- `POST /api/portfolio` - Create portfolio
- `GET /api/portfolio/user/me` - Get user's portfolios
- `PUT /api/portfolio/:id` - Update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio
- `PATCH /api/portfolio/:id/visibility` - Toggle portfolio visibility

### Subscription
- `GET /api/subscription/plans` - Get all subscription plans
- `POST /api/subscription/subscribe` - Create subscription order
- `POST /api/subscription/verify` - Verify payment and activate subscription
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/current` - Get current subscription
- `GET /api/subscription/usage` - Get usage statistics
- `POST /api/subscription/webhook` - Razorpay webhook handler

## Background Jobs

The following cron jobs run automatically:

- **GitHub Sync**: Runs every hour, syncs data based on subscription tier
  - Free: Every 24 hours
  - Pro: Every 6 hours
  - Premium: Every 1 hour

- **Subscription Check**: Runs daily at midnight, checks for expired subscriptions

- **Analytics Recalculation**: Runs weekly on Sunday at 2 AM, recalculates all developer scores

## Subscription Tiers

### Free (₹0/month)
- 1 GitHub account
- Basic analytics
- Contribution heatmap
- Public portfolio
- Data syncs every 24 hours
- 3 months historical data

### Pro (₹199/month or ₹1,999/year)
- 3 GitHub accounts
- Advanced analytics
- 10 AI insights per month
- Data syncs every 6 hours
- 12 months historical data
- API access (100 calls/day)
- Remove branding

### Premium (₹499/month or ₹4,999/year)
- 10 GitHub accounts
- 100 AI insights per month
- Custom domain support
- Data syncs every 1 hour
- 36 months historical data
- Unlimited API access
- Priority support
- Team collaboration features

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- OAuth token encryption
- Rate limiting on all endpoints
- Row Level Security (RLS) in database
- CORS protection
- Helmet.js security headers
- Input validation with express-validator

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error
- `502` - External Service Error

## Development

**Install dev dependencies**:
```bash
npm install --save-dev nodemon
```

**Run with nodemon**:
```bash
npm run dev
```

## Testing

```bash
npm test
```

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `FRONTEND_URL` to your production frontend URL
3. Update `GITHUB_CALLBACK_URL` to your production callback URL
4. Ensure all environment variables are set
5. Run migrations on production database
6. Deploy to your hosting platform (Heroku, Railway, Render, etc.)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 5000) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Yes |
| `GITHUB_CALLBACK_URL` | GitHub OAuth callback URL | Yes |
| `RAZORPAY_KEY_ID` | Razorpay key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | Yes |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Yes |
| `ENCRYPTION_KEY` | 32-character encryption key | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASSWORD` | SMTP password | Yes |

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
