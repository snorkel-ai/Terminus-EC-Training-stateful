# Architecture Overview

This document provides a high-level overview of the Terminus EC Training Platform's architecture, database schema, and key design decisions.

## System Architecture

```
┌─────────────────┐
│                 │
│  React Frontend │ ◄──── User Interface
│  (Vite + React) │       GitHub OAuth Login
│                 │       Progress Tracking
└────────┬────────┘       Admin Dashboard
         │
         │ HTTPS / REST API
         │
┌────────▼────────┐
│                 │
│    Supabase     │ ◄──── Backend as a Service
│   (PostgreSQL)  │       Authentication
│                 │       Database
└─────────────────┘       Row Level Security
```

## Frontend Architecture

### Component Hierarchy

```
App (BrowserRouter + AuthProvider + ProgressProvider)
├── Login (Public Route)
└── Protected Routes
    ├── Header (with ProgressBar & UserMenu)
    └── Content Routes
        ├── LandingPage
        ├── Guideline Sections (with Sidebar & CompletionToggle)
        ├── Videos (with CompletionToggle per video)
        ├── Workbook, Oracle, etc. (with CompletionToggle)
        └── AdminDashboard (Admin Only)
            ├── OverviewStats
            ├── UserStatsTable
            └── SectionStats (with Recharts)
```

### State Management

**Context-based state:**

1. **AuthContext**: 
   - Current user session
   - User profile (includes `is_admin`)
   - Login/logout functions
   - Auto-sync profile with Supabase

2. **ProgressContext**:
   - All progress items (catalog)
   - User's completion status
   - Toggle completion function
   - Calculate percentages

### Routing Structure

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | GitHub OAuth login page |
| `/` | Protected | Landing page with resources |
| `/guideline-*` | Protected | Guideline sections |
| `/videos` | Protected | Walkthrough videos |
| `/workbook` | Protected | CI Feedback training |
| `/oracle` | Protected | Oracle Agent training |
| `/onboarding` | Protected | Onboarding materials |
| `/feedback` | Protected | Feedback slides |
| `/faq` | Protected | FAQ page |
| `/glossary` | Protected | Glossary |
| `/admin` | Admin Only | Admin dashboard |

## Database Schema

### Tables

#### `users`

Stores extended user profiles.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  github_username TEXT,
  github_avatar_url TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);
```

**Indexes:**
- `idx_users_last_active` on `last_active DESC`
- `idx_users_created_at` on `created_at DESC`

**RLS Policies:**
- Users can read their own profile
- Admins can read all profiles
- Users can update their own profile (except `is_admin`)
- Trigger prevents self-assignment of admin status

---

#### `progress_items`

Catalog of all trackable training materials.

```sql
CREATE TABLE progress_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,  -- 'guideline' | 'video' | 'resource'
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_core BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes:**
- `idx_progress_items_category` on `category`
- `idx_progress_items_display_order` on `display_order`

**RLS Policies:**
- All authenticated users can read (public catalog)

**Data:**
- 9 Guideline sections (all `is_core = true`)
- 4 Videos (all `is_core = true`)
- 6 Resources (all `is_core = false`)

---

#### `user_progress`

Tracks which items each user has completed.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  progress_item_id TEXT NOT NULL REFERENCES progress_items(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, progress_item_id)
);
```

**Indexes:**
- `idx_user_progress_user_id` on `user_id`
- `idx_user_progress_item_id` on `progress_item_id`
- `idx_user_progress_completed` on `completed WHERE completed = true`

**RLS Policies:**
- Users can read/write their own progress
- Admins can read all progress
- Users can delete their own progress (for reset)

---

### Database Functions

#### `update_last_active()`

Automatically updates `users.last_active` when progress changes.

```sql
CREATE TRIGGER trigger_update_last_active
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();
```

#### `prevent_admin_self_assignment()`

Prevents users from making themselves admin via the app.

```sql
CREATE TRIGGER trigger_prevent_admin_self_assignment
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_admin_self_assignment();
```

Only `service_role` can modify `is_admin` field.

---

### Database Views

#### `v_user_stats`

Pre-aggregated user statistics for admin dashboard.

```sql
SELECT 
  u.id,
  u.github_username,
  u.email,
  u.github_avatar_url,
  u.created_at,
  u.last_active,
  COUNT(CASE WHEN up.completed THEN 1 END) as completed_count,
  COUNT(up.id) as total_items,
  ROUND(100.0 * COUNT(CASE WHEN up.completed THEN 1 END) / 
    NULLIF(COUNT(up.id), 0), 1) as completion_percentage,
  CASE 
    WHEN u.last_active > now() - interval '7 days' THEN 'active'
    WHEN u.last_active > now() - interval '30 days' THEN 'inactive'
    ELSE 'dormant'
  END as status
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id;
```

**Used by:** Admin dashboard user table

---

#### `v_section_stats`

Section-level completion rates across all users.

```sql
SELECT 
  pi.id,
  pi.title,
  pi.category,
  pi.display_order,
  COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) as completed_by,
  COUNT(DISTINCT u.id) as total_users,
  ROUND(100.0 * COUNT(DISTINCT up.user_id) FILTER (WHERE up.completed = true) / 
    NULLIF(COUNT(DISTINCT u.id), 0), 1) as completion_rate
