import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for the TBench v2 task gallery with optimized loading.
 * 
 * Queries task_inspiration_v2 via v2 RPC functions.
 * Loads 15 tasks per type on mount, supports lazy category loading and search.
 * Subscribes to realtime updates on selected_tasks to keep claim state in sync.
 */
export function useTasksGallery() {
  const [previewTasks, setPreviewTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [typeCounts, setTypeCounts] = useState({});
  
  const [categoryCache, setCategoryCache] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);
  
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const isFetchingRef = useRef(false);

  const fetchPreview = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      
      const [previewResult, countsResult] = await Promise.all([
        supabase.rpc('get_tasks_v2_preview_by_type', { tasks_per_type: 15 }),
        supabase.rpc('get_type_counts_v2')
      ]);

      if (previewResult.error) throw previewResult.error;
      if (countsResult.error) throw countsResult.error;

      setPreviewTasks(previewResult.data || []);
      
      const countsMap = {};
      (countsResult.data || []).forEach(row => {
        countsMap[row.type] = {
          total: row.total_count,
          available: row.available_count
        };
      });
      setTypeCounts(countsMap);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching task preview:', err);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  const fetchCategory = useCallback(async (type) => {
    if (categoryCache[type]) {
      return categoryCache[type];
    }

    try {
      setLoadingCategory(type);
      
      const { data, error: fetchError } = await supabase
        .rpc('get_tasks_v2_by_type', { target_type: type });

      if (fetchError) throw fetchError;

      setCategoryCache(prev => ({
        ...prev,
        [type]: data || []
      }));

      return data || [];
    } catch (err) {
      console.error(`Error fetching type ${type}:`, err);
      throw err;
    } finally {
      setLoadingCategory(null);
    }
  }, [categoryCache]);

  const searchTasks = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults(null);
      return null;
    }

    try {
      setSearchLoading(true);
      
      const { data, error: fetchError } = await supabase
        .rpc('search_tasks_v2', { search_query: query.trim(), max_results: 100 });

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

  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  const getTasksForCategory = useCallback((type) => {
    if (categoryCache[type]) {
      return categoryCache[type];
    }
    return previewTasks.filter(t => t.type === type);
  }, [categoryCache, previewTasks]);

  const categoryHasMore = useCallback((type) => {
    const previewCount = previewTasks.filter(t => t.type === type).length;
    return previewCount >= 15;
  }, [previewTasks]);

  const getCategoryCount = useCallback((type) => {
    return typeCounts[type] || { total: 0, available: 0 };
  }, [typeCounts]);

  const categories = [...new Set(previewTasks.map(t => t.type))].sort();

  // Update a task's selected status in local state (for realtime updates)
  const updateTaskSelection = useCallback((taskId, isSelected) => {
    setPreviewTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, is_selected: isSelected } : t
    ));
    
    setCategoryCache(prev => {
      const updated = {};
      for (const [cat, tasks] of Object.entries(prev)) {
        updated[cat] = tasks.map(t => 
          t.id === taskId ? { ...t, is_selected: isSelected } : t
        );
      }
      return updated;
    });

    if (searchResults) {
      setSearchResults(prev => prev.map(t => 
        t.id === taskId ? { ...t, is_selected: isSelected } : t
      ));
    }
  }, [searchResults]);

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
    previewTasks,
    categories,
    categoryCounts: typeCounts,
    searchResults,
    
    loading,
    error,
    loadingCategory,
    searchLoading,
    
    fetchPreview,
    fetchCategory,
    searchTasks,
    clearSearch,
    
    getTasksForCategory,
    categoryHasMore,
    getCategoryCount,
    updateTaskSelection,
  };
}
