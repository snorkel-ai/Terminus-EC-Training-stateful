#!/usr/bin/env python3
"""
Generate titles for tasks using OpenAI's Batch API (50% cheaper).

Workflow:
    1. Prepare:   python generate_titles_batch.py prepare --input tasks_export.csv
    2. Submit:    python generate_titles_batch.py submit
    3. Check:     python generate_titles_batch.py status
    4. Download:  python generate_titles_batch.py download --output tasks_with_titles.csv

The batch job typically completes within a few hours.
"""

import argparse
import csv
import json
import os
import sys
import time
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.local'))

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Same prompt as generate_titles.py
SYSTEM_PROMPT = """You are a technical writing assistant specializing in creating clear, action-driven titles for TerminalBench coding challenges.

## Context
TerminalBench is a platform that presents engineering tasks requiring terminal/CLI proficiency and practical coding skills. Tasks involve building tools, implementing systems, debugging code, and solving real-world technical problems.

## Title Requirements

### Structure
Titles must be:
1. **Action-driven** - Start with a strong verb (Build, Implement, Create, Develop, Debug, Configure, Optimize, etc.)
2. **Direct** - Immediately clear about what's being built or accomplished
3. **Descriptive** - Include enough technical detail to distinguish the task from similar ones

### Style Guidelines
- **Length**: 4-10 words typically (can go slightly longer for complex tasks)
- **Tone**: Professional and technical, not academic or theoretical
- **Focus**: Emphasize the implementation/building aspect, not just domain knowledge
- **Specificity**: Include key technologies, methods, or architectures when relevant

### Verb Choices
**Strong action verbs:**
- Build, Implement, Create, Develop (for building tools/systems)
- Debug, Fix, Diagnose, Troubleshoot (for solving problems)
- Configure, Setup, Deploy (for infrastructure/systems)
- Optimize, Improve, Refactor (for enhancement tasks)
- Analyze, Process, Parse (for data transformation)
- Test, Validate, Verify (for quality assurance)
- Cross-Compile, Vendor (for specific build operations)

**Avoid:**
- Generic verbs: "Work on", "Deal with", "Handle"
- Passive constructions: "Be able to", "Learn about"
- Academic framing: "Study", "Explore", "Investigate" (unless research-oriented)

## CRITICAL: Technology & Terminology Rules

### Include Key Technologies
Always mention technologies that are CENTRAL to the task:
- **Build tools**: Use "Cargo" not "Rust" for Rust build tasks
- **Compilers**: Include compiler name when relevant (e.g., "Clang ftime-trace")
- **Languages**: Include the language when it's specific (e.g., "CMake C Shared Library")
- **Target triples**: Use full form (e.g., "x86_64-unknown-linux-musl")
- **Scope**: Include "Multi-Module" or "Workspace" when the task explicitly requires it

### Correct Terminology & Casing
- **SemVer** (not "Semver")
- **Peer Dependency** (not "PeerDependency")
- **Kotlin DSL** (not "KTS")
- **JDK 8/17** (with space)
- Crate names lowercase: "serde and serde_json"

### Formatting Rules
- Avoid slash-separated lists like "A/B/C" - use commas
- Avoid vague "with X, Y, Z" - be explicit about the action
- Include necessary prepositions for clarity

### Scope Accuracy
- If task says "Audit AND Remediate/Fix", say "Auditor and Hardener" not just "Auditor"
- Include key scope qualifiers: "per-user", "per-session", "multi-account" when central to task

### Clarity Rules (Avoid Ambiguity)
- **Modifier placement matters**: Place adjectives next to what they modify
  - ❌ "gzipped ISO8601 Session Aggregation" (sounds like sessions are gzipped)
  - ✅ "parse .gz logs, aggregate ISO8601 sessions" (clear that logs are gzipped)
- **Avoid noun chains**: Break up long compound nouns with prepositions
  - ❌ "Cargo Workspace rustc cargo Version Incompatibility"
  - ✅ "Cargo Workspace Build Failure Due to Outdated rustc/cargo Toolchain"
- **Separate distinct features**: Don't merge unrelated concepts
  - ❌ "Hedged Jittered Exponential Backoff" (conflates hedging and backoff)
  - ✅ "Jittered Exponential Backoff, Request Hedging" (two clear features)
- **Clarify actions on objects**: State what you're doing TO what
  - ❌ "Invalid Logging" (logging that is invalid, or logging invalid things?)
  - ✅ "log invalid entries" (clear: logging entries that are invalid)
- **Use "for" to show relationships**: Connect tool to purpose
  - ❌ "Configure AWS CLI v2 IAM Identity Center"
  - ✅ "Configure AWS CLI v2 for IAM Identity Center"

## Output
Return ONLY the title, nothing else. No quotes, no explanation."""


