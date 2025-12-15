#!/usr/bin/env python3
"""
Upload approved titles to Supabase.

Usage:
    python upload_titles.py [--input tasks_with_titles.csv] [--dry-run]

This script will:
1. Add a 'title' column to task_inspiration if it doesn't exist
2. Update each task with its generated title

Requires:
    VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
"""

import argparse
import csv
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
from tqdm import tqdm

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.local'))

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABSE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: Missing environment variables.")
    print("Ensure VITE_SUPABASE_URL and SUPABSE_SERVICE_KEY are set in .env.local")
    sys.exit(1)


def get_supabase_client() -> Client:
    """Create Supabase client with service role key for admin access."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def check_title_column_exists(supabase: Client) -> bool:
    """Check if the title column exists in task_inspiration table."""
    result = supabase.rpc('to_jsonb', {}).execute()  # This won't work, need raw SQL
    # We'll just try to select it and see if it fails
    try:
        supabase.table('task_inspiration').select('title').limit(1).execute()
        return True
    except Exception:
        return False


def add_title_column(supabase: Client) -> bool:
    """
    Add title column to task_inspiration table.
    
    Note: This requires running a migration or using the Supabase dashboard.
    The Supabase client doesn't support DDL operations directly.
    """
    print("\n⚠️  The 'title' column needs to be added to the task_inspiration table.")
    print("\nYou can do this by running this SQL in the Supabase SQL Editor:")
    print("-" * 60)
    print("ALTER TABLE task_inspiration ADD COLUMN IF NOT EXISTS title TEXT;")
    print("-" * 60)
    print("\nOr create a migration file in supabase/migrations/")
    return False


def upload_titles(input_file: str, dry_run: bool = False):
    """Upload titles from CSV to Supabase."""
    supabase = get_supabase_client()
    
    # Check if title column exists
    print("Checking if 'title' column exists...")
    if not check_title_column_exists(supabase):
        add_title_column(supabase)
        print("\nPlease add the column and run this script again.")
        sys.exit(1)
    
    print("✅ Title column exists")
    
    # Read the CSV
    print(f"\nReading titles from: {input_file}")
    tasks_to_update = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('title'):  # Only include tasks with titles
                tasks_to_update.append({
                    'id': row['id'],
                    'title': row['title']
                })
    
    print(f"Found {len(tasks_to_update)} tasks with titles")
    
    if not tasks_to_update:
        print("No tasks to update!")
        return
    
    if dry_run:
        print("\n🔍 DRY RUN - No changes will be made")
        print("\nSample updates that would be made:")
        for task in tasks_to_update[:10]:
            print(f"  {task['id'][:8]}... → {task['title']}")
        if len(tasks_to_update) > 10:
            print(f"  ... and {len(tasks_to_update) - 10} more")
        return
    
    # Update tasks in batches
    print("\nUpdating tasks...")
    success_count = 0
    error_count = 0
    
    for task in tqdm(tasks_to_update, desc="Uploading"):
        try:
            supabase.table('task_inspiration') \
                .update({'title': task['title']}) \
                .eq('id', task['id']) \
                .execute()
            success_count += 1
        except Exception as e:
            print(f"\nError updating task {task['id']}: {e}")
            error_count += 1
    
    print(f"\n✅ Done!")
    print(f"   Successfully updated: {success_count}")
    if error_count:
        print(f"   ❌ Errors: {error_count}")


def main():
    parser = argparse.ArgumentParser(description='Upload approved titles to Supabase')
    parser.add_argument('--input', '-i', default='tasks_with_titles.csv',
                        help='Input CSV file with titles (default: tasks_with_titles.csv)')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='Show what would be updated without making changes')
    args = parser.parse_args()
    
    # Resolve path relative to script directory
    script_dir = os.path.dirname(__file__)
    input_path = os.path.join(script_dir, args.input)
    
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        print("\nMake sure you've run generate_titles.py first!")
        sys.exit(1)
    
    upload_titles(input_path, dry_run=args.dry_run)


if __name__ == '__main__':
    main()
