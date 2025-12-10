# TerminalBench Expert Training Portal

The official training and task management portal for Expert Coders (ECs) contributing to TerminalBench — a benchmark for evaluating AI coding agents on real-world software engineering tasks.

## What is TerminalBench?

TerminalBench is a challenging benchmark that tests AI coding agents on tasks that mirror real software engineering work: debugging race conditions, implementing API endpoints, refactoring legacy code, fixing security vulnerabilities, and more. Expert Coders create these tasks, and this portal is your home base for everything you need to contribute.

---

## 🚀 Getting Started as an Expert Coder

### 1. Sign In with GitHub
Click "Get Started" on the landing page and authenticate with your GitHub account. That's it — no passwords to remember, and we only request minimal permissions (`user:email`).

### 2. Complete Your Onboarding
When you first log in, you'll see an onboarding modal that walks you through:
- Setting up your profile
- Understanding how the platform works
- Getting familiar with the task lifecycle

### 3. Explore the Portal
Once inside, you have access to:

| Section | What You'll Find |
|---------|------------------|
| **Dashboard** | Your home base with quick stats, announcements, and recommended next steps |
| **Browse Tasks** | Find tasks to work on — filter by difficulty, language, category, or search by keyword |
| **My Tasks** | Track everything you've claimed — see status, submit work, monitor reviews |
| **Docs** | Comprehensive guides on creating tasks, testing, submitting, and more |
| **Profile** | Manage your bio, links, and account settings |

---

## 📋 The Task Lifecycle

Here's how working on a task flows:

```
Browse → Claim → Work → Submit → Review → Accepted ✓
```

### Browsing Tasks
- **Search**: Type keywords to find specific tasks (fuzzy search finds partial matches)
- **Filter by Difficulty**: Easy, Medium, or Hard — pick your comfort level
- **Filter by Language**: Python, Go, Rust, JavaScript, TypeScript, and more
- **Filter by Category**: Debugging, API Development, Refactoring, Security, DevOps, etc.
- **View Details**: Click any task to see full requirements, estimated time, and skills needed

### Claiming a Task
Found something interesting? Click "Claim Task" to add it to your queue. The task moves to your "My Tasks" page where you can:
- Start working on it
- Track time spent
- Access all task materials

### Working on Tasks
Each task includes:
- **Description**: What needs to be done
- **Requirements**: Specific criteria for success
- **Starter Code**: The codebase you'll be working with
- **Test Suite**: Automated tests your solution must pass
- **Oracle Solution**: The reference implementation (revealed after submission)

### Submitting Your Work
When you're ready:
1. Push your solution to the designated GitHub repository
2. Submit through the platform
3. Track your submission as it moves through automated CI checks
4. Respond to any reviewer feedback

### Review Process
- Automated CI checks run first (linting, tests, security scans)
- Human reviewers evaluate edge cases and code quality
- You may need to defend your solution or make revisions
- Once approved, your task is marked as accepted!

---

## 📚 Documentation Hub

The portal includes extensive documentation organized by what you're trying to do:

### Getting Started
- Welcome guide and platform overview
- Environment setup instructions
- Quick start for your first task

### Understanding Tasks
- What makes a good TerminalBench task
- Task components and structure
- Difficulty guidelines and taxonomy
- Example tasks to learn from

### Creating Tasks
- Writing the task YAML specification
- Creating Docker environments
- Writing comprehensive tests
- Building oracle solutions
- Video walkthroughs of the entire process

### Submitting Tasks
- Platform submission workflow
- GitHub submission process
- Pre-submission checklist
- What happens after you submit

### Testing & Validation
- CI checks explained (what each check does)
- Oracle agent training
- Running real agents against your task
- LLMAJ checks reference

### Reviewing Tasks
- Review guidelines for peer reviewers
- Common errors and how to avoid them
- Defending your submission

### Reference
- FAQ for common questions
- Glossary of TerminalBench terminology
- Troubleshooting guide
- Rate schedule and compensation info
- Office hours schedule

---

## 🎯 Features

### For Expert Coders

