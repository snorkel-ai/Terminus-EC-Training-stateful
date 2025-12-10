import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Custom hook for managing task search state with debouncing,
 * suggestion generation, and natural language parsing.
 */
export function useTaskSearch(tasks = [], initialFilters = {}) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    difficulties: [],
    priorityOnly: false,
    search: '',
    ...initialFilters
  });
  const [sortOption, setSortOption] = useState('priority');
  
  // Recent searches (persisted to localStorage)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('taskRecentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }, 150);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Save recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taskRecentSearches', JSON.stringify(recentSearches));
    } catch {
      // Ignore localStorage errors
    }
  }, [recentSearches]);

  // Add to recent searches
  const addToRecentSearches = useCallback((query) => {
    if (!query || query.trim().length < 2) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 5);
    });
  }, []);

  // Generate autocomplete suggestions based on current query
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];
    const seen = new Set();
    
    // Collect unique categories that match
    const matchingCategories = new Map();
    const matchingSubcategories = new Map();
    
    tasks.forEach(task => {
      if (task.is_selected) return;
      
      // Check category match
      if (task.category && task.category.toLowerCase().includes(query)) {
        if (!matchingCategories.has(task.category)) {
          matchingCategories.set(task.category, 0);
        }
        matchingCategories.set(task.category, matchingCategories.get(task.category) + 1);
      }
      
      // Check subcategory match
      if (task.subcategory && task.subcategory.toLowerCase().includes(query)) {
        if (!matchingSubcategories.has(task.subcategory)) {
          matchingSubcategories.set(task.subcategory, { count: 0, category: task.category });
        }
        const data = matchingSubcategories.get(task.subcategory);
        matchingSubcategories.set(task.subcategory, { ...data, count: data.count + 1 });
      }
    });
    
    // Add category suggestions
    [...matchingCategories.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([category, count]) => {
        if (!seen.has(category.toLowerCase())) {
          seen.add(category.toLowerCase());
          results.push({
            type: 'category',
            value: category,
            label: category,
            count
          });
        }
      });
    
    // Add subcategory suggestions
    [...matchingSubcategories.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .forEach(([subcategory, data]) => {
        if (!seen.has(subcategory.toLowerCase())) {
          seen.add(subcategory.toLowerCase());
          results.push({
            type: 'subcategory',
            value: subcategory,
            label: subcategory,
            count: data.count,
            parentCategory: data.category
          });
        }
      });
    
    // Extract potential keywords from matching task descriptions
    const keywordCounts = new Map();
    tasks.forEach(task => {
      if (task.is_selected) return;
      if (!task.description?.toLowerCase().includes(query)) return;
      
      // Extract significant words from description (basic keyword extraction)
      const words = task.description
        .split(/[\s,.\-/()[\]{}:;]+/)
        .filter(w => w.length > 3 && /^[a-zA-Z]+$/.test(w))
        .map(w => w.toLowerCase());
      
      const uniqueWords = [...new Set(words)];
      uniqueWords.forEach(word => {
        if (word.includes(query) && word !== query) {
          keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
        }
      });
    });
    
    // Add keyword suggestions
    [...keywordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([keyword, count]) => {
        if (!seen.has(keyword)) {
          seen.add(keyword);
          results.push({
            type: 'keyword',
            value: keyword,
            label: keyword,
            count
          });
        }
      });
    
    return results.slice(0, 8);
  }, [searchQuery, tasks]);

  // Parse natural language queries
  const parseNaturalLanguage = useCallback((query) => {
    const parsed = {
      searchTerms: [],
      categories: [],
      difficulties: []
    };
    
    const lowerQuery = query.toLowerCase();
    
    // Detect difficulty keywords
    if (lowerQuery.includes('easy')) {
      parsed.difficulties.push('easy');
    }
    if (lowerQuery.includes('medium') || lowerQuery.includes('moderate')) {
      parsed.difficulties.push('medium');
    }
    if (lowerQuery.includes('hard') || lowerQuery.includes('difficult') || lowerQuery.includes('challenging')) {
      parsed.difficulties.push('hard');
    }
    
    // Detect category-like patterns
    const categoryPatterns = [
      { pattern: /\b(ml|machine learning|ai|artificial intelligence)\b/i, category: 'Machine Learning & AI' },
      { pattern: /\b(security|crypto|cryptography|encryption)\b/i, category: 'Security & Cryptography' },
      { pattern: /\b(debug|troubleshoot|fix|error)\b/i, category: 'Debugging & Troubleshooting' },
      { pattern: /\b(data|processing|scripting|script)\b/i, category: 'Data Processing & Scripting' },
      { pattern: /\b(build|dependency|dependencies|compile)\b/i, category: 'Build & Dependency Management' },
      { pattern: /\b(system|setup|config|configuration)\b/i, category: 'System Setup & Configuration' },
      { pattern: /\b(software|engineering|development|code)\b/i, category: 'Software Engineering & Development' },
      { pattern: /\b(science|scientific|computing|analysis)\b/i, category: 'Scientific Computing & Analysis' },
      { pattern: /\b(game|challenge|interactive|puzzle)\b/i, category: 'Interactive Challenges & Games' }
    ];
    
    categoryPatterns.forEach(({ pattern, category }) => {
      if (pattern.test(lowerQuery)) {
        parsed.categories.push(category);
      }
    });
    
    // Extract remaining search terms (remove parsed keywords)
    let remaining = query
      .replace(/\b(easy|medium|moderate|hard|difficult|challenging|tasks?|in|about|for|the|a|an)\b/gi, '')
      .trim();
    
    if (remaining) {
      parsed.searchTerms.push(remaining);
    }
    
    return parsed;
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
          
        case 'difficulty_asc':
          const diffMapAsc = { 'easy': 1, 'medium': 2, 'hard': 3, 'unknown': 4 };
          const daAsc = diffMapAsc[a.difficulty?.toLowerCase()] || 4;
          const dbAsc = diffMapAsc[b.difficulty?.toLowerCase()] || 4;
          if (daAsc !== dbAsc) return daAsc - dbAsc;
          return 0;

        case 'difficulty_desc':
          const diffMapDesc = { 'easy': 1, 'medium': 2, 'hard': 3, 'unknown': 0 };
          const daDesc = diffMapDesc[a.difficulty?.toLowerCase()] || 0;
          const dbDesc = diffMapDesc[b.difficulty?.toLowerCase()] || 0;
          if (daDesc !== dbDesc) return dbDesc - daDesc;
          return 0;

        case 'alpha_asc':
          return (a.subcategory || a.description || '').localeCompare(b.subcategory || b.description || '');

        default:
          return 0;
      }
    });
  }, [tasks, filters, sortOption]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
    if (suggestion.type === 'category') {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(suggestion.value) 
          ? prev.categories 
          : [...prev.categories, suggestion.value]
      }));
      setSearchQuery('');
    } else if (suggestion.type === 'subcategory') {
      setFilters(prev => ({
        ...prev,
        subcategories: prev.subcategories.includes(suggestion.value)
          ? prev.subcategories
          : [...prev.subcategories, suggestion.value],
        categories: suggestion.parentCategory && !prev.categories.includes(suggestion.parentCategory)
          ? [...prev.categories, suggestion.parentCategory]
          : prev.categories
      }));
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion.value);
      addToRecentSearches(suggestion.value);
    }
  }, [addToRecentSearches]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters(prev => ({ ...prev, search: '' }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters({
      categories: [],
      subcategories: [],
      difficulties: [],
      priorityOnly: false,
      search: ''
    });
  }, []);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    
    // Filters
    filters,
    setFilters,
    sortOption,
    setSortOption,
    
    // Results
    filteredTasks,
    
    // Suggestions
    suggestions,
    recentSearches,
    
    // Actions
    handleSuggestionSelect,
    addToRecentSearches,
    clearSearch,
    clearAllFilters,
    parseNaturalLanguage
  };
}

