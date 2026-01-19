# Supabase SQL Editor - Migration Guide

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"**

### 2. Run Migrations IN ORDER (Important!)

Copy and paste each file's contents into the SQL Editor and click **"RUN"**.

**Run these files in this exact order:**

#### ✅ Step 1: Core Tables
```
001_create_users.sql
002_create_github_accounts.sql
003_create_repositories.sql
004_create_contributions.sql
005_create_analytics.sql
006_create_portfolios.sql
```

#### ✅ Step 2: Subscription System
```
007_create_subscriptions.sql
```

#### ✅ Step 3: Performance & Security
```
008_create_indexes.sql
009_enable_rls.sql
010_create_migration_tracking.sql
```

#### ✅ Step 4: Extended Features
```
011_create_code_reviews.sql
012_create_coding_activity.sql
013_create_skill_tree.sql
014_create_ai_mentor.sql
015_create_collaboration.sql
016_update_subscriptions.sql
```

---

## Detailed Steps

### For Each Migration File:

1. **Open the file** in your code editor (VS Code)
   - Location: `backend/migrations/001_create_users.sql`

2. **Select ALL content** (Ctrl+A)

3. **Copy** (Ctrl+C)

4. **Go to Supabase SQL Editor**

5. **Paste** (Ctrl+V)

6. **Click "RUN"** button (bottom right)

7. **Wait for success** ✅ message

8. **Repeat** for next file

---

## Quick Copy Commands

If you prefer command line, navigate to migrations folder:

```bash
cd backend/migrations
```

Then copy each file one by one:

**File 001:**
```sql
-- Copy contents of 001_create_users.sql into Supabase SQL Editor
-- Then click RUN
```

Repeat for files 002 through 016.

---

## Verification

After running all migrations, verify in Supabase:

### Check Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see **36+ tables**:
   - users
   - github_accounts
   - repositories
   - contributions
   - analytics
   - portfolios
   - subscription_plans (with 3 rows)
   - user_subscriptions
   - payment_records
   - usage_tracking
   - coding_activity
   - skills_master (with 43 rows)
   - user_skills
   - skill_achievements
   - code_reviews
   - coding_sessions
   - ai_conversations
   - coding_challenges
   - collaboration_rooms
   - room_participants
   - ... and more

### Check RLS Enabled
1. Click on any table
2. Check that **RLS is enabled** (shield icon)

### Check Functions Created
1. Go to **Database** → **Functions**
2. Should see:
   - `check_tier_limit()`
   - `get_user_tier()`
   - `check_feature_quota()`
   - `increment_feature_usage()`

---

## Common Issues & Solutions

### ❌ Error: "relation already exists"
**Solution**: Table already created. Skip that migration or drop table first:
```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

### ❌ Error: "permission denied"
**Solution**: Make sure you're using the SQL Editor in Supabase (it has admin permissions automatically)

### ❌ Error: "syntax error"
**Solution**: 
- Check you copied the ENTIRE file contents
- No extra characters at start/end
- Run one migration at a time

### ❌ Migration fails in middle
**Solution**:
1. Check error message
2. Fix the issue
3. Re-run from the failed migration
4. Continue with remaining migrations

---

## After Migration Success

You should see:

✅ **36+ tables** created  
✅ **RLS enabled** on all tables  
✅ **4+ functions** created  
✅ **3 subscription plans** inserted (Free, Pro, Premium)  
✅ **43 skills** inserted in `skills_master`  
✅ **Indexes** created for performance  

**Your database is ready!** 🎉

---

## What Each Migration Does

| File | Creates | Purpose |
|------|---------|---------|
| 001 | users | User accounts & auth |
| 002 | github_accounts | Linked GitHub profiles |
| 003 | repositories | User's repos |
| 004 | contributions | Daily activity |
| 005 | analytics | Developer scores |
| 006 | portfolios | Portfolio pages |
| 007 | subscriptions | Plans & payments |
| 008 | indexes | Performance |
| 009 | RLS | Security policies |
| 010 | migrations | Track migrations |
| 011 | code_reviews | AI code review |
| 012 | coding_activity | Activity heatmap |
| 013 | skill_tree | Skills system |
| 014 | ai_mentor | AI chat & challenges |
| 015 | collaboration | Real-time collab |
| 016 | quota updates | Feature limits |

---

## Total Tables: 36+

After all migrations, you'll have these tables:

**Core (6)**: users, github_accounts, repositories, contributions, analytics, portfolios

**Subscriptions (4)**: subscription_plans, user_subscriptions, payment_records, usage_tracking

**Code Review (1)**: code_reviews

**Activity (2)**: coding_activity, daily_activity_summary (view)

**Skills (3)**: skills_master, user_skills, skill_achievements

**AI Mentor (7)**: coding_sessions, ai_conversations, coding_challenges, learning_paths, code_explanations, debugging_sessions, user_progress_tracking

**Collaboration (11)**: collaboration_rooms, room_participants, collaborative_documents, code_changes_log, chat_messages, cursor_positions, whiteboard_data, voice_channels, room_recordings, code_execution_results, room_templates

**Tracking (1)**: schema_migrations

---

**Ready to run?** Just open Supabase SQL Editor and paste each file! 🚀
