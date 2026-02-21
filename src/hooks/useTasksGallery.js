import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const GALLERY_CACHE_KEY = 'gallery_v2_cache_v1';
const GALLERY_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getCachedGallery = () => {
  try {
    const cached = localStorage.getItem(GALLERY_CACHE_KEY);
    if (!cached) return null;

    const { previewTasks, typeCounts, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > GALLERY_CACHE_TTL;

    return { previewTasks, typeCounts, isExpired };
  } catch {
    return null;
  }
};

const setCachedGallery = (previewTasks, typeCounts) => {
  try {
    localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify({
      previewTasks,
      typeCounts,
      timestamp: Date.now()
    }));
  } catch {
    // localStorage might be full or disabled
  }
};

/**
 * Hook for the TBench v2 task gallery with optimized loading.
 * 
 * Queries task_inspiration_v2 via v2 RPC functions.
 * Loads 15 tasks per type on mount, supports lazy category loading and search.
 * Subscribes to realtime updates on selected_tasks to keep claim state in sync.
 * Uses stale-while-revalidate localStorage caching (30min TTL).
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

  const applyFetchedData = useCallback((previewData, countsData) => {
    setPreviewTasks(previewData);

    const countsMap = {};
    countsData.forEach(row => {
      countsMap[row.type] = {
        total: row.total_count,
        available: row.available_count
      };
    });
    setTypeCounts(countsMap);

    setCachedGallery(previewData, countsMap);
  }, []);

  const fetchPreview = useCallback(async (showLoading = true) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      if (showLoading) setLoading(true);
      
      const [previewResult, countsResult] = await Promise.all([
        supabase.rpc('get_tasks_v2_preview_by_type', { tasks_per_type: 15 }),
        supabase.rpc('get_type_counts_v2')
      ]);

      if (previewResult.error) throw previewResult.error;
      if (countsResult.error) throw countsResult.error;

      applyFetchedData(previewResult.data || [], countsResult.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching task preview:', err);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [applyFetchedData]);

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
    setPreviewTasks(prev => {
      const updated = prev.map(t => 
        t.id === taskId ? { ...t, is_selected: isSelected } : t
      );
      // Also update localStorage cache
      try {
        const cached = getCachedGallery();
        if (cached) {
          const updatedCached = cached.previewTasks.map(t =>
            t.id === taskId ? { ...t, is_selected: isSelected } : t
          );
          setCachedGallery(updatedCached, cached.typeCounts);
        }
      } catch { /* ignore */ }
      return updated;
    });
    
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

  // On mount: cache-first, then background refresh
  useEffect(() => {
    const cached = getCachedGallery();

    if (cached?.previewTasks?.length > 0) {
      setPreviewTasks(cached.previewTasks);
      setTypeCounts(cached.typeCounts || {});
      setLoading(false);

      if (cached.isExpired) {
        fetchPreview(false);
      }
    } else {
      fetchPreview(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
