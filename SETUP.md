# Local Development Setup

Instructions for running the TerminalBench Expert Training Portal locally.

## Prerequisites

- **Node.js** 18+ (recommended for Vite 6 and React 18 compatibility)
- **npm** (comes with Node.js)
- A **Supabase** project ([supabase.com](https://supabase.com))
- A **GitHub OAuth app** configured in your Supabase project
- A **PostHog** account ([posthog.com](https://posthog.com))

## 1. Clone the repository

```bash
git clone https://github.com/<your-org>/Terminus-EC-Training-stateful.git
cd Terminus-EC-Training-stateful
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Supabase (required)
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# PostHog (required)
VITE_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

> **Note:** The app will throw an error on startup if the Supabase variables are missing.

### Where to find these values

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard > Project Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard > Project Settings > API > `anon` `public` key |
| `VITE_PUBLIC_POSTHOG_KEY` | PostHog > Project Settings > Project API Key |
| `VITE_PUBLIC_POSTHOG_HOST` | Typically `https://us.i.posthog.com` (US) or `https://eu.i.posthog.com` (EU) |

## 4. Supabase project setup

### Database migrations

The database schema is managed via migration files in `supabase/migrations/`. Apply them in one of two ways:

**Option A — Supabase CLI** (recommended):

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

**Option B — SQL Editor:**

Run each migration file in order via the Supabase Dashboard SQL Editor. Start with `20241105000001_core_schema_v2.sql` and proceed chronologically.

### GitHub OAuth

1. Go to **Supabase Dashboard > Authentication > Providers**
2. Enable **GitHub**
3. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers):
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret** into the Supabase GitHub provider settings

### Storage (optional)

If the app serves video content, create a storage bucket:

1. Go to **Supabase Dashboard > Storage**
2. Create a new bucket called `documentation-videos`
3. Set appropriate access policies (public read if videos should be publicly accessible)

## 5. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

| Layer | Technology |
|---|---|
| Build tool | Vite 6 |
| UI framework | React 18 |
| Routing | React Router v7 |
| Auth & database | Supabase (PostgreSQL + GitHub OAuth) |
| Analytics | PostHog |
| Charts | Recharts |
| Search | Fuse.js (client-side fuzzy search) |
| Markdown rendering | react-markdown + remark-gfm + rehype-raw |

## Project structure

```
src/
├── components/        # React components
│   ├── ui/           # Design system (Button, Card, Modal, Badge, etc.)
│   ├── Auth/         # Authentication (login, callback, guards)
│   ├── Tasks/        # Task browsing, claiming, and management
│   ├── Docs/         # Documentation viewer
│   ├── Admin/        # Admin dashboard
│   └── Landing/      # Public landing page
├── contexts/         # React contexts (Auth, Theme, Progress, Toast)
├── hooks/            # Custom React hooks
├── lib/              # Library setup (Supabase client)
├── config/           # App configuration
├── data/             # Static data files
├── utils/            # Utility functions
├── styles/           # Global CSS and theme variables
└── docs/             # Documentation content
```

## Troubleshooting

| Problem | Solution |
|---|---|
| App crashes on startup | Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env.local` |
| GitHub login not working | Verify the OAuth callback URL matches your Supabase project URL exactly |
| Database errors | Ensure all migrations have been applied in order |
| PostHog not tracking | Check that `VITE_PUBLIC_POSTHOG_KEY` is set; PostHog runs in debug mode during development |
| Port 5173 in use | Kill the existing process or run `npm run dev -- --port 3000` to use a different port |
