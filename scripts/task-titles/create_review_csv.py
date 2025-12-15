#!/usr/bin/env python3
"""Create a clean review CSV with just id, title, description."""
import csv

with open('tasks_batch_40.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

with open('tasks_review_40.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['id', 'title', 'description'])
    writer.writeheader()
    for row in rows:
        writer.writerow({
            'id': row['id'],
            'title': row['title'],
            'description': row['description']
        })

print(f'✅ Created tasks_review_40.csv with {len(rows)} tasks')
