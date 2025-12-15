# Task Title Generator

Generate action-driven titles for TerminalBench tasks using an LLM.

## Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌────────────────┐
│ 1. Export Tasks │ ──▶ │ 2. Generate      │ ──▶ │ 3. Evaluate      │ ──▶ │ 4. Upload to   │
│    to CSV       │     │    Titles        │     │    Quality (LLM) │     │    Supabase    │
└─────────────────┘     └──────────────────┘     └──────────────────┘     └────────────────┘
   export_tasks.py        generate_titles.py       evaluate_titles.py      upload_titles.py
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

### Step 3: Review Quality (LLM-as-a-Judge)
```bash
# Review all titles in a batch file
python evaluate_titles.py --input tasks_batch_40.csv

# Quick test with limit
python evaluate_titles.py --input tasks_with_titles.csv --limit 10

# Include all titles in output (not just flagged)
python evaluate_titles.py --input tasks_batch_40.csv --all

# Quiet mode (only show summary)
python evaluate_titles.py --input tasks_batch_40.csv --quiet
```

This creates:
- `flagged_titles.csv` - Only titles needing attention, with recommendations
- `evaluation_report.md` - Human-readable report with all issues

**Status Levels:**
| Status | Meaning | Action |
|--------|---------|--------|
| ✅ OK | Title is good | No action needed |
| ⚠️ Needs Work | Has minor issues | Consider the recommendation |
| 🚩 Fail | Critical issues | Must rewrite |

**Common Issues Flagged:**
- Missing or weak action verb
- Too vague or too long
- Doesn't match the task description
- Academic framing ("Learn about...", "Explore...")

### Step 4: Fix Flagged Titles
1. Open `evaluation_report.md` for detailed explanations
2. Review `flagged_titles.csv` for quick fixes
3. Apply recommendations or write your own improvements
4. Re-run evaluation to verify fixes

### Step 5: Upload to Supabase
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
| `generate_titles.py` | Generates titles using GPT-5 |
| `evaluate_titles.py` | Evaluates title quality using LLM-as-a-judge (GPT-4o) |
| `upload_titles.py` | Pushes approved titles back to Supabase |
| `tasks_export.csv` | Raw task data (generated) |
| `tasks_with_titles.csv` | Tasks with generated titles (generated) |
| `evaluation_results.csv` | Detailed evaluation scores (generated) |
| `evaluation_summary.json` | Aggregate quality statistics (generated) |

## Cost Estimate

**Title Generation (GPT-5):**
- 1,600 tasks × ~500 tokens avg = ~800K tokens
- Check https://openai.com/pricing for current GPT-5 pricing

**Title Evaluation (GPT-4o):**
- 1,600 tasks × ~800 tokens avg = ~1.3M tokens
- Uses GPT-4o for cost-effective evaluation with JSON mode
