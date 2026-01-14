import { useState, useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const TASKS_CACHE_KEY = 'tasks_cache_v5'; // v5: Added title field
const TASKS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes (increased from 5 to reduce API calls)

// Helper to get cached tasks from localStorage
const getCachedTasks = () => {
  try {
    const cached = localStorage.getItem(TASKS_CACHE_KEY);
    if (!cached) return null;
    
    const { tasks, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > TASKS_CACHE_TTL;
    
    // Return cached data even if expired (we'll refresh in background)
    return { tasks, isExpired };
  } catch {
    return null;
  }
};

// Helper to save tasks to localStorage
const setCachedTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify({
      tasks,
      timestamp: Date.now()
    }));
  } catch {
    // localStorage might be full or disabled
  }
};

// Helper to update a single task's selection status in cache
// Used when claiming/abandoning tasks from other pages
export const updateTaskCacheSelection = (taskId, isSelected) => {
  try {
    const cached = getCachedTasks();
    if (!cached?.tasks) return;
    
    const updatedTasks = cached.tasks.map(t => 
      t.id === taskId ? { ...t, is_selected: isSelected } : t
    );
    setCachedTasks(updatedTasks);
  } catch {
    // Ignore cache errors
  }
};

/**
 * @deprecated This hook loads ALL 1600+ tasks (~1MB) and should not be used.
 * Use useMySelectedTasks() instead for task claiming/management.
 * Use useTasksGallery() for the task gallery with optimized loading.
 * 
 * This hook is kept for backwards compatibility but should be removed
 * once we verify no code paths depend on it.
 */
