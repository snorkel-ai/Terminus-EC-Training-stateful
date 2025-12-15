#!/usr/bin/env python3
"""
Review generated task titles using an LLM-as-a-judge approach.

This script flags titles that need improvement and provides specific recommendations.

Usage:
    python evaluate_titles.py [--input tasks_batch_40.csv] [--output flagged_titles.csv]

Requires:
    OPENAI_API_KEY environment variable (or in .env.local)

Output:
    flagged_titles.csv - Only titles that need attention, with recommendations
    evaluation_report.md - Human-readable report with all flagged issues
"""

import argparse
import csv
import json
import os
import sys
import time
from dataclasses import dataclass, field
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.local'))

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

SYSTEM_PROMPT = """You are a technical writing reviewer for TerminalBench, a platform for engineering coding challenges.

Your job is to identify titles that have issues and provide specific, actionable recommendations.

## What Makes a Good Title
- **Action-driven**: Starts with a strong verb (Build, Implement, Create, Debug, Fix, Configure, Optimize, Deploy, Parse)
- **Clear scope**: Immediately obvious what the task involves
- **Specific**: Includes key technologies/methods to distinguish from similar tasks
- **Accurate**: Reflects what the description actually asks for

## Evaluation Philosophy
- **Be lenient on style, strict on substance**
- Focus on whether the title WORKS, not whether it's PERFECT
- Minor phrasing preferences are NOT issues worth flagging
- A title that captures the key technologies and scope is GOOD, even if phrasing could be slightly better

## Length Guidelines
- Complex multi-step tasks: up to 18-20 words is acceptable
- **Accuracy and completeness are MORE important than brevity**
- Do NOT flag length unless it's egregiously long (>25 words)

## DO NOT FLAG these minor issues (mark as "ok" instead):
- Slight phrasing awkwardness that doesn't cause confusion
- "CMake-based" vs "CMake" vs "CMake/" - all acceptable
- "Clang ftime-trace" vs "clang -ftime-trace" - both acceptable  
- Minor word order preferences
- Missing secondary/optional details from the description
- Stylistic preferences like semicolons vs commas
- Capitalization variations (e.g., "SemVer" vs "semver")

## Common Issues to Flag

### 🚩 MUST FIX (flag as "fail")
- Missing action verb or starts with noun
- Completely misrepresents the task
- Too vague to understand (e.g., "Networking Task")
- Academic framing (e.g., "Learn about...", "Explore...")

### ⚠️ SHOULD IMPROVE (flag as "needs_work")
- Weak verb (Handle, Deal with, Work on)
- Egregiously long (>25 words)
- Missing a PRIMARY technology that's absolutely central to the task
- Significantly misrepresents what the task asks for
- Genuinely confusing or ambiguous (not just slightly awkward)

### ✅ ACCEPTABLE (flag as "ok")
- Title captures the core task and key technologies
- Minor stylistic preferences only
- Longer titles that accurately capture complex task scope
- Slight phrasing variations from "ideal"
- Missing only secondary/optional details

## Output Format
Respond with JSON:
{
    "status": "ok" | "needs_work" | "fail",
    "issues": ["<specific issue 1>", "<specific issue 2>"],
    "recommendation": "<improved title>" | null,
    "explanation": "<brief explanation of what's wrong and how the recommendation fixes it>"
}

If status is "ok", issues should be empty and recommendation should be null.
Be specific in issues - say exactly what's wrong, not generic feedback."""


@dataclass 
class ReviewResult:
    """Review result for a single title."""
    task_id: str
    title: str
    category: str
    status: str  # ok, needs_work, fail
    issues: list[str]
    recommendation: Optional[str]
    explanation: str
    
    @property
    def needs_attention(self) -> bool:
        return self.status != 'ok'
    
    def to_dict(self) -> dict:
        return {
            'task_id': self.task_id,
            'title': self.title,
            'category': self.category,
            'status': self.status,
            'issues': '; '.join(self.issues),
            'recommendation': self.recommendation or '',
            'explanation': self.explanation
        }


def review_title(client: OpenAI, task: dict) -> Optional[ReviewResult]:
    """Review a single title using GPT-4o."""
    
    title = task.get('title', '')
    if not title:
        return None
    
    # Build context from task metadata
    context_parts = []
    if task.get('category'):
        context_parts.append(f"Category: {task['category']}")
    if task.get('subcategory'):
        context_parts.append(f"Subcategory: {task['subcategory']}")
    if task.get('subsubcategory'):
        context_parts.append(f"Sub-subcategory: {task['subsubcategory']}")
    
    context = '\n'.join(context_parts)
    
    user_prompt = f"""Review this task title and flag any issues:

**Title:** {title}

**Task Context:**
{context}

**Task Description:**
{task.get('description', 'No description provided')}"""

    try:
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "developer",
                    "content": [{"type": "text", "text": SYSTEM_PROMPT}]
                },
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            reasoning_effort="medium",
            store=False
        )
        
        result = json.loads(response.choices[0].message.content)
        
        return ReviewResult(
            task_id=task.get('id', ''),
            title=title,
            category=task.get('category', ''),
            status=result.get('status', 'ok'),
            issues=result.get('issues', []),
            recommendation=result.get('recommendation'),
            explanation=result.get('explanation', '')
        )
        
    except json.JSONDecodeError as e:
        print(f"\n  ❌ Error parsing response for task {task.get('id', 'unknown')[:8]}: {e}")
        return None
    except Exception as e:
        print(f"\n  ❌ Error reviewing task {task.get('id', 'unknown')[:8]}: {e}")
        return None


