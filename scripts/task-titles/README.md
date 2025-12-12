# Task Title Generator

Generate action-driven titles for TerminalBench tasks using an LLM.

## Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌────────────────┐
│ 1. Export Tasks │ ──▶ │ 2. Generate      │ ──▶ │ 3. Review & │ ──▶ │ 4. Upload to   │
│    to CSV       │     │    Titles        │     │    Approve  │     │    Supabase    │
└─────────────────┘     └──────────────────┘     └─────────────┘     └────────────────┘
   export_tasks.py        generate_titles.py       (manual)           upload_titles.py
```

## Setup

1. Install dependencies:
   ```bash
   cd scripts/task-titles
   pip install -r requirements.txt
   ```

2. Ensure your `.env.local` has the required keys:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=sk-...
   ```

## Usage

### Step 1: Export Tasks
```bash
python export_tasks.py
```
This creates `tasks_export.csv` with all 1,600 tasks.

### Step 2: Generate Titles
```bash
# Generate titles for all tasks
python generate_titles.py

# Or test with a small batch first
python generate_titles.py --limit 10

# Resume if interrupted
python generate_titles.py --resume
```
This creates `tasks_with_titles.csv` with a new `title` column.

### Step 3: Review & Approve
Open `tasks_with_titles.csv` in your spreadsheet editor and review the generated titles.
- Edit any titles that need improvement
- Delete titles you want to regenerate

### Step 4: Upload to Supabase
```bash
# Preview what will be uploaded
python upload_titles.py --dry-run

# Upload for real
python upload_titles.py
```

**Note:** Before uploading, you need to add the `title` column to the database:
```sql
ALTER TABLE task_inspiration ADD COLUMN IF NOT EXISTS title TEXT;
```

## Files

| File | Description |
|------|-------------|
| `export_tasks.py` | Downloads all tasks from Supabase to CSV |
| `generate_titles.py` | Generates titles using GPT-4o-mini |
| `upload_titles.py` | Pushes approved titles back to Supabase |
| `tasks_export.csv` | Raw task data (generated) |
| `tasks_with_titles.csv` | Tasks with generated titles (generated) |

## Cost Estimate

Using GPT-4o-mini at ~$0.15 per 1M input tokens:
- 1,600 tasks × ~500 tokens avg = ~800K tokens
- Estimated cost: **~$0.12**
