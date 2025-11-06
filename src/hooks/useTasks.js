import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all tasks with their selection status and priorities
      const { data, error: fetchError } = await supabase
        .from('v_tasks_with_priorities')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('is_highlighted', { ascending: false })
        .order('category', { ascending: true })
        .order('subcategory', { ascending: true });

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectTask = async (taskId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await supabase
        .from('selected_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId
        });

      if (insertError) {
        // Check if it's a unique constraint violation (task already selected)
        if (insertError.code === '23505') {
          throw new Error('This task has already been selected by another user');
        }
        throw insertError;
      }

      // Optimistically update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, is_selected: true } : t
        )
      );

      return true;
    } catch (err) {
      console.error('Error selecting task:', err);
      // Revert optimistic update on error
      await fetchTasks();
      throw err;
    }
  };

  const unselectTask = async (taskId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('selected_tasks')
        .delete()
        .match({ user_id: user.id, task_id: taskId });

      if (deleteError) throw deleteError;

      // Optimistically update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, is_selected: false } : t
        )
      );

      return true;
    } catch (err) {
      console.error('Error unselecting task:', err);
      // Revert optimistic update on error
      await fetchTasks();
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    selectTask,
    unselectTask
  };
}

export function useMySelectedTasks() {
  const { user } = useAuth();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMySelectedTasks();
    }
  }, [user]);

  const fetchMySelectedTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's task IDs first
      const { data: selections, error: selectError } = await supabase
        .from('selected_tasks')
        .select('task_id, selected_at')
        .eq('user_id', user.id);

      if (selectError) throw selectError;

      if (!selections || selections.length === 0) {
        setSelectedTasks([]);
        setLoading(false);
        return;
      }

      const taskIds = selections.map(s => s.task_id);

      // Fetch full task details with priorities
      const { data, error: fetchError } = await supabase
        .from('v_tasks_with_priorities')
        .select('*')
        .in('id', taskIds);

      if (fetchError) throw fetchError;

      // Add selected_at timestamp to each task
      const formattedData = data?.map(task => {
        const selection = selections.find(s => s.task_id === task.id);
        return {
          ...task,
          selected_at: selection?.selected_at
        };
      }).sort((a, b) => new Date(b.selected_at) - new Date(a.selected_at)) || [];

      setSelectedTasks(formattedData);
    } catch (err) {
      console.error('Error fetching selected tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const unselectTask = async (taskId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('selected_tasks')
        .delete()
        .match({ user_id: user.id, task_id: taskId });

      if (deleteError) throw deleteError;

      // Optimistically update local state
      setSelectedTasks(prev => prev.filter(t => t.id !== taskId));

      return true;
    } catch (err) {
      console.error('Error unselecting task:', err);
      // Revert optimistic update on error
      await fetchMySelectedTasks();
      throw err;
    }
  };

  return {
    selectedTasks,
    loading,
    error,
    refetch: fetchMySelectedTasks,
    unselectTask
  };
}
