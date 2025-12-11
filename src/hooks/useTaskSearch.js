import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing task search/filter state.
 * Search is triggered explicitly via applySearch (when user presses Enter).
 * No controlled input state - the input is uncontrolled for zero latency.
 */
export function useTaskSearch(tasks = [], initialFilters = {}) {
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    difficulties: [],
    priorityOnly: false,
    search: '',
    ...initialFilters
  });
  const [sortOption, setSortOption] = useState('priority');

  // Apply search - called when user presses Enter in search input
  const applySearch = useCallback((searchValue) => {
    setFilters(prev => ({ ...prev, search: searchValue || '' }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      subcategories: [],
      difficulties: [],
      priorityOnly: false,
      search: ''
    });
  }, []);

  // Filter and sort tasks based on current filters
  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      // Always hide already selected tasks
      if (task.is_selected) return false;
      
      // Filter by priority
      if (filters.priorityOnly && !task.is_highlighted) {
        return false;
      }
      
      // Filter by categories
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false;
      }
      
      // Filter by subcategories
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(task.subcategory)) {
        return false;
      }
      
      // Filter by difficulty
      if (filters.difficulties.length > 0) {
        const taskDifficulty = task.difficulty?.toLowerCase() || 'unknown';
        if (!filters.difficulties.includes(taskDifficulty)) {
          return false;
        }
      }
      
      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesCategory = task.category?.toLowerCase().includes(searchLower);
        const matchesSubcategory = task.subcategory?.toLowerCase().includes(searchLower);
        const matchesSubsubcategory = task.subsubcategory?.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        
        if (!matchesCategory && !matchesSubcategory && !matchesSubsubcategory && !matchesDescription) {
          return false;
        }
      }
      
      return true;
    });

    // Sort filtered tasks
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'priority':
          // First by highlighted status
          if (a.is_highlighted !== b.is_highlighted) {
            return a.is_highlighted ? -1 : 1;
          }
          // Then by display_order (if available)
          if (a.display_order !== b.display_order) {
            return (a.display_order || 999) - (b.display_order || 999);
          }
          // Finally alphabetical by category/subcategory
          return (a.category || '').localeCompare(b.category || '');
          
        case 'difficulty_asc': {
          const diffMapAsc = { 'easy': 1, 'medium': 2, 'hard': 3, 'unknown': 4 };
          const daAsc = diffMapAsc[a.difficulty?.toLowerCase()] || 4;
          const dbAsc = diffMapAsc[b.difficulty?.toLowerCase()] || 4;
          if (daAsc !== dbAsc) return daAsc - dbAsc;
          return 0;
        }

        case 'difficulty_desc': {
          const diffMapDesc = { 'easy': 1, 'medium': 2, 'hard': 3, 'unknown': 0 };
          const daDesc = diffMapDesc[a.difficulty?.toLowerCase()] || 0;
          const dbDesc = diffMapDesc[b.difficulty?.toLowerCase()] || 0;
          if (daDesc !== dbDesc) return dbDesc - daDesc;
          return 0;
        }

        case 'alpha_asc':
          return (a.subcategory || a.description || '').localeCompare(b.subcategory || b.description || '');

        default:
          return 0;
      }
    });
  }, [tasks, filters, sortOption]);

  return {
    // Filters
    filters,
    setFilters,
    sortOption,
    setSortOption,
    
    // Results
    filteredTasks,
    
    // Actions
    applySearch,
    clearSearch,
    clearAllFilters
  };
}
