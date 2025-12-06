import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskCount, setActiveTaskCount] = useState(0);

  useEffect(() => {
    fetchTasks();
    if (user) {
      fetchActiveTaskCount();
    }
  }, [user]);

  const fetchActiveTaskCount = async () => {
    if (!user) {
      setActiveTaskCount(0);
      return;
    }
    
    try {
      // Get count of active tasks (claimed or in_progress)
      const { data, error: countError } = await supabase
        .from('selected_tasks')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['claimed', 'in_progress']);
      
      if (countError) throw countError;
      setActiveTaskCount(data?.length || 0);
    } catch (err) {
      console.error('Error fetching active task count:', err);
    }
  };

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

    // Check claim limit before attempting
    if (activeTaskCount >= MAX_ACTIVE_TASKS) {
      throw new Error(`You can only have up to ${MAX_ACTIVE_TASKS} active tasks. Submit tasks for review or complete them to claim more.`);
    }

    try {
      const { error: insertError } = await supabase
        .from('selected_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId,
          status: 'claimed'
        });

      if (insertError) {
        // Check if it's a unique constraint violation (task already selected)
        if (insertError.code === '23505') {
          throw new Error('This task has already been selected by another user');
        }
        // Check for claim limit error from database trigger
        if (insertError.code === 'P0001') {
          throw new Error(insertError.message);
        }
        throw insertError;
      }

      // Optimistically update local state
      const now = new Date().toISOString();
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, is_selected: true, selected_at: now } : t
        )
      );
      setActiveTaskCount(prev => prev + 1);

      return true;
    } catch (err) {
      console.error('Error selecting task:', err);
      // Revert optimistic update on error
      await fetchTasks();
      await fetchActiveTaskCount();
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
    activeTaskCount,
    canClaimMore: activeTaskCount < MAX_ACTIVE_TASKS,
    refetch: fetchTasks,
    refetchActiveCount: fetchActiveTaskCount,
    selectTask,
    unselectTask
  };
}

// Task status constants
export const TASK_STATUS = {
  CLAIMED: 'claimed',
  IN_PROGRESS: 'in_progress',
  WAITING_REVIEW: 'waiting_review',
  ACCEPTED: 'accepted'
};

// Status display labels
export const TASK_STATUS_LABELS = {
  [TASK_STATUS.CLAIMED]: 'Claimed',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.WAITING_REVIEW]: 'Waiting on Review',
  [TASK_STATUS.ACCEPTED]: 'Accepted'
};

// Max active tasks (claimed or in_progress) a user can have
export const MAX_ACTIVE_TASKS = 3;

