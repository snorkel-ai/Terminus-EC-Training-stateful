#!/usr/bin/env python3
"""
Generate titles for tasks using an LLM.

Usage:
    python generate_titles.py [--input tasks_export.csv] [--output tasks_with_titles.csv]

Requires:
    OPENAI_API_KEY environment variable (or in .env.local)

Output:
    tasks_with_titles.csv - Same as input but with a 'title' column added
"""

import argparse
import csv
import os
import sys
import time
from dotenv import load_dotenv
from openai import OpenAI
from tqdm import tqdm

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.local'))

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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

**Use precise verbs:**
- Use "Cross-Compile" instead of generic "Build" when cross-compilation is required
- Use "Vendor" when vendoring dependencies is central to the task
- If description says "Fix and Harden", include both verbs: "Fix and Harden..."

**Avoid:**
- Generic verbs: "Work on", "Deal with", "Handle"
- Passive constructions: "Be able to", "Learn about"
- Academic framing: "Study", "Explore", "Investigate" (unless research-oriented)

## CRITICAL: Technology & Terminology Rules

### Include Key Technologies
Always mention technologies that are CENTRAL to the task:
- **Build tools**: Use "Cargo" not "Rust" for Rust build tasks (e.g., "Cargo Workspace" not "Rust Workspace")
- **Compilers**: Include compiler name when relevant (e.g., "Clang ftime-trace" not just "ftime-trace")
- **Languages**: Include the language when it's specific (e.g., "CMake C Shared Library" or "C++17 Filesystem")
- **Target triples**: Use full form (e.g., "x86_64-unknown-linux-musl" not "x86_64-musl")
- **Scope**: Include "Multi-Module" or "Workspace" when the task explicitly requires it

### Correct Terminology & Casing
- **SemVer** (not "Semver")
- **Peer Dependency** (not "PeerDependency")  
- **Kotlin DSL** (not "KTS")
- **JDK 8/17** (with space, not "JDK8/17")
- **Crate names lowercase**: "serde and serde_json" (not "Serde/serde_json")
- **Package names lowercase**: "openssl-sys", "rustls"

### Formatting Rules
- **Avoid slash-separated lists**: Use commas instead
  - ❌ "PIC/OpenMP/Filesystem/RPATH"
  - ✅ "PIC, OpenMP, Filesystem, RPATH"
- **Avoid vague "with X, Y, Z"**: Use explicit actions when possible
  - ❌ "Fix JNI Build with jni.h, PIC, libjvm"
  - ✅ "Fix JNI Build: Include jni.h, Enable PIC, Configure libjvm RPATH"
- **Include prepositions**: Don't omit necessary words
  - ❌ "Configure GitHub Actions Reproducible Rust Releases"
  - ✅ "Configure GitHub Actions for Reproducible Rust Releases"
- **Avoid fragmented semicolon structures**: Prefer a single coherent phrase
- **Use "CMake-based" not "CMake X"**: e.g., "CMake-based C Builds" not "CMake C Builds"

### Scope Accuracy
- If description says "Fix and Harden", title must include both: "Fix and Harden..."
- If description says "build script", don't call it "Pipeline"
- If description mentions "multi-module" or "workspace", include that scope
- Match the verification step: "Verify HTTPS" not "Verify TLS" if task tests HTTPS specifically
- If task has "Audit AND Remediate/Fix", say "Auditor and Hardener" not just "Auditor"
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

## Pattern Examples

**Good patterns:**
- Build [a/an] [technical component] [using/with/for] [method/technology]
- Implement [system/algorithm] [for] [use case]
- Debug [specific problem] [in] [environment/context]
- Create [tool] [that does X]
- Optimize [component] [for] [metric/goal]
- Configure [tool] for [specific goal] with [key technologies]
- Cross-Compile [target] [binary type] for [target triple]

**Examples:**
- Build an Exoplanet Transit Detection Pipeline
- Implement OAuth 2.0 Authentication for Microservices
- Debug Memory Leaks in Multi-threaded C++ Application
- Create a Real-time Log Aggregation System with Kafka
- Optimize Database Queries for High-Traffic APIs
- Configure Kubernetes Auto-scaling with Custom Metrics
- Configure sccache-backed Incremental Cargo Workspace Builds and Record Metrics
- Fix and Harden CMake GitHub Actions Workflow with SHA Pinning and ccache
- Cross-Compile Static x86_64-unknown-linux-musl Rust CLI with rustls
- Resolve Cargo Workspace serde and serde_json Version and Feature Conflicts

### What Makes a Bad Title
❌ "Networking Task" - Too vague, no action verb
❌ "Learn about Docker Networking" - Academic framing, not implementation-focused
❌ "Deal with Authentication Issues" - Weak verb, unclear scope
❌ "Advanced Machine Learning Pipeline Development Project" - Too long, buzzword-heavy
❌ "Exoplanet Detection" - Missing verb, could be theoretical
❌ "Configure Rust Workspace Builds" - Should be "Cargo Workspace" not "Rust Workspace"
❌ "Fix CMake Linking for PIC/OpenMP/RPATH" - Slash list, should use commas
❌ "Harden GitHub Actions CI" - Missing "Fix" if task says "Fix and Harden"