def generate_report(results: list[ReviewResult], output_path: str):
    """Generate a markdown report of flagged titles."""
    
    flagged = [r for r in results if r.needs_attention]
    failed = [r for r in flagged if r.status == 'fail']
    needs_work = [r for r in flagged if r.status == 'needs_work']
    passed = [r for r in results if not r.needs_attention]
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Title Review Report\n\n")
        f.write(f"**Generated:** {time.strftime('%Y-%m-%d %H:%M')}\n\n")
        
        # Summary
        f.write("## Summary\n\n")
        f.write(f"| Status | Count | Percentage |\n")
        f.write(f"|--------|-------|------------|\n")
        f.write(f"| ✅ OK | {len(passed)} | {len(passed)/len(results)*100:.1f}% |\n")
        f.write(f"| ⚠️ Needs Work | {len(needs_work)} | {len(needs_work)/len(results)*100:.1f}% |\n")
        f.write(f"| 🚩 Fail | {len(failed)} | {len(failed)/len(results)*100:.1f}% |\n")
        f.write(f"| **Total** | **{len(results)}** | **100%** |\n\n")
        
        # Failed titles (must fix)
        if failed:
            f.write("## 🚩 Must Fix\n\n")
            f.write("These titles have critical issues and need to be rewritten.\n\n")
            for r in failed:
                f.write(f"### `{r.title}`\n\n")
                f.write(f"**Category:** {r.category}\n\n")
                f.write(f"**Issues:**\n")
                for issue in r.issues:
                    f.write(f"- {issue}\n")
                f.write(f"\n**Explanation:** {r.explanation}\n\n")
                if r.recommendation:
                    f.write(f"**Recommended:** `{r.recommendation}`\n\n")
                f.write("---\n\n")
        
        # Needs work titles
        if needs_work:
            f.write("## ⚠️ Should Improve\n\n")
            f.write("These titles work but could be better.\n\n")
            for r in needs_work:
                f.write(f"### `{r.title}`\n\n")
                f.write(f"**Category:** {r.category}\n\n")
                f.write(f"**Issues:**\n")
                for issue in r.issues:
                    f.write(f"- {issue}\n")
                f.write(f"\n**Explanation:** {r.explanation}\n\n")
                if r.recommendation:
                    f.write(f"**Recommended:** `{r.recommendation}`\n\n")
                f.write("---\n\n")
        
        # Quick reference table of all flagged
        if flagged:
            f.write("## Quick Reference\n\n")
            f.write("| Status | Current Title | Recommended |\n")
            f.write("|--------|---------------|-------------|\n")
            for r in flagged:
                status_icon = "🚩" if r.status == 'fail' else "⚠️"
                rec = r.recommendation or "—"
                # Truncate long titles for table
                title_short = r.title[:50] + "..." if len(r.title) > 50 else r.title
                rec_short = rec[:50] + "..." if len(rec) > 50 else rec
                f.write(f"| {status_icon} | {title_short} | {rec_short} |\n")


def print_summary(results: list[ReviewResult]):
    """Print a summary to console."""
    flagged = [r for r in results if r.needs_attention]
    failed = [r for r in flagged if r.status == 'fail']
    needs_work = [r for r in flagged if r.status == 'needs_work']
    passed = [r for r in results if not r.needs_attention]
    
    print("\n" + "=" * 70)
    print("📋 REVIEW SUMMARY")
    print("=" * 70)
    
    total = len(results)
    print(f"\n✅ OK:          {len(passed):3} ({len(passed)/total*100:5.1f}%)")
    print(f"⚠️  Needs Work:  {len(needs_work):3} ({len(needs_work)/total*100:5.1f}%)")
    print(f"🚩 Fail:        {len(failed):3} ({len(failed)/total*100:5.1f}%)")
    print(f"{'─' * 30}")
    print(f"   Total:       {total:3}")
    
    if failed:
        print(f"\n🚩 MUST FIX ({len(failed)}):")
        for r in failed[:5]:  # Show first 5
            print(f"   • \"{r.title[:50]}{'...' if len(r.title) > 50 else ''}\"")
            if r.recommendation:
                print(f"     → \"{r.recommendation[:50]}{'...' if len(r.recommendation) > 50 else ''}\"")
        if len(failed) > 5:
            print(f"   ... and {len(failed) - 5} more (see report)")
    
    if needs_work:
        print(f"\n⚠️  SHOULD IMPROVE ({len(needs_work)}):")
        for r in needs_work[:5]:  # Show first 5
            print(f"   • \"{r.title[:50]}{'...' if len(r.title) > 50 else ''}\"")
            if r.recommendation:
                print(f"     → \"{r.recommendation[:50]}{'...' if len(r.recommendation) > 50 else ''}\"")
        if len(needs_work) > 5:
            print(f"   ... and {len(needs_work) - 5} more (see report)")
    
    if not flagged:
        print("\n🎉 All titles passed review!")
    
    print("\n" + "=" * 70)