export function useMySelectedTasks() {
  const { user } = useAuth();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskCount, setActiveTaskCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMySelectedTasks();
    }
  }, [user]);

  const fetchMySelectedTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's task IDs with all workflow fields
      const { data: selections, error: selectError } = await supabase
        .from('selected_tasks')
        .select('task_id, selected_at, first_commit_at, completed_at, status, started_at, submitted_for_review_at')
        .eq('user_id', user.id);

      if (selectError) throw selectError;

      if (!selections || selections.length === 0) {
        setSelectedTasks([]);
        setActiveTaskCount(0);
        setLoading(false);
        return;
      }

      // Calculate active task count (claimed or in_progress)
      const activeCount = selections.filter(s => 
        s.status === TASK_STATUS.CLAIMED || s.status === TASK_STATUS.IN_PROGRESS
      ).length;
      setActiveTaskCount(activeCount);

      const taskIds = selections.map(s => s.task_id);

      // Fetch full task details with priorities
      const { data, error: fetchError } = await supabase
        .from('v_tasks_with_priorities')
        .select('*')
        .in('id', taskIds);

      if (fetchError) throw fetchError;

      // Add workflow fields to each task
      const formattedData = data?.map(task => {
        const selection = selections.find(s => s.task_id === task.id);
        return {
          ...task,
          selected_at: selection?.selected_at,
          first_commit_at: selection?.first_commit_at,
          completed_at: selection?.completed_at,
          status: selection?.status || TASK_STATUS.CLAIMED,
          started_at: selection?.started_at,
          submitted_for_review_at: selection?.submitted_for_review_at
        };
      }).sort((a, b) => {
        // Sort by status priority, then selection date
        const statusOrder = {
          [TASK_STATUS.IN_PROGRESS]: 0,
          [TASK_STATUS.CLAIMED]: 1,
          [TASK_STATUS.WAITING_REVIEW]: 2,
          [TASK_STATUS.ACCEPTED]: 3
        };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.selected_at) - new Date(a.selected_at);
      }) || [];

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

  // Update task status with proper workflow transitions
  const updateTaskStatus = async (taskId, newStatus) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const now = new Date().toISOString();
      const updateData = { status: newStatus };
      
      // Set appropriate timestamp based on new status
      if (newStatus === TASK_STATUS.IN_PROGRESS) {
        updateData.started_at = now;
      } else if (newStatus === TASK_STATUS.WAITING_REVIEW) {
        updateData.submitted_for_review_at = now;
      } else if (newStatus === TASK_STATUS.ACCEPTED) {
        updateData.completed_at = now;
      }
      
      const { error: updateError } = await supabase
        .from('selected_tasks')
        .update(updateData)
        .match({ user_id: user.id, task_id: taskId });

      if (updateError) throw updateError;

      // Optimistically update local state
      setSelectedTasks(prev => {
        const updated = prev.map(task => 
          task.id === taskId ? { ...task, ...updateData } : task
        );
        // Re-sort by status priority
        const statusOrder = {
          [TASK_STATUS.IN_PROGRESS]: 0,
          [TASK_STATUS.CLAIMED]: 1,
          [TASK_STATUS.WAITING_REVIEW]: 2,
          [TASK_STATUS.ACCEPTED]: 3
        };
        return updated.sort((a, b) => {
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return new Date(b.selected_at) - new Date(a.selected_at);
        });
      });

      // Update active task count
      if (newStatus === TASK_STATUS.WAITING_REVIEW || newStatus === TASK_STATUS.ACCEPTED) {
        setActiveTaskCount(prev => Math.max(0, prev - 1));
      } else if (newStatus === TASK_STATUS.CLAIMED || newStatus === TASK_STATUS.IN_PROGRESS) {
        // This would only happen if reopening a task
        setActiveTaskCount(prev => prev + 1);
      }

      return true;
    } catch (err) {
      console.error('Error updating task status:', err);
      await fetchMySelectedTasks();
      throw err;
    }
  };

  // Convenience methods for status transitions
  const startTask = (taskId) => updateTaskStatus(taskId, TASK_STATUS.IN_PROGRESS);
  const submitForReview = (taskId) => updateTaskStatus(taskId, TASK_STATUS.WAITING_REVIEW);
  const acceptTask = (taskId) => updateTaskStatus(taskId, TASK_STATUS.ACCEPTED);
  
  // Re-open a task (from waiting_review back to in_progress)
  const reopenTask = async (taskId) => {
    if (!user) throw new Error('User not authenticated');
    
    // Check if user can have more active tasks
    if (activeTaskCount >= MAX_ACTIVE_TASKS) {
      throw new Error(`You can only have up to ${MAX_ACTIVE_TASKS} active tasks. Submit tasks for review or wait for acceptance to free up slots.`);
    }
    
    return updateTaskStatus(taskId, TASK_STATUS.IN_PROGRESS);
  };

  // Legacy methods for backward compatibility
  const completeTask = acceptTask;
  const uncompleteTask = reopenTask;

  const markFirstCommit = async (taskId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const now = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('selected_tasks')
        .update({ first_commit_at: now })
        .match({ user_id: user.id, task_id: taskId });

      if (updateError) throw updateError;

      // Optimistically update local state
      setSelectedTasks(prev => 
        prev.map(t => 
          t.id === taskId ? { ...t, first_commit_at: now } : t
        )
      );

      return true;
    } catch (err) {
      console.error('Error marking first commit:', err);
      await fetchMySelectedTasks();
      throw err;
    }
  };

  return {
    selectedTasks,
    loading,
    error,
    activeTaskCount,
    canClaimMore: activeTaskCount < MAX_ACTIVE_TASKS,
    refetch: fetchMySelectedTasks,
    unselectTask,
    markFirstCommit,
    // New workflow methods
    startTask,
    submitForReview,
    acceptTask,
    reopenTask,
    updateTaskStatus,
    // Legacy methods (for backward compatibility)
    completeTask,
    uncompleteTask
  };
}
