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
- **Length**: 4-8 words typically
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

**Avoid:**
- Generic verbs: "Work on", "Deal with", "Handle"
- Passive constructions: "Be able to", "Learn about"
- Academic framing: "Study", "Explore", "Investigate" (unless research-oriented)

### Pattern Examples

**Good patterns:**
- Build [a/an] [technical component] [using/with/for] [method/technology]
- Implement [system/algorithm] [for] [use case]
- Debug [specific problem] [in] [environment/context]
- Create [tool] [that does X]
- Optimize [component] [for] [metric/goal]

**Examples:**
- Build an Exoplanet Transit Detection Pipeline
- Implement OAuth 2.0 Authentication for Microservices
- Debug Memory Leaks in Multi-threaded C++ Application
- Create a Real-time Log Aggregation System with Kafka
- Optimize Database Queries for High-Traffic APIs
- Configure Kubernetes Auto-scaling with Custom Metrics
- Parse and Transform JSON Logs into Parquet Format

### What Makes a Bad Title
❌ "Networking Task" - Too vague, no action verb
❌ "Learn about Docker Networking" - Academic framing, not implementation-focused
❌ "Deal with Authentication Issues" - Weak verb, unclear scope
❌ "Advanced Machine Learning Pipeline Development Project" - Too long, buzzword-heavy
❌ "Exoplanet Detection" - Missing verb, could be theoretical

### What Makes a Good Title
✅ "Build a Docker Network Isolation System"
✅ "Debug JWT Authentication Failures in Express API"
✅ "Implement Distributed Training Pipeline for BERT"
✅ "Detect Exoplanets Using Box Least Squares Analysis"

## Output Format
Provide only the title, no explanation or additional text."""


def generate_title(client: OpenAI, task: dict) -> str:
    """Generate a title for a single task."""
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
            model="gpt-4o-mini",  # Cost-effective for this task
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=50,
            temperature=0.3  # Lower temperature for more consistent output
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"\nError generating title for task {task.get('id', 'unknown')}: {e}")
        return ""


def main():
    parser = argparse.ArgumentParser(description='Generate titles for tasks using LLM')
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
    print("\nGenerating titles...")
    results = []
    
    for task in tqdm(tasks, desc="Processing"):
        # Check if we already have a title for this task
        if task['id'] in existing_titles:
            task['title'] = existing_titles[task['id']]
        else:
            task['title'] = generate_title(client, task)
            # Small delay to avoid rate limits
            time.sleep(0.1)
        
        results.append(task)
    
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
    print(f"   Titles generated: {titles_generated}")
    print(f"   Output file: {output_path}")
    
    # Show a few examples
    print("\n📝 Sample titles:")
    for task in results[:5]:
        if task.get('title'):
            print(f"   • {task['title']}")


if __name__ == '__main__':
    main()