| Feature | Description |
|---------|-------------|
| **Smart Task Search** | Fuzzy search finds tasks even with typos or partial keywords |
| **Advanced Filtering** | Filter by difficulty, language, category, or combine multiple filters |
| **Task Recommendations** | Get personalized suggestions based on your skills and history |
| **Progress Tracking** | See completion percentages for training materials in real-time |
| **Work Timer** | Built-in timer to track time spent on tasks |
| **Dark/Light Mode** | Toggle theme based on preference (or follow system settings) |
| **Mobile Friendly** | Full functionality on phone and tablet |

### For Training
| Feature | Description |
|---------|-------------|
| **Video Walkthroughs** | Step-by-step videos for complex processes |
| **Searchable Docs** | Find any documentation instantly with full-text search |
| **Progress Checkmarks** | Mark sections complete and track overall progress |
| **PDF Downloads** | Download reference materials for offline use |

---

## 🎨 Portal Pages

### Public Landing Page
Before signing in, visitors see:
- What TerminalBench is and why it matters
- How the contribution process works
- Benefits of becoming an Expert Coder
- Sample tasks to get a feel for the work

### Dashboard (`/portal`)
Your personalized home showing:
- Quick stats (tasks in progress, completion rate)
- Announcements and updates
- Recommended tasks based on your profile
- Quick links to common actions

### Browse Tasks (`/portal/tasks`)
The task marketplace where you:
- See all available tasks at a glance
- Use filters and search to find the perfect task
- Preview task details before claiming
- One-click claim to start working

### My Tasks (`/portal/my-tasks`)
Your personal task dashboard:
- **Active Tasks**: What you're currently working on
- **In Review**: Submissions waiting for feedback
- **Completed**: Your accepted contributions
- Status indicators and progress tracking

### Documentation (`/portal/docs`)
The knowledge base with:
- Category-organized documentation
- Sidebar navigation
- Full-text search across all docs
- Video embeds and downloadable resources

### Profile (`/portal/profile`)
Manage your account:
- Update name and bio
- Add LinkedIn and other links
- View your contribution history

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Routing | React Router v7 |
| Search | Fuse.js (fuzzy matching) |
| Charts | Recharts |
| Markdown | React Markdown + GFM |
| Analytics | PostHog |
| Styling | CSS3 with CSS variables |

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- GitHub OAuth App

### Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd Terminus-EC-Training-stateful
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and PostHog keys

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_POSTHOG_KEY=your-posthog-key (optional)
VITE_POSTHOG_HOST=https://app.posthog.com (optional)
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 👤 Admin Features

Administrators have access to additional analytics at `/portal/admin`:

- **Overview Stats**: Total ECs, active contributors, average completion rates
- **Task Priorities**: Monitor the task queue and set priorities
- **User Analytics**: Searchable table of all users with progress metrics
- **Section Stats**: Visualize which training sections need attention
- **Activity Indicators**: See who's active (7d), inactive (7-30d), or dormant (30d+)

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for setup instructions.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/        # Admin dashboard and analytics
│   ├── Auth/         # Login and route protection
│   ├── Docs/         # Documentation system
│   ├── Landing/      # Public landing page
│   ├── Layout/       # Header, navigation
│   ├── Profile/      # User profile management
│   ├── Tasks/        # Task browsing, claiming, management
│   └── ui/           # Reusable component library
├── contexts/         # React contexts (auth, theme, toast)
├── hooks/            # Custom hooks (tasks, search, timer)
├── data/             # Static content
└── lib/              # Supabase client

public/docs/          # Markdown documentation files
```

---

## 📖 Additional Documentation

- [Admin Setup Guide](./ADMIN_SETUP.md) - Managing admin users
- [Architecture Overview](./ARCHITECTURE.md) - System design and database schema
- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test the auth flow, task system, and any affected features
4. Submit a pull request with a clear description

---

## 📄 License

This project is proprietary and confidential.

---

## 💬 Support

Need help?
- **In-app docs**: Visit `/portal/docs` for comprehensive guides
- **Office hours**: Check the schedule in the docs
- **Technical issues**: Review browser console and Supabase logs
