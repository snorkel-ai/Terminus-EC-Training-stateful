#!/usr/bin/env python3
"""
Export all tasks from Supabase to a CSV file for title generation.

Usage:
    python export_tasks.py

Output:
    tasks_export.csv - Contains id, category, subcategory, subsubcategory, description, difficulty, tags
"""

import csv
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env.local in project root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.local'))

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABSE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError(
        "Missing environment variables. Ensure VITE_SUPABASE_URL and SUPABSE_SERVICE_KEY "
        "are set in .env.local"
    )

def get_supabase_client() -> Client:
    """Create Supabase client with service role key for admin access."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def export_tasks():
    """Export all tasks to CSV."""
    supabase = get_supabase_client()
    
    # Fetch all tasks (paginated to handle >1000 rows)
    all_tasks = []
    page_size = 1000
    offset = 0
    
    print("Fetching tasks from Supabase...")
    
    while True:
        response = supabase.table('task_inspiration') \
            .select('id, category, subcategory, subsubcategory, description, difficulty, tags') \
            .range(offset, offset + page_size - 1) \
            .execute()
        
        tasks = response.data
        all_tasks.extend(tasks)
        
        print(f"  Fetched {len(tasks)} tasks (total: {len(all_tasks)})")
        
        if len(tasks) < page_size:
            break
        offset += page_size
    
    print(f"\nTotal tasks fetched: {len(all_tasks)}")
    
    # Write to CSV
    output_file = os.path.join(os.path.dirname(__file__), 'tasks_export.csv')
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['id', 'category', 'subcategory', 'subsubcategory', 'description', 'difficulty', 'tags']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for task in all_tasks:
            # Convert tags array to comma-separated string for CSV
            task['tags'] = ','.join(task.get('tags') or [])
            writer.writerow(task)
    
    print(f"\n✅ Exported to: {output_file}")
    return output_file

if __name__ == '__main__':
    export_tasks()