def get_user_prompt(task: dict) -> str:
    """Build the user prompt for a single task."""
    parts = [f"Category: {task.get('category', 'Unknown')}"]
    
    if task.get('subcategory'):
        parts.append(f"Subcategory: {task['subcategory']}")
    if task.get('subsubcategory'):
        parts.append(f"Focus Area: {task['subsubcategory']}")
    
    parts.append(f"\nDescription:\n{task['description']}")
    
    if task.get('tags'):
        parts.append(f"\nTags: {task['tags']}")
    
    return "\n".join(parts)


def prepare_batch(input_file: str, output_file: str = "batch_requests.jsonl", limit: int = None):
    """Prepare JSONL file for batch processing."""
    script_dir = os.path.dirname(__file__)
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print(f"📖 Reading tasks from: {input_path}")
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        tasks = list(reader)
    
    if limit:
        tasks = tasks[:limit]
    
    print(f"   Found {len(tasks)} tasks")
    print(f"\n📝 Creating batch requests...")
    
    requests = []
    for task in tasks:
        request = {
            "custom_id": task['id'],
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-5",
                "messages": [
                    {
                        "role": "developer",
                        "content": [{"type": "text", "text": SYSTEM_PROMPT}]
                    },
                    {"role": "user", "content": get_user_prompt(task)}
                ],
                "reasoning_effort": "medium",
                "store": False
            }
        }
        requests.append(request)
    
    # Write JSONL file
    with open(output_path, 'w', encoding='utf-8') as f:
        for req in requests:
            f.write(json.dumps(req) + '\n')
    
    print(f"\n✅ Created: {output_path}")
    print(f"   Requests: {len(requests)}")
    print(f"\n📌 Next step: python generate_titles_batch.py submit")
    
    return output_path


def submit_batch(input_file: str = "batch_requests.jsonl"):
    """Upload JSONL and create batch job."""
    client = OpenAI(api_key=OPENAI_API_KEY)
    script_dir = os.path.dirname(__file__)
    input_path = os.path.join(script_dir, input_file)
    state_path = os.path.join(script_dir, "batch_state.json")
    
    # Count requests
    with open(input_path, 'r') as f:
        num_requests = sum(1 for _ in f)
    
    print(f"📤 Uploading {input_path} ({num_requests} requests)...")
    
    # Upload file
    with open(input_path, 'rb') as f:
        file_response = client.files.create(
            file=f,
            purpose="batch"
        )
    
    print(f"   File ID: {file_response.id}")
    
    # Create batch
    print(f"\n🚀 Creating batch job...")
    batch = client.batches.create(
        input_file_id=file_response.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
        metadata={
            "description": "Task title generation",
            "created_at": datetime.now().isoformat()
        }
    )
    
    print(f"   Batch ID: {batch.id}")
    print(f"   Status: {batch.status}")
    
    # Save state
    state = {
        "batch_id": batch.id,
        "input_file_id": file_response.id,
        "num_requests": num_requests,
        "created_at": datetime.now().isoformat(),
        "input_file": input_file
    }
    with open(state_path, 'w') as f:
        json.dump(state, f, indent=2)
    
    print(f"\n✅ Batch submitted!")
    print(f"   State saved to: batch_state.json")
    print(f"\n📌 Next step: python generate_titles_batch.py status")
    
    return batch.id


def check_status():
    """Check batch job status."""
    client = OpenAI(api_key=OPENAI_API_KEY)
    script_dir = os.path.dirname(__file__)
    state_path = os.path.join(script_dir, "batch_state.json")
    
    if not os.path.exists(state_path):
        print("❌ No batch state found. Run 'submit' first.")
        return None
    
    with open(state_path, 'r') as f:
        state = json.load(f)
    
    batch = client.batches.retrieve(state['batch_id'])
    
    print(f"📊 Batch Status")
    print(f"   ID: {batch.id}")
    print(f"   Status: {batch.status}")
    print(f"   Created: {state['created_at']}")
    
    if batch.request_counts:
        counts = batch.request_counts
        print(f"\n   Progress:")
        print(f"     Completed: {counts.completed}/{counts.total}")
        print(f"     Failed: {counts.failed}")
    
    if batch.status == "completed":
        print(f"\n✅ Batch completed!")
        print(f"   Output file ID: {batch.output_file_id}")
        print(f"\n📌 Next step: python generate_titles_batch.py download --output tasks_with_titles.csv")
        
        # Update state with output file
        state['output_file_id'] = batch.output_file_id
        state['status'] = 'completed'
        with open(state_path, 'w') as f:
            json.dump(state, f, indent=2)
    
    elif batch.status == "failed":
        print(f"\n❌ Batch failed!")
        if batch.errors:
            for error in batch.errors.data:
                print(f"   Error: {error.message}")
    
    elif batch.status in ["validating", "in_progress", "finalizing"]:
        print(f"\n⏳ Batch is still processing...")
        print(f"   Check again in a few minutes.")
    
    return batch.status