export function useTasks() {
  const { user } = useAuth();
  const posthog = usePostHog();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const channelRef = useRef(null);
  const isSubscribedRef = useRef(false);
  const isFetchingRef = useRef(false);

  // Fetch function - updates both state and cache
  // Uses pagination because Supabase API limits to 1000 rows per request (PGRST_DB_MAX_ROWS)
  const fetchTasksInternal = async () => {
    // Prevent duplicate concurrent fetches
    if (isFetchingRef.current) return null;
    isFetchingRef.current = true;
    
    try {
      const PAGE_SIZE = 1000;
      let allTasks = [];
      let page = 0;
      let hasMore = true;

      // Fetch all pages until we get less than PAGE_SIZE results
      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        
        // Select columns needed for task list UI (includes description for previews)
        // Egress reduced via: 30-min cache, refresh only when expired, excludes tags array
        const { data, error: fetchError } = await supabase
          .from('v_tasks_with_priorities')
          .select('id, category, subcategory, subsubcategory, title, description, difficulty, is_selected, is_highlighted, priority_tag, tag_label, display_order, is_promoted, promo_multiplier, promo_title')
          .order('is_promoted', { ascending: false })
          .order('display_order', { ascending: true, nullsFirst: false })
          .order('is_highlighted', { ascending: false })
          .order('category', { ascending: true })
          .order('subcategory', { ascending: true })
          .range(from, to);

        if (fetchError) throw fetchError;
        
        const pageData = data || [];
        allTasks = [...allTasks, ...pageData];
        
        // If we got less than PAGE_SIZE, we've reached the end
        hasMore = pageData.length === PAGE_SIZE;
        page++;
      }
      
      setTasks(allTasks);
      setCachedTasks(allTasks); // Update cache
      setError(null);
      return allTasks;
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      return null;
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Initial fetch and user-dependent data
  useEffect(() => {
    const initialFetch = async () => {
      // Cache-first strategy (optimized for reduced egress):
      // 1. Show cached data immediately if not expired
      // 2. Only fetch if cache is expired or missing
      const cachedData = getCachedTasks();
      
      if (cachedData?.tasks?.length) {
        // Show cache instantly - no loading spinner
        setTasks(cachedData.tasks);
        setLoading(false);
        
        // Only fetch if cache is actually expired (not on every page load)
        if (cachedData.isExpired) {
          fetchTasksInternal();
        }
      } else {
        // No cache - show loader and wait for fetch
        setLoading(true);
        await fetchTasksInternal();
        setLoading(false);
      }
    };
    
    initialFetch();
    
    if (user) {
      fetchActiveTaskCount();
    }
  }, [user]);

  // Separate effect for realtime subscription - runs once on mount
  useEffect(() => {
    // Prevent duplicate subscriptions (React StrictMode)
    if (isSubscribedRef.current) return;
    isSubscribedRef.current = true;

    // Subscribe to realtime changes on selected_tasks
    // This updates the task list when ANY user claims/unclaims a task
    const channel = supabase
      .channel('tasks_realtime_' + Date.now()) // Unique channel name
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'selected_tasks' },
        (payload) => {
          // Update just the affected task locally (no refetch needed!)
          // This is much faster than fetching all 1,446 tasks
          if (payload.eventType === 'INSERT' && payload.new?.task_id) {
            setTasks(prev => {
              const updated = prev.map(t => 
                t.id === payload.new.task_id 
                  ? { ...t, is_selected: true } 
                  : t
              );
              setCachedTasks(updated); // Keep cache in sync
              return updated;
            });
          } else if (payload.eventType === 'DELETE' && payload.old?.task_id) {
            setTasks(prev => {
              const updated = prev.map(t => 
                t.id === payload.old.task_id 
                  ? { ...t, is_selected: false } 
                  : t
              );
              setCachedTasks(updated); // Keep cache in sync
              return updated;
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup subscription on unmount
    return () => {
      isSubscribedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []); // Empty deps - only run once

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

  // Public refetch function that shows loading state
  const fetchTasks = async () => {
    setLoading(true);
    await fetchTasksInternal();
    setLoading(false);
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

      // Optimistically update local state and cache
      const now = new Date().toISOString();
      const claimedTask = tasks.find(t => t.id === taskId);
      setTasks(prevTasks => {
        const updated = prevTasks.map(t => 
          t.id === taskId ? { ...t, is_selected: true, selected_at: now } : t
        );
        setCachedTasks(updated);
        return updated;
      });
      setActiveTaskCount(prev => prev + 1);

      // Track task claimed event
      if (posthog && claimedTask) {
        posthog.capture('task_claimed', {
          task_id: taskId,
          category: claimedTask.category,
          subcategory: claimedTask.subcategory,
        });
      }

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

      // Optimistically update local state and cache
      setTasks(prevTasks => {
        const updated = prevTasks.map(t => 
          t.id === taskId ? { ...t, is_selected: false } : t
        );
        setCachedTasks(updated);
        return updated;
      });

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

// Cache for selected tasks (per user)
const SELECTED_TASKS_CACHE_KEY = 'selected_tasks_cache_v3'; // v3: Added title field

const getCachedSelectedTasks = (userId) => {
  try {
    const cached = localStorage.getItem(`${SELECTED_TASKS_CACHE_KEY}_${userId}`);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const setCachedSelectedTasks = (userId, tasks) => {
  try {
    localStorage.setItem(`${SELECTED_TASKS_CACHE_KEY}_${userId}`, JSON.stringify(tasks));
  } catch {
    // localStorage might be full or disabled
  }
};

export function useMySelectedTasks() {
  const { user } = useAuth();
  const posthog = usePostHog();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const channelRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (user) {
      // Stale-while-revalidate: show cached data immediately, fetch in background
      const cachedData = getCachedSelectedTasks(user.id);
      
      if (cachedData?.tasks?.length > 0) {
        // Show cache instantly - no loading spinner
        setSelectedTasks(cachedData.tasks);
        setActiveTaskCount(cachedData.activeCount || 0);
        setLoading(false);
        // Fetch fresh data in background (without showing loading)
        fetchMySelectedTasks(false);
      } else {
        // No cache - show loader and wait for fetch
        fetchMySelectedTasks(true);
      }

      // Subscribe to realtime changes for this user's tasks
      // This keeps the "My Tasks" page in sync with any changes
      channelRef.current = supabase
        .channel(`my_tasks_${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'selected_tasks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            // Refetch user's tasks on any change (without loading spinner)
            setTimeout(() => fetchMySelectedTasks(false), 100);
          }
        )
        .subscribe();

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
      };
    }
  }, [user]);

  const fetchMySelectedTasks = async (showLoading = true) => {
    // Prevent duplicate concurrent fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    try {
      if (showLoading) {
        setLoading(true);
      }
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
        isFetchingRef.current = false;
        if (user) {
          setCachedSelectedTasks(user.id, { tasks: [], activeCount: 0 });
        }
        return;
      }

      // Calculate active task count (claimed or in_progress)
      const activeCount = selections.filter(s => 
        s.status === TASK_STATUS.CLAIMED || s.status === TASK_STATUS.IN_PROGRESS
      ).length;
      setActiveTaskCount(activeCount);

      const taskIds = selections.map(s => s.task_id);

      // Fetch task details with priorities (includes title and description for My Tasks display)
      const { data, error: fetchError } = await supabase
        .from('v_tasks_with_priorities')
        .select('id, category, subcategory, subsubcategory, title, description, difficulty, is_selected, is_highlighted, priority_tag, tag_label, display_order, is_promoted, promo_multiplier, promo_title')
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
      
      // Cache the results
      if (user) {
        setCachedSelectedTasks(user.id, { tasks: formattedData, activeCount });
      }
    } catch (err) {
      console.error('Error fetching selected tasks:', err);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const unselectTask = async (taskId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Find the task first to check its status
      const taskToRemove = selectedTasks.find(t => t.id === taskId);
      
      const { error: deleteError } = await supabase
        .from('selected_tasks')
        .delete()
        .match({ user_id: user.id, task_id: taskId });

      if (deleteError) throw deleteError;

      // Track task abandonment
      if (posthog && taskToRemove) {
        posthog.capture('task_abandoned', {
          task_id: taskId,
          task_category: taskToRemove.category,
          task_subcategory: taskToRemove.subcategory,
          task_status_at_abandon: taskToRemove.status,
          task_difficulty: taskToRemove.difficulty,
        });
      }

      // Optimistically update local state
      setSelectedTasks(prev => prev.filter(t => t.id !== taskId));

      // Update tasks cache so abandoned task appears immediately
      updateTaskCacheSelection(taskId, false);

      // Update active task count if the removed task was active
      if (taskToRemove && (
          taskToRemove.status === TASK_STATUS.CLAIMED || 
          taskToRemove.status === TASK_STATUS.IN_PROGRESS
      )) {
        setActiveTaskCount(prev => Math.max(0, prev - 1));
      }

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
      const task = selectedTasks.find(t => t.id === taskId);
      
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

      // Track task status change events
      if (posthog && task) {
        const eventName = {
          [TASK_STATUS.IN_PROGRESS]: 'task_started',
          [TASK_STATUS.WAITING_REVIEW]: 'task_submitted_for_review',
          [TASK_STATUS.ACCEPTED]: 'task_accepted',
        }[newStatus];
        
        if (eventName) {
          posthog.capture(eventName, {
            task_id: taskId,
            category: task.category,
            subcategory: task.subcategory,
          });
        }
      }

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

  // Select/claim a task - moved here to avoid loading all 1600+ tasks via useTasks()
  const selectTask = async (taskId, taskMetadata = {}) => {
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

      // Update active task count
      setActiveTaskCount(prev => prev + 1);

      // Update tasks cache so claimed task shows as selected in gallery
      updateTaskCacheSelection(taskId, true);

      // Track task claimed event
      if (posthog) {
        posthog.capture('task_claimed', {
          task_id: taskId,
          category: taskMetadata.category,
          subcategory: taskMetadata.subcategory,
        });
      }

      // Refetch to get the full task data in selectedTasks
      await fetchMySelectedTasks(false);

      return true;
    } catch (err) {
      console.error('Error selecting task:', err);
      // Refetch to ensure state is accurate
      await fetchMySelectedTasks(false);
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
    selectTask,
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
