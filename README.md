# Terminus EC Training Platform

A comprehensive training platform for Expert Coders (ECs) working on the Terminus project, featuring GitHub authentication, progress tracking, and admin analytics.

## Features

- **GitHub OAuth Authentication** - Secure login with GitHub accounts
- **Progress Tracking** - Track completion of training materials in real-time
- **Admin Dashboard** - Monitor EC engagement and identify churn points
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Training Materials**:
  - 9 Guideline sections covering all project requirements
  - 4 Walkthrough videos with completion tracking
  - Practice workbooks and Oracle training
  - Onboarding materials and feedback slides

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Styling**: CSS3 with modern features

## Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier works fine)
- A GitHub OAuth App (for authentication)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Terminus-EC-Training-stateful
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from **Settings → API**

### 3. Run Database Migrations

In your Supabase project's SQL Editor, run the migration files in order:

```sql
-- Run these in sequence:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/migrations/002_create_functions.sql
-- 3. supabase/migrations/003_create_views.sql
-- 4. supabase/migrations/004_enable_rls.sql
-- 5. supabase/migrations/005_seed_progress_items.sql
```

### 4. Configure GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App:
   - **Application name**: Terminus EC Training (or your choice)
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
3. Note the Client ID and Client Secret

### 5. Enable GitHub Auth in Supabase

1. In Supabase, go to **Authentication → Providers**
2. Enable GitHub provider
3. Enter your GitHub OAuth App credentials
4. Set **Scopes** to: `user:email` (minimal permissions)

### 6. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note**: The anon key is safe for frontend use because Row Level Security (RLS) protects your data.

### 7. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 8. Create Your First Admin User

After signing in for the first time, run this SQL in Supabase SQL Editor:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for more details.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy
5. Update GitHub OAuth callback URL to your production domain

### Update OAuth Callback for Production

Go to your GitHub OAuth App settings and add:
```
https://your-app.vercel.app
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

## Project Structure

```
src/
├── components/
│   ├── Admin/           # Admin dashboard components
│   ├── Auth/            # Authentication components
│   ├── Layout/          # Header, UserMenu
│   ├── Progress/        # Progress tracking UI
│   └── ...              # Training content components
├── contexts/
│   ├── AuthContext.jsx  # Auth state management
│   └── ProgressContext.jsx # Progress state management
├── lib/
│   └── supabase.js      # Supabase client
├── hooks/               # Custom React hooks
└── data/                # Static training content

supabase/
└── migrations/          # Database schema and seed data
```

## Key Features Explained

### Progress Tracking

- Each training section and video can be marked as complete
- Progress is synced to Supabase in real-time
- Overall completion percentage displayed in header
- Checkmarks shown next to completed items

### Admin Dashboard (`/admin`)

Only accessible to users with `is_admin = true`:

- **Overview Stats**: Total ECs, active users, average completion
- **User Table**: Searchable/sortable list of all users with progress
- **Section Stats**: Bar chart showing completion rates per section
- **Status Indicators**: Active (7d), Inactive (7-30d), Dormant (30d+)

### Security

- Row Level Security (RLS) ensures users can only see their own data
- Admins have read access to all user data
- Admin status cannot be self-assigned (protected by database trigger)
- GitHub OAuth uses minimal scopes (`user:email` only)

## Troubleshooting

**Issue**: "Missing Supabase environment variables"
- **Solution**: Create `.env.local` with correct values

**Issue**: Can't log in
- **Solution**: Verify GitHub OAuth callback URL matches your Supabase project URL

**Issue**: Progress not saving
- **Solution**: Check that all 5 migration scripts ran successfully in Supabase

**Issue**: Admin dashboard shows "Access Denied"
- **Solution**: Make sure you ran the SQL to set `is_admin = true` for your user

## Documentation

- [Admin Setup Guide](./ADMIN_SETUP.md) - How to manage admin users
- [Architecture Overview](./ARCHITECTURE.md) - System design and database schema

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (auth flow, progress tracking, admin dashboard)
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For questions or issues:
- Check existing documentation
- Review Supabase logs for backend errors
- Check browser console for frontend errors
