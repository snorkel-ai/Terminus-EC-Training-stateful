# Supabase Setup Guide

## Architecture Overview

This app follows the [official Supabase auth patterns](https://supabase.com/docs/guides/auth/quickstarts/react).

### Data Model

**Three-tier structure:**

1. **`auth.users`** (Supabase-managed)
   - Authentication data (email, encrypted password)
   - OAuth provider data (GitHub)
   - Metadata: `raw_user_meta_data` for custom fields

2. **`public.profiles`** (our table)
   - Extended user profile (username, avatar)
   - Foreign key to `auth.users.id`
   - Auto-created by database trigger on signup

3. **`public.user_progress`** (our table)
   - Tracks which training items user completed
   - Foreign key to `auth.users.id`

### Why `profiles` not `users`?

**Supabase naming convention:**
- `auth.users` is reserved for Supabase Auth
- Custom tables should use different names (`profiles`, `customers`, etc.)
- Avoids confusion and naming conflicts

**Benefits:**
- Clear separation: auth data vs profile data
- Follows Supabase official examples
- Easier for other developers to understand

## Admin Access Pattern

**Admin status is stored in `auth.users.raw_user_meta_data`:**

```sql
-- Set admin via Supabase metadata (proper way)
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
WHERE email = 'admin@example.com';
```

**Check admin in frontend:**
```javascript
const isAdmin = session?.user?.user_metadata?.is_admin || false;
```

**Why not a column in profiles table?**
- Avoids RLS recursion issues
- Supabase manages auth.users security
- Can't be modified by user (only via service_role)
- Cleaner architecture

## RLS Policies Explained

**Simple policies with ZERO recursion:**

```sql
-- Profiles: Users see only their own
CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (auth.uid() = id);
```

**Why this works:**
- `auth.uid()` is a Postgres function (not a table query)
- Returns current user's ID from JWT
- No table lookups = no recursion possible

**Admin access:**
- Admins query `v_admin_user_stats` view
- View uses `SECURITY DEFINER` to bypass RLS
- No policies needed on profiles table for admin access

## Trigger Auto-Creates Profiles

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**What it does:**
1. User signs up via GitHub OAuth
2. Supabase creates record in `auth.users`
3. Trigger fires automatically
4. Profile created in `profiles` table
5. No frontend code needed!

**Edge cases handled:**
- Missing GitHub username → uses email prefix
- Concurrent signups → `ON CONFLICT DO UPDATE`
- Null values → `COALESCE` provides defaults

## Clean Migration History

Only 2 migrations:

1. **`20241105000001_core_schema_v2.sql`**
   - Creates tables (profiles, progress_items, user_progress)
   - Adds triggers (auto-profile-creation, updated_at)
   - Enables RLS with simple policies
   - Fully commented and documented

2. **`20241105000002_seed_data_and_views.sql`**
   - Seeds 19 progress items
   - Creates admin views
   - Grants permissions

**Previous approach (wrong):**
- 7+ migration files with trial-and-error
- Complex RLS policies causing recursion
- No clear architecture

**Current approach (right):**
- 2 clean, well-documented migrations
- Follows Supabase official patterns
- Production-ready from day 1

## Troubleshooting

### Issue: Login hangs for 10 seconds

**Cause:** Browser cache has old schema/session data

**Solution:**
1. Open Chrome DevTools (F12)
2. Application tab → Storage → Clear site data
3. Hard refresh (Cmd+Shift+R)
4. Try login again

### Issue: "Profile not found" error

**Cause:** Trigger didn't fire (rare)

**Solution:**
```javascript
// Fallback in AuthContext (already implemented)
if (!profile && user) {
  await supabase.from('profiles').insert({
    id: user.id,
    email: user.email
  });
}
```

### Issue: Admin dashboard not accessible

**Cause:** Admin status not set

**Solution:**
```sql
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';
```

Then refresh browser to get new session with updated metadata.

## Security Notes

**RLS is properly enabled:**
- All tables have RLS enabled
- Simple policies with no recursion
- Users can only access their own data
- Admins use views (not policies) for full access

**Admin protection:**
- Admin status in `auth.users` (Supabase-managed)
- Can only be set via service_role key (not anon key)
- Users cannot self-assign admin

**Safe practices:**
- Never expose service_role key to frontend
- Always use anon key in `.env.local`
- RLS protects data even if frontend has bugs

## Verification Checklist

Run these via Supabase MCP to verify setup:

```javascript
// Check tables exist with RLS
mcp_supabase_list_tables({
  project_id: "ntmiycfydldoremofrbf",
  schemas: ["public"]
})
// Expected: profiles, progress_items, user_progress (all RLS enabled)

// Check progress items seeded
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf",
  query: "SELECT COUNT(*) FROM progress_items;"
})
// Expected: 19

// Check trigger exists
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf",
  query: "SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';"
})
// Expected: 1 row

// Check your profile exists
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf",
  query: "SELECT * FROM profiles WHERE email = 'your-email@example.com';"
})
// Expected: 1 row with your GitHub data
```

## MCP Operations Reference

All database operations done via [Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp):

- `mcp_supabase_list_tables` - List all tables
- `mcp_supabase_execute_sql` - Run SQL queries
- `mcp_supabase_apply_migration` - Apply migration files
- `mcp_supabase_list_migrations` - See migration history

**Safety:**
- All operations require manual approval in Cursor
- Project scoped to prevent accidents
- Development environment only
- Fully logged and repeatable