def main():
    parser = argparse.ArgumentParser(
        description='Review task titles and flag those needing improvement',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python evaluate_titles.py --input tasks_batch_40.csv
  python evaluate_titles.py --input tasks_with_titles.csv --limit 10
  python evaluate_titles.py -i tasks_batch_40.csv --all  # include OK titles in CSV
        """
    )
    parser.add_argument('--input', '-i', default='tasks_batch_40.csv',
                        help='Input CSV file with titles (default: tasks_batch_40.csv)')
    parser.add_argument('--output', '-o', default='flagged_titles.csv',
                        help='Output CSV of flagged titles (default: flagged_titles.csv)')
    parser.add_argument('--report', '-r', default='evaluation_report.md',
                        help='Markdown report file (default: evaluation_report.md)')
    parser.add_argument('--limit', '-l', type=int, default=None,
                        help='Limit number of titles to review (for testing)')
    parser.add_argument('--all', '-a', action='store_true',
                        help='Include all titles in CSV output, not just flagged ones')
    parser.add_argument('--quiet', '-q', action='store_true',
                        help='Suppress per-title output during review')
    args = parser.parse_args()
    
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY not found in environment or .env.local")
        print("Please add it to your .env.local file:")
        print("  OPENAI_API_KEY=sk-...")
        sys.exit(1)
    
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    # Resolve paths relative to script directory
    script_dir = os.path.dirname(__file__)
    input_path = os.path.join(script_dir, args.input)
    output_path = os.path.join(script_dir, args.output)
    report_path = os.path.join(script_dir, args.report)
    
    # Read input CSV
    print(f"📖 Reading titles from: {input_path}")
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        tasks = list(reader)
    
    # Filter to tasks with titles
    tasks_with_titles = [t for t in tasks if t.get('title')]
    print(f"   Found {len(tasks_with_titles)} tasks with titles")
    
    # Limit if specified
    if args.limit:
        tasks_with_titles = tasks_with_titles[:args.limit]
        print(f"   Limited to {len(tasks_with_titles)} tasks")
    
    # Review titles
    print("\n🔍 Reviewing titles...\n")
    
    results = []
    errors = 0
    
    for i, task in enumerate(tasks_with_titles, 1):
        title_display = task['title'][:55] + "..." if len(task['title']) > 55 else task['title']
        
        if not args.quiet:
            print(f"[{i:3}/{len(tasks_with_titles)}] {title_display}")
        
        result = review_title(client, task)
        
        if result:
            results.append(result)
            if not args.quiet:
                status_icon = {'ok': '✅', 'needs_work': '⚠️', 'fail': '🚩'}.get(result.status, '?')
                if result.status == 'ok':
                    print(f"        {status_icon} OK")
                else:
                    print(f"        {status_icon} {result.status.upper()}: {result.issues[0] if result.issues else ''}")
                    if result.recommendation:
                        print(f"        → {result.recommendation[:60]}{'...' if len(result.recommendation) > 60 else ''}")
        else:
            errors += 1
        
        # Small delay to avoid rate limits
        time.sleep(0.15)
    
    # Filter to flagged titles for CSV (unless --all)
    if args.all:
        output_results = results
    else:
        output_results = [r for r in results if r.needs_attention]
    
    # Write flagged titles CSV
    print(f"\n💾 Writing {'all' if args.all else 'flagged'} titles to: {output_path}")
    fieldnames = ['task_id', 'title', 'category', 'status', 'issues', 'recommendation', 'explanation']
    
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in output_results:
            writer.writerow(r.to_dict())
    
    # Generate markdown report
    print(f"📝 Writing report to: {report_path}")
    generate_report(results, report_path)
    
    # Print summary
    print_summary(results)
    
    # Final status
    flagged_count = len([r for r in results if r.needs_attention])
    print(f"\n✅ Review complete!")
    print(f"   Titles reviewed: {len(results)}")
    print(f"   Titles flagged:  {flagged_count}")
    if errors:
        print(f"   ❌ Errors: {errors}")
    print(f"\n📄 Output files:")
    print(f"   {output_path} - {'All' if args.all else 'Flagged'} titles with recommendations")
    print(f"   {report_path} - Detailed review report")


if __name__ == '__main__':
    main()
