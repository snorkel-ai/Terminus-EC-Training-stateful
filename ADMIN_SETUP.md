# Admin Setup Guide

This guide explains how to manage admin users and access the admin dashboard.

## Making a User an Admin

### Step 1: User Must Sign In First

The user must log in to the app at least once using GitHub OAuth. This creates their record in the `users` table.

### Step 2: Grant Admin Access via SQL

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following query:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'user@example.com';
```

Replace `user@example.com` with the actual email address of the user.

### Step 3: Verify Admin Access

1. The user should refresh the page or log out and log back in
2. They should now see an "Admin Dashboard" option in the user menu (top right)
3. Clicking it will take them to `/admin`

## Viewing Current Admins

To see all admin users:

```sql
SELECT id, email, github_username, is_admin, created_at, last_active
FROM users
WHERE is_admin = true
ORDER BY created_at DESC;
```

## Revoking Admin Access

To remove admin privileges from a user:

```sql
UPDATE users 
SET is_admin = false 
WHERE email = 'user@example.com';
```

## Security Considerations

### Admin Status Cannot Be Self-Assigned

The database has a trigger (`trigger_prevent_admin_self_assignment`) that prevents users from elevating themselves to admin status through the application. Only the following methods can change admin status:

1. **Direct SQL** with `service_role` key (what you're doing above)
2. **Supabase Dashboard** SQL Editor (uses service_role internally)

Users **cannot**:
- Make themselves admin through the app
- Modify the `is_admin` field via the Supabase client
- Bypass RLS policies to change their own admin status

### What Admins Can See

Admins have read access to:
- All user profiles (`users` table)
- All user progress records (`user_progress` table)
- Aggregated statistics (`v_user_stats`, `v_section_stats` views)

Admins **cannot**:
- Modify other users' data
- Delete users
- Change other users' admin status (only service_role can)

## Admin Dashboard Features

### Overview Stats Panel

Displays key metrics:
- **Total ECs**: All registered users
- **Active (7 days)**: Users active in last 7 days
- **Active (30 days)**: Users active in last 30 days  
- **Avg Completion**: Average completion percentage across all users
- **New (7 days)**: New signups in last 7 days

### User Stats Table

Features:
- **Search**: Filter by name or email
- **Status Filter**: Filter by active/inactive/dormant
- **Sortable Columns**: Click column headers to sort
- **User Details**: Name, email, join date, last active, progress %

Status definitions:
- **Active**: Last activity within 7 days
- **Inactive**: Last activity between 7-30 days ago
- **Dormant**: No activity in 30+ days

### Section Stats Chart

Shows completion rates for each training section:
- **Green (75%+)**: Good completion rate
- **Blue (50-75%)**: Fair completion rate
- **Orange (25-50%)**: Low completion rate
- **Red (<25%)**: Critical - needs attention

Use this to identify problem areas where ECs are dropping off.

## Bulk Admin Operations

### Making Multiple Users Admin

```sql
UPDATE users 
SET is_admin = true 
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

### Finding Inactive Admins

```sql
SELECT email, last_active
FROM users
WHERE is_admin = true
  AND last_active < now() - interval '30 days'
ORDER BY last_active DESC;
```

## Troubleshooting

### "Access Denied" When Visiting /admin

**Cause**: User is not an admin

**Solution**:
1. Check if `is_admin = true` in database
2. Make sure user refreshed/re-logged after admin grant
3. Verify user is logged in with correct account

### Admin Sees "No data" in Dashboard

**Cause**: Database views not created or no users exist

**Solution**:
1. Verify migrations 003_create_views.sql ran successfully
2. Check if other users have signed in (need data to display)
3. Run this to check views:
   ```sql
   SELECT * FROM v_user_stats LIMIT 5;
   SELECT * FROM v_section_stats LIMIT 5;
   ```

### Cannot Change Admin Status

**Error**: "Unauthorized: Cannot modify admin status"

**Cause**: Trying to modify `is_admin` from the frontend or with user JWT

**Solution**: Must use Supabase SQL Editor or service_role key. This is intentional security.

## Best Practices

1. **Minimal Admins**: Only grant admin access to trusted team members
2. **Regular Audits**: Periodically review who has admin access
3. **Document Changes**: Keep a record of when/why you grant admin access
4. **Monitor Activity**: Check admin last_active dates regularly
5. **Test Before Granting**: Have users sign in once before making them admin

## Example: First-Time Setup

Here's the complete workflow for setting up your first admin:

```bash
# 1. User visits app and logs in with GitHub
# 2. In Supabase SQL Editor, run:

UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';

# 3. User refreshes page
# 4. User clicks profile menu → sees "Admin Dashboard"
# 5. User clicks "Admin Dashboard" → sees analytics
```

## Monitoring Admin Access

Create a view to track admin logins:

```sql
CREATE OR REPLACE VIEW v_admin_activity AS
SELECT 
  u.email,
  u.github_username,
  u.last_active,
  CASE 
    WHEN u.last_active > now() - interval '7 days' THEN 'active'
    WHEN u.last_active > now() - interval '30 days' THEN 'inactive'
    ELSE 'dormant'
  END as status
FROM users u
WHERE u.is_admin = true
ORDER BY u.last_active DESC;

-- Then query it:
SELECT * FROM v_admin_activity;
```

## Need Help?

If you encounter issues:
1. Check Supabase logs (Database → Logs)
2. Verify RLS policies are enabled (Database → Policies)
3. Test with browser dev tools (check for errors)
4. Review the `users` table directly to confirm admin status