### What Makes a Good Title
✅ "Build a Docker Network Isolation System"
✅ "Debug JWT Authentication Failures in Express API"
✅ "Implement Distributed Training Pipeline for BERT"
✅ "Detect Exoplanets Using Box Least Squares Analysis"
✅ "Repair CMake C Shared Library SONAME and Symbol Versioning"
✅ "Resolve Yarn v3 PnP Peer Dependency Conflicts in React/Webpack Monorepo"

## Output Format
Provide only the title, no explanation or additional text."""


def generate_title(client: OpenAI, task: dict) -> str:
    """Generate a title for a single task using GPT-5."""
    # Build context from task metadata
    context_parts = []
    if task.get('category'):
        context_parts.append(f"Category: {task['category']}")
    if task.get('subcategory'):
        context_parts.append(f"Subcategory: {task['subcategory']}")
    if task.get('subsubcategory'):
        context_parts.append(f"Sub-subcategory: {task['subsubcategory']}")
    if task.get('difficulty'):
        context_parts.append(f"Difficulty: {task['difficulty']}")
    if task.get('tags'):
        context_parts.append(f"Tags: {task['tags']}")
    
    context = '\n'.join(context_parts)
    
    user_prompt = f"""Generate a concise, action-driven title for this task:

{context}

Task Description:
{task['description']}"""

    try:
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "developer",
                    "content": [{"type": "text", "text": SYSTEM_PROMPT}]
                },
                {
                    "role": "user", 
                    "content": user_prompt
                }
            ],
            response_format={"type": "text"},
            reasoning_effort="medium",
            store=False
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"\nError generating title for task {task.get('id', 'unknown')}: {e}")
        return ""


def main():
    parser = argparse.ArgumentParser(description='Generate titles for tasks using GPT-5')
    parser.add_argument('--input', '-i', default='tasks_export.csv', 
                        help='Input CSV file (default: tasks_export.csv)')
    parser.add_argument('--output', '-o', default='tasks_with_titles.csv',
                        help='Output CSV file (default: tasks_with_titles.csv)')
    parser.add_argument('--limit', '-l', type=int, default=None,
                        help='Limit number of tasks to process (for testing)')
    parser.add_argument('--resume', '-r', action='store_true',
                        help='Resume from existing output file (skip tasks with titles)')
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
    
    # Read input CSV
    print(f"Reading tasks from: {input_path}")
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        tasks = list(reader)
    
    print(f"Loaded {len(tasks)} tasks")
    
    # Load existing titles if resuming
    existing_titles = {}
    if args.resume and os.path.exists(output_path):
        print(f"Resuming from: {output_path}")
        with open(output_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get('title'):
                    existing_titles[row['id']] = row['title']
        print(f"Found {len(existing_titles)} existing titles")
    
    # Limit tasks if specified
    if args.limit:
        tasks = tasks[:args.limit]
        print(f"Limited to {len(tasks)} tasks")
    
    # Generate titles
    print("\nGenerating titles...\n")
    print("=" * 80)
    results = []
    errors = 0
    skipped = 0
    
    for i, task in enumerate(tasks, 1):
        # Progress header
        desc_preview = task['description'][:80].replace('\n', ' ') + "..." if len(task['description']) > 80 else task['description'].replace('\n', ' ')
        print(f"\n[{i}/{len(tasks)}] {task.get('category', 'Unknown')} / {task.get('subcategory', '')}")
        print(f"    Description: {desc_preview}")
        sys.stdout.flush()  # Force immediate output
        
        # Check if we already have a title for this task
        if task['id'] in existing_titles:
            task['title'] = existing_titles[task['id']]
            print(f"    ⏭️  Skipped (already has title): {task['title']}")
            skipped += 1
        else:
            print(f"    ⏳ Generating title...", end='', flush=True)
            start_time = time.time()
            task['title'] = generate_title(client, task)
            elapsed = time.time() - start_time
            if task['title']:
                print(f" ({elapsed:.1f}s)")
                print(f"    ✅ Title: {task['title']}")
            else:
                print(f" ({elapsed:.1f}s)")
                print(f"    ❌ Failed to generate title")
                errors += 1
            sys.stdout.flush()  # Force immediate output
            # Small delay to avoid rate limits
            time.sleep(0.1)
        
        results.append(task)
    
    print("\n" + "=" * 80)
    
    # Write output CSV
    print(f"\nWriting results to: {output_path}")
    fieldnames = ['id', 'title', 'category', 'subcategory', 'subsubcategory', 'description', 'difficulty', 'tags']
    
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    # Summary
    titles_generated = sum(1 for t in results if t.get('title'))
    print(f"\n✅ Done!")
    print(f"   Tasks processed: {len(results)}")
    print(f"   Titles generated: {titles_generated - skipped}")
    print(f"   Skipped (existing): {skipped}")
    if errors:
        print(f"   ❌ Errors: {errors}")
    print(f"   Output file: {output_path}")


if __name__ == '__main__':
    main()
