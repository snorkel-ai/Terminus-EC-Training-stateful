import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for the task gallery with optimized loading.
 * 
 * Instead of loading all 1600+ tasks, this hook:
 * 1. Loads first 15 tasks per category on mount (~135 total)
 * 2. Loads full category data on demand when exploring
 * 3. Supports server-side search
 * 4. Fetches accurate category counts separately
 * 
 * This dramatically reduces Postgres egress.
 */
export function useTasksGallery() {
  // Preview tasks (15 per category)
  const [previewTasks, setPreviewTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category counts (total and available per category)
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Cache for fully-loaded categories
  const [categoryCache, setCategoryCache] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);
  
  // Search state
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const isFetchingRef = useRef(false);

  // Fetch preview tasks (15 per category) and category counts
  const fetchPreview = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      
      // Fetch both preview tasks and category counts in parallel
      const [previewResult, countsResult] = await Promise.all([
        supabase.rpc('get_tasks_preview_by_category', { tasks_per_category: 15 }),
        supabase.rpc('get_category_counts')
      ]);

      if (previewResult.error) throw previewResult.error;
      if (countsResult.error) throw countsResult.error;

      setPreviewTasks(previewResult.data || []);
      
      // Convert counts array to lookup object
      const countsMap = {};
      (countsResult.data || []).forEach(row => {
        countsMap[row.category] = {
          total: row.total_count,
          available: row.available_count
        };
      });
      setCategoryCounts(countsMap);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching task preview:', err);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Fetch all tasks for a specific category
  const fetchCategory = useCallback(async (category) => {
    // Return cached data if available
    if (categoryCache[category]) {
      return categoryCache[category];
    }

    try {
      setLoadingCategory(category);
      
      const { data, error: fetchError } = await supabase
        .rpc('get_tasks_by_category', { target_category: category });

      if (fetchError) throw fetchError;

      // Cache the result
      setCategoryCache(prev => ({
        ...prev,
        [category]: data || []
      }));

      return data || [];
    } catch (err) {
      console.error(`Error fetching category ${category}:`, err);
      throw err;
    } finally {
      setLoadingCategory(null);
    }
  }, [categoryCache]);

  // Server-side search
  const searchTasks = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults(null);
      return null;
    }

    try {
      setSearchLoading(true);
      
      const { data, error: fetchError } = await supabase
        .rpc('search_tasks', { search_query: query.trim(), max_results: 100 });

      if (fetchError) throw fetchError;

      setSearchResults(data || []);
      return data || [];
    } catch (err) {
      console.error('Error searching tasks:', err);
      throw err;
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  // Get tasks for a category (from cache or preview)
  const getTasksForCategory = useCallback((category) => {
    // If we have full category data cached, use it
    if (categoryCache[category]) {
      return categoryCache[category];
    }
    // Otherwise return preview tasks for this category
    return previewTasks.filter(t => t.category === category);
  }, [categoryCache, previewTasks]);

  // Check if a category has more tasks than shown in preview
  const categoryHasMore = useCallback((category) => {
    const previewCount = previewTasks.filter(t => t.category === category).length;
    return previewCount >= 15; // If we have 15, there might be more
  }, [previewTasks]);

  // Get total/available count for a category
  const getCategoryCount = useCallback((category) => {
    return categoryCounts[category] || { total: 0, available: 0 };
  }, [categoryCounts]);

  // Get all unique categories from preview
  const categories = [...new Set(previewTasks.map(t => t.category))].sort();

  // Update a task's selected status in local state (for realtime updates)
  const updateTaskSelection = useCallback((taskId, isSelected) => {
    setPreviewTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, is_selected: isSelected } : t
    ));
    
    // Also update in category cache
    setCategoryCache(prev => {
      const updated = {};
      for (const [cat, tasks] of Object.entries(prev)) {
        updated[cat] = tasks.map(t => 
          t.id === taskId ? { ...t, is_selected: isSelected } : t
        );
      }
      return updated;
    });

    // Update search results if present
    if (searchResults) {
      setSearchResults(prev => prev.map(t => 
        t.id === taskId ? { ...t, is_selected: isSelected } : t
      ));
    }
  }, [searchResults]);

  // Initial fetch
  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  // Subscribe to realtime updates for selected_tasks
  useEffect(() => {
    const channel = supabase
      .channel('gallery_tasks_realtime_' + Date.now())
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'selected_tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new?.task_id) {
            updateTaskSelection(payload.new.task_id, true);
          } else if (payload.eventType === 'DELETE' && payload.old?.task_id) {
            updateTaskSelection(payload.old.task_id, false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateTaskSelection]);

  return {
    // Data
    previewTasks,
    categories,
    categoryCounts,
    searchResults,
    
    // Loading states
    loading,
    error,
    loadingCategory,
    searchLoading,
    
    // Actions
    fetchPreview,
    fetchCategory,
    searchTasks,
    clearSearch,
    
    // Helpers
    getTasksForCategory,
    categoryHasMore,
    getCategoryCount,
    updateTaskSelection,
  };
}
