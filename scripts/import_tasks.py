#!/usr/bin/env python3
"""
Script to import unassigned tasks from CSV into Supabase.
Clears existing tasks and inserts only tasks without an assigned expert.

Usage:
    python scripts/import_tasks.py /path/to/tasks.csv
"""

import csv
import os
import sys
from pathlib import Path
from typing import List, Dict

try:
    from dotenv import load_dotenv
except ImportError:
    print("Error: python-dotenv not installed. Run: pip install python-dotenv")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

# Load .env file from project root (try .env.local first, then .env)
project_root = Path(__file__).parent.parent
env_local = project_root / ".env.local"
env_file = project_root / ".env"

if env_local.exists():
    load_dotenv(env_local)
elif env_file.exists():
    load_dotenv(env_file)
else:
    print(f"Warning: No .env or .env.local found at {project_root}")

# Supabase configuration
SUPABASE_URL = "https://ntmiycfydldoremofrbf.supabase.co"
BATCH_SIZE = 100  # Number of rows to insert at once


def get_supabase_client() -> Client:
    """Create Supabase client with service key."""
    # Note: using SUPABSE_SERVICE_KEY as defined in .env (with typo)
    service_key = os.environ.get("SUPABSE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY")
    if not service_key:
        print("Error: SUPABSE_SERVICE_KEY not found in .env file")
        print("Add it to your .env: SUPABSE_SERVICE_KEY=your-service-key")
        sys.exit(1)
    
    return create_client(SUPABASE_URL, service_key)


def parse_csv(csv_path: str) -> List[Dict]:
    """Parse CSV and return only unassigned tasks."""
    tasks = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        for row in reader:
            if len(row) >= 5:
                expert_assigned = row[0].strip()
                category = row[1].strip()
                subcategory = row[2].strip() if len(row) > 2 else None
                subsubcategory = row[3].strip() if len(row) > 3 else None
                description = row[4].strip() if len(row) > 4 else ""
                
                # Only include unassigned tasks (empty first column)
                if not expert_assigned and description:
                    tasks.append({
                        "category": category,
                        "subcategory": subcategory or None,
                        "subsubcategory": subsubcategory or None,
                        "description": description
                    })
    
    return tasks


def clear_existing_data(client: Client):
    """Clear all existing task data (respecting FK constraints)."""
    print("Clearing existing data...")
    
    # Delete in order of FK dependencies
    print("  - Deleting task_claim_history...")
    client.table("task_claim_history").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("  - Deleting selected_tasks...")
    client.table("selected_tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("  - Deleting task_inspiration...")
    client.table("task_inspiration").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("  Done!")


def insert_tasks(client: Client, tasks: List[Dict]):
    """Insert tasks in batches."""
    total = len(tasks)
    inserted = 0
    
    print(f"\nInserting {total} tasks in batches of {BATCH_SIZE}...")
    
    for i in range(0, total, BATCH_SIZE):
        batch = tasks[i:i + BATCH_SIZE]
        
        try:
            client.table("task_inspiration").insert(batch).execute()
            inserted += len(batch)
            print(f"  Inserted {inserted}/{total} tasks ({100*inserted//total}%)")
        except Exception as e:
            print(f"  Error inserting batch {i//BATCH_SIZE}: {e}")
            # Continue with next batch
    
    return inserted


def main():
    if len(sys.argv) < 2:
        print("Usage: python import_tasks.py <csv_path>")
        print("Example: python import_tasks.py ~/Downloads/tasks.csv")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    if not os.path.exists(csv_path):
        print(f"Error: File not found: {csv_path}")
        sys.exit(1)
    
    # Parse CSV
    print(f"Reading CSV: {csv_path}")
    tasks = parse_csv(csv_path)
    print(f"Found {len(tasks)} unassigned tasks to import")
    
    if not tasks:
        print("No tasks to import!")
        sys.exit(0)
    
    # Connect to Supabase
    print("\nConnecting to Supabase...")
    client = get_supabase_client()
    
    # Clear existing data
    clear_existing_data(client)
    
    # Insert new tasks
    inserted = insert_tasks(client, tasks)
    
    # Verify
    print("\nVerifying...")
    result = client.table("task_inspiration").select("id", count="exact").execute()
    final_count = result.count
    
    print(f"\n✅ Complete! {final_count} tasks now in database.")


if __name__ == "__main__":
    main()