def download_results(input_file: str, output_file: str):
    """Download batch results and merge with original CSV."""
    client = OpenAI(api_key=OPENAI_API_KEY)
    script_dir = os.path.dirname(__file__)
    state_path = os.path.join(script_dir, "batch_state.json")
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    if not os.path.exists(state_path):
        print("❌ No batch state found. Run 'submit' first.")
        return
    
    with open(state_path, 'r') as f:
        state = json.load(f)
    
    if 'output_file_id' not in state:
        print("❌ Batch not completed yet. Run 'status' to check.")
        return
    
    print(f"📥 Downloading results...")
    
    # Download output file
    content = client.files.content(state['output_file_id'])
    results_path = os.path.join(script_dir, "batch_results.jsonl")
    
    with open(results_path, 'wb') as f:
        f.write(content.content)
    
    print(f"   Saved to: batch_results.jsonl")
    
    # Parse results
    print(f"\n📝 Parsing results...")
    titles = {}
    errors = 0
    
    with open(results_path, 'r', encoding='utf-8') as f:
        for line in f:
            result = json.loads(line)
            custom_id = result['custom_id']
            
            if result.get('error'):
                print(f"   ❌ Error for {custom_id}: {result['error']}")
                errors += 1
                continue
            
            response = result['response']
            if response['status_code'] == 200:
                body = response['body']
                title = body['choices'][0]['message']['content'].strip()
                # Remove quotes if present
                title = title.strip('"\'')
                titles[custom_id] = title
            else:
                print(f"   ❌ HTTP {response['status_code']} for {custom_id}")
                errors += 1
    
    print(f"   Parsed {len(titles)} titles, {errors} errors")
    
    # Merge with original CSV
    print(f"\n📖 Reading original tasks from: {input_path}")
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        tasks = list(reader)
    
    # Add titles
    for task in tasks:
        task['title'] = titles.get(task['id'], '')
    
    # Write output
    print(f"\n💾 Writing results to: {output_path}")
    fieldnames = ['id', 'title', 'category', 'subcategory', 'subsubcategory', 'description', 'difficulty', 'tags']
    
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(tasks)
    
    titles_count = sum(1 for t in tasks if t.get('title'))
    print(f"\n✅ Done!")
    print(f"   Tasks: {len(tasks)}")
    print(f"   Titles generated: {titles_count}")
    print(f"   Output: {output_path}")


def main():
    parser = argparse.ArgumentParser(description='Generate titles using OpenAI Batch API')
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Prepare command
    prep = subparsers.add_parser('prepare', help='Prepare JSONL batch file')
    prep.add_argument('--input', '-i', default='tasks_export.csv',
                      help='Input CSV file')
    prep.add_argument('--output', '-o', default='batch_requests.jsonl',
                      help='Output JSONL file')
    prep.add_argument('--limit', '-l', type=int, default=None,
                      help='Limit number of tasks')
    
    # Submit command
    sub = subparsers.add_parser('submit', help='Submit batch job to OpenAI')
    sub.add_argument('--input', '-i', default='batch_requests.jsonl',
                     help='JSONL file to submit')
    
    # Status command
    subparsers.add_parser('status', help='Check batch job status')
    
    # Download command
    dl = subparsers.add_parser('download', help='Download results and create CSV')
    dl.add_argument('--input', '-i', default='tasks_export.csv',
                    help='Original input CSV (to merge with)')
    dl.add_argument('--output', '-o', default='tasks_with_titles.csv',
                    help='Output CSV with titles')
    
    args = parser.parse_args()
    
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY not found in environment or .env.local")
        sys.exit(1)
    
    if args.command == 'prepare':
        prepare_batch(args.input, args.output, args.limit)
    elif args.command == 'submit':
        submit_batch(args.input)
    elif args.command == 'status':
        check_status()
    elif args.command == 'download':
        download_results(args.input, args.output)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
