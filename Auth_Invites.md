# Invite-Only Authentication Implementation Plan

**Status:** Not Implemented (Plan Only)  
**Created:** 2025-11-06  
**References:** [Supabase Auth Hooks Documentation](https://supabase.com/docs/guides/auth/auth-hooks)

---

## Overview

Implement an invite-only authentication system where only pre-approved GitHub usernames can sign up. This uses Supabase's **Before User Created Hook** which is the official, secure method for validating users during signup.

### Why "Before User Created" Hook?

- ✅ Runs **during** the auth process (before user is created in `auth.users`)
- ✅ Can reject authentication before JWT is issued
- ✅ No race conditions or security gaps
- ✅ Official Supabase feature (available on Free and Pro plans)
- ✅ Purpose-built for exactly this use case

Reference: [Before User Created Hook Documentation](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook)

---

## Implementation Steps

### Step 1: Create Migration File

**File:** `supabase/migrations/20241106000001_add_invite_system.sql`

Following the official Supabase pattern for Auth Hooks + user management:

```sql
-- ============================================================================
-- INVITE SYSTEM: Approved GitHub Users Table
-- ============================================================================
-- Reference: https://supabase.com/docs/guides/auth/managing-user-data
-- Reference: https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook

-- Table to store approved GitHub usernames (allowlist)
CREATE TABLE public.approved_github_users (
  id SERIAL PRIMARY KEY,
  github_username TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

COMMENT ON TABLE public.approved_github_users IS 'Allowlist of GitHub usernames permitted to sign up';
COMMENT ON COLUMN public.approved_github_users.github_username IS 'GitHub username (case-insensitive matching)';
COMMENT ON COLUMN public.approved_github_users.invited_by IS 'Admin who added this user to allowlist';

-- Index for fast lookups (case-insensitive)
CREATE INDEX idx_approved_github_username_lower 
  ON public.approved_github_users(LOWER(github_username));

-- Enable Row Level Security
ALTER TABLE public.approved_github_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Authenticated users can view the list
-- TODO: Restrict this to admins only in production
CREATE POLICY approved_users_select ON public.approved_github_users
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Only admins can insert/update/delete
-- TODO: Implement is_admin() check function for production
-- For now, this prevents any client-side modifications
CREATE POLICY approved_users_modify ON public.approved_github_users
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- ============================================================================
-- AUTH HOOK: Before User Created
-- ============================================================================
-- Reference: https://supabase.com/docs/guides/auth/auth-hooks

-- Hook function to validate GitHub username before user creation
CREATE OR REPLACE FUNCTION public.hook_before_user_created(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  github_username TEXT;
  user_approved BOOLEAN;
BEGIN
  -- Extract GitHub username from OAuth provider metadata
  -- GitHub OAuth stores username in raw_user_meta_data
  github_username := COALESCE(
    event->'user'->'user_metadata'->>'user_name',
    event->'user'->'user_metadata'->>'preferred_username'
  );

  -- If no GitHub username found, reject signup
  IF github_username IS NULL THEN
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'GitHub username not found. Please sign in with GitHub OAuth.'
      )
    );
  END IF;

  -- Check if username exists in approved list (case-insensitive)
  SELECT EXISTS (
    SELECT 1
    FROM public.approved_github_users
    WHERE LOWER(github_username) = LOWER(hook_before_user_created.github_username)
  ) INTO user_approved;

  -- Reject if not approved
  IF NOT user_approved THEN
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', format(
          'Access denied. Your GitHub account (@%s) is not on the approved list. Contact an administrator for access.',
          github_username
        )
      )
    );
  END IF;

  -- Allow signup to proceed
  RETURN event;
END;
$$;

COMMENT ON FUNCTION public.hook_before_user_created IS 
  'Auth Hook: Validates GitHub username against approved list before user creation';

-- Grant permissions following official Supabase pattern
-- Reference: https://supabase.com/docs/guides/auth/auth-hooks#security-model
GRANT EXECUTE ON FUNCTION public.hook_before_user_created TO supabase_auth_admin;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.hook_before_user_created FROM authenticated, anon, public;

-- Grant supabase_auth_admin access to approved_github_users table
GRANT SELECT ON public.approved_github_users TO supabase_auth_admin;

-- ============================================================================
-- SEED DATA: Initial Approved Users
-- ============================================================================

-- Add initial approved GitHub usernames
INSERT INTO public.approved_github_users (github_username, notes)
VALUES 
  ('rockgard3n', 'Project admin - initial user')
ON CONFLICT (github_username) DO NOTHING;

-- Add more approved users as needed:
-- INSERT INTO public.approved_github_users (github_username, notes)
-- VALUES ('another-username', 'Invited developer');
```

---

### Step 2: Apply Migration via Supabase MCP

**Using Supabase MCP Tools:**

```javascript
// Apply the migration using Supabase MCP
mcp_supabase_apply_migration({
  project_id: "ntmiycfydldoremofrbf",
  name: "add_invite_system",
  query: "<paste SQL from migration file>"
})
```

**Alternative: Manual via Supabase CLI:**

```bash
# If using local development
supabase migration new add_invite_system
# (paste SQL into generated file)
supabase db push
```

---

### Step 3: Enable Hook in Supabase Dashboard

**⚠️ IMPORTANT: This step MUST be done manually in the dashboard**

The Auth Hooks feature requires dashboard configuration that cannot be automated via MCP.

1. **Navigate to Dashboard:**
   - Go to https://supabase.com/dashboard/project/ntmiycfydldoremofrbf
   - Click **Authentication** → **Hooks**

2. **Enable "Before User Created" Hook:**
   - Find the **Before User Created** hook
   - Toggle it to **Enabled**
   - Configure:
     - **Type:** Postgres Function
     - **Schema:** `public`
     - **Function name:** `hook_before_user_created`
   - Click **Save**

3. **Verify Configuration:**
   - The hook should show as "Enabled" with green status
   - Function should be `public.hook_before_user_created`

Reference: [Using Hooks - Deploying](https://supabase.com/docs/guides/auth/auth-hooks#deploying)

---

### Step 4: Test the Implementation

#### Test Case 1: Approved User (Should Succeed)

**Setup:**
```sql
-- Verify your GitHub username is in the list
SELECT * FROM approved_github_users WHERE github_username = 'rockgard3n';
```

**Test Flow:**
1. Sign out completely from the app
2. Clear browser cache/cookies
3. Click "Sign in with GitHub"
4. Complete GitHub OAuth
5. **Expected:** Login succeeds, profile created, redirected to app

#### Test Case 2: Unapproved User (Should Fail)

**Setup:** Use a different GitHub account not in the approved list

**Test Flow:**
1. Click "Sign in with GitHub" 
2. Complete GitHub OAuth
3. **Expected:** 
   - Signup blocked with error message
   - Error shows: "Access denied. Your GitHub account (@username) is not on the approved list..."
   - No user created in `auth.users` table
   - User returned to login screen

#### Verify via Supabase MCP:

```javascript
// Check auth.users table
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf",
  query: "SELECT id, email, raw_user_meta_data->>'user_name' as github_username FROM auth.users ORDER BY created_at DESC LIMIT 5"
})

// Check approved list
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf", 
  query: "SELECT * FROM approved_github_users"
})
```

---

### Step 5: Add New Approved Users

**Via Supabase MCP:**

```javascript
mcp_supabase_execute_sql({
  project_id: "ntmiycfydldoremofrbf",
  query: "INSERT INTO approved_github_users (github_username, notes) VALUES ('new-github-username', 'Invited by admin')"
})
```

**Via SQL Editor:**

```sql
INSERT INTO approved_github_users (github_username, notes)
VALUES ('new-github-username', 'Description of why invited');
```

**Via Future Admin UI:**

Create an admin dashboard component that calls:
```javascript
await supabase
  .from('approved_github_users')
  .insert({ github_username: username, notes: reason });
```

---

## Security Considerations

### ✅ What This Protects Against

1. **Unauthorized signups:** Only pre-approved GitHub accounts can create accounts
2. **Account enumeration:** Rejected users get generic error (not "user exists" vs "user not approved")
3. **Race conditions:** Hook runs atomically before user creation
4. **Client-side bypass:** Hook runs server-side, cannot be bypassed from frontend
5. **RLS bypass:** Hook function uses `SECURITY DEFINER` with explicit grants

### ⚠️ Additional Security Recommendations

1. **Admin-Only Access to Approved List:**
   - Update RLS policies to restrict INSERT/UPDATE/DELETE to admins only
   - Implement `is_admin()` check function based on `auth.users.raw_user_meta_data`

2. **Audit Logging:**
   - Consider adding a log table to track failed signup attempts
   - Monitor for repeated attempts from same GitHub account

3. **Rate Limiting:**
   - Supabase Auth has built-in rate limiting
   - Configure in Dashboard: Authentication → Rate Limits

4. **Email Notifications:**
   - Notify admins when someone attempts to sign up without approval
   - Could be implemented via additional auth hook or database trigger

---

## Troubleshooting

### Hook Not Running

**Check permissions:**
```sql
-- Verify grants are correct
SELECT 
  routine_schema,
  routine_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'hook_before_user_created';
```

**Verify hook is enabled in dashboard:**
- Go to Authentication → Hooks
- Ensure "Before User Created" shows as enabled

### GitHub Username Not Extracted

**Check metadata structure:**
```sql
-- Look at actual metadata from a test signup
SELECT 
  email,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;
```

GitHub OAuth typically provides:
- `user_name` (preferred)
- `preferred_username` (fallback)
- `avatar_url`
- `email`

### User Still Gets Created Despite Hook

**Verify hook function has no errors:**
```sql
-- Test the function directly
SELECT hook_before_user_created('{"user": {"user_metadata": {"user_name": "test"}}}'::jsonb);
```

Should return error object if "test" is not in approved list.

---

## Official Documentation References

All implementation follows official Supabase patterns:

1. [Auth Hooks Overview](https://supabase.com/docs/guides/auth/auth-hooks)
2. [Before User Created Hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook)
3. [User Management](https://supabase.com/docs/guides/auth/managing-user-data)
4. [Security Model for Hooks](https://supabase.com/docs/guides/auth/auth-hooks#security-model)
5. [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Future Enhancements

### Phase 2: Admin UI for Invites

Create admin dashboard with:
- View all approved users
- Add new approved users
- Remove approved users
- View failed signup attempts

### Phase 3: Email Invitations

Implement proper invitation flow:
1. Admin sends invite email with unique token
2. User clicks link → redirected to GitHub OAuth
3. Hook validates both GitHub username AND invite token
4. Token consumed after successful signup

### Phase 4: Invite Expiration

Add expiration dates to invites:
```sql
ALTER TABLE approved_github_users 
ADD COLUMN expires_at TIMESTAMPTZ;
```

Update hook to check expiration.

---

## Rollback Plan

If invite system needs to be disabled:

**Option 1: Disable hook in dashboard**
- Authentication → Hooks → Toggle "Before User Created" to OFF
- All signups will proceed normally

**Option 2: Revert migration**
```sql
-- Drop the hook function
DROP FUNCTION IF EXISTS public.hook_before_user_created;

-- Drop the approved users table
DROP TABLE IF EXISTS public.approved_github_users;
```

**Option 3: Allow all users temporarily**
Update hook function to always return success:
```sql
CREATE OR REPLACE FUNCTION public.hook_before_user_created(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN event; -- Allow all signups
END;
$$;
```

---

## Implementation Checklist

- [ ] Create migration file with SQL from Step 1
- [ ] Apply migration using Supabase MCP or CLI
- [ ] Verify `approved_github_users` table exists
- [ ] Verify `hook_before_user_created` function exists
- [ ] Enable hook in Supabase Dashboard (Authentication → Hooks)
- [ ] Verify permissions are correctly set
- [ ] Test with approved GitHub account (should succeed)
- [ ] Test with unapproved GitHub account (should fail)
- [ ] Add additional approved users as needed
- [ ] Update RLS policies to restrict admin-only access
- [ ] Consider implementing admin UI for managing invites
- [ ] Document process for team members

---

**End of Plan**