FROM progress_items pi
CROSS JOIN users u
LEFT JOIN user_progress up ON pi.id = up.progress_item_id AND u.id = up.user_id
GROUP BY pi.id, pi.title, pi.category, pi.display_order
ORDER BY pi.display_order;
```

**Used by:** Admin dashboard section chart

---

## Security Model

### Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

1. **Users can only see their own data** (by default)
2. **Admins can see all data** (via `is_admin` check in policies)
3. **Nobody can self-assign admin** (enforced by trigger)

### Authentication Flow

```
1. User clicks "Sign in with GitHub"
   ↓
2. Redirect to GitHub OAuth
   ↓
3. User authorizes (scope: user:email)
   ↓
4. GitHub redirects to Supabase callback
   ↓
5. Supabase creates session + JWT
   ↓
6. Frontend receives session
   ↓
7. AuthContext upserts user profile
   ↓
8. User redirected to home page
```

### JWT Claims

Supabase JWTs include:
- `sub`: User ID (UUID)
- `email`: User email
- `role`: Always 'authenticated' (service_role never exposed to frontend)

RLS policies use `auth.uid()` to identify the current user.

---

## Data Flow

### Progress Update Flow

```
1. User clicks "Mark as Complete" button
   ↓
2. CompletionToggle calls toggleCompletion(itemId)
   ↓
3. ProgressContext updates state (optimistic)
   ↓
4. Supabase upsert to user_progress table
   ↓
5. Trigger updates users.last_active
   ↓
6. Success: UI shows checkmark
   Error: Revert optimistic update
```

### Admin Dashboard Data Flow

```
1. AdminDashboard mounts
   ↓
2. Check if user.is_admin === true
   ↓
3. Fetch data from Supabase:
   - v_user_stats (all users)
   - v_section_stats (all sections)
   ↓
4. Calculate overview stats in frontend
   ↓
5. Render components:
   - OverviewStats (metrics cards)
   - UserStatsTable (sortable table)
   - SectionStats (bar chart via Recharts)
```

---

## Performance Considerations

### Frontend Optimizations

1. **Context-based caching**: Progress data fetched once, cached in React context
2. **Optimistic updates**: UI updates before database confirms
3. **Lazy loading**: Routes code-split automatically by Vite
4. **Minimal re-renders**: Use React.memo where appropriate

### Database Optimizations

1. **Indexes on foreign keys**: Fast joins for queries
2. **Materialized views**: Pre-aggregated stats (could be implemented later)
3. **Partial indexes**: Index only completed items for faster filtering
4. **Connection pooling**: Handled by Supabase automatically

### Scaling Considerations

Current design supports:
- **Users**: Thousands (tested with Supabase free tier limits)
- **Progress items**: Dozens (currently 19)
- **Admin queries**: Efficient with proper indexes

For 10,000+ users, consider:
- Implementing materialized views (refresh on schedule)
- Adding pagination to admin dashboard
- Caching aggregate stats (Redis/Vercel KV)

---

## Technology Choices

### Why Supabase?

- ✅ Built-in authentication (GitHub OAuth)
- ✅ PostgreSQL (reliable, powerful)
- ✅ Row Level Security (data protection)
- ✅ Real-time capabilities (future feature)
- ✅ Generous free tier
- ✅ Auto-generated REST API
- ✅ No backend code to maintain

### Why React + Vite?

- ✅ Fast development with HMR
- ✅ Modern build tooling
- ✅ Small bundle sizes
- ✅ Easy deployment (static files)

### Why Context API (not Redux)?

- ✅ Simpler for this scale
- ✅ Built into React
- ✅ Sufficient for auth + progress state
- ✅ Less boilerplate

### Why Recharts?

- ✅ React-friendly
- ✅ Responsive by default
- ✅ Good TypeScript support
- ✅ Customizable

---

## Future Enhancements (Phase 2)

Planned features not in Phase 1:

1. **Advanced Analytics**:
   - Track time spent per section
   - Detailed event logging
   - Churn funnel visualization
   - Session replay

2. **Enhanced Features**:
   - File uploads (workbook submissions)
   - Email notifications (inactive users)
   - Leaderboard with external data
   - Points/XP/badge system

3. **Performance**:
   - Materialized views
   - Server-side pagination
   - Image optimization
   - CDN for static assets

4. **Admin Tools**:
   - User management UI (no SQL required)
   - Bulk operations
   - Export to CSV
   - Custom reports

---

## Deployment Architecture

### Development

```
localhost:5173 (Vite dev server)
    ↓
Supabase (cloud instance)
```

### Production

```
Vercel Edge Network (CDN)
    ↓
Static React App
    ↓
Supabase (cloud instance)
```

**Benefits**:
- Global CDN for fast page loads
- Automatic HTTPS
- Preview deployments for PRs
- Zero-downtime deploys

---

## Monitoring & Debugging

### Supabase Dashboard

Monitor:
- Database size
- Active connections
- Query performance
- Auth events
- API usage

### Browser DevTools

Check:
- Network tab for API calls
- Console for errors
- Application tab for localStorage (session)
- React DevTools for component state

### Common Issues

**Authentication loops**:
- Check callback URL matches exactly
- Verify environment variables are set
- Clear localStorage and retry

**Progress not saving**:
- Check RLS policies are enabled
- Verify user is authenticated
- Check network tab for 401/403 errors

**Admin dashboard empty**:
- Verify views were created successfully
- Check if any users exist in database
- Confirm user has `is_admin = true`

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Recharts Documentation](https://recharts.org)
- [Vite Documentation](https://vitejs.dev)

