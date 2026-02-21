import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch random available tasks for the task roulette.
 * Uses database-side randomization to minimize egress (only fetches ~15 tasks instead of 1600+).
 */
export function useRandomTasks(count = 15) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchRandomTasks = useCallback(async (showLoading = true) => {
    // Prevent duplicate concurrent fetches
    if (isFetchingRef.current) return null;
    isFetchingRef.current = true;

    try {
      if (showLoading) {
        setLoading(true);
      }

      // Call the database function that does random selection server-side
      const { data, error: fetchError } = await supabase
        .rpc('get_random_available_tasks_v2', { task_count: count });

      if (fetchError) throw fetchError;

      setTasks(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching random tasks:', err);
      setError(err.message);
      return null;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [count]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchRandomTasks,
  };
}
