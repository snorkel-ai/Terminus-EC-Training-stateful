import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://ntmiycfydldoremofrbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWl5Y2Z5ZGxkb3JlbW9mcmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDUxNDcsImV4cCI6MjA3Nzg4MTE0N30.LvdzPQaM55tQ9t5yZt60K-lYNaKLRyTNtBQ92Mw5Kpc';

const supabase = createClient(supabaseUrl, supabaseKey);

const tasks = JSON.parse(readFileSync('/tmp/tasks_to_insert.json', 'utf-8'));

console.log(`Inserting ${tasks.length} tasks in batches of 100...`);

// Insert in batches of 100
const batchSize = 100;
let inserted = 0;
let errors = 0;

for (let i = 0; i < tasks.length; i += batchSize) {
  const batch = tasks.slice(i, i + batchSize);
  
  try {
    const { data, error } = await supabase
      .from('task_inspiration')
      .insert(batch);
    
    if (error) {
      console.error(`Error in batch ${Math.floor(i / batchSize)}:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
      console.log(`Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tasks.length / batchSize)}: Inserted ${batch.length} tasks (total: ${inserted})`);
    }
  } catch (err) {
    console.error(`Exception in batch ${Math.floor(i / batchSize)}:`, err.message);
    errors++;
  }
}

console.log(`\nCompleted: ${inserted} inserted, ${errors} errors`);

