import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useMySelectedTasks } from '../../hooks/useTasks';
import { useTasksGallery } from '../../hooks/useTasksGallery';
import { useLoadingMessage } from '../../hooks/useLoadingMessage';
import { TASK_LOADING_MESSAGES } from '../../utils/loadingMessages';
import { Button, LoadingState, TaskDetailModal } from '../ui';
import TaskSearchHeader from './TaskSearchHeader';
import TaskFiltersModal from './TaskFiltersModal';
import TaskCategorySection from './TaskCategorySection';
import CategoryExploreView from './CategoryExploreView';
import './Tasks.css';
import './TasksViewLayout.css';

function TasksView() {
  // Use optimized gallery hook (loads 15 tasks per category instead of all 1600+)
  const { 
    previewTasks, 
    loading, 
    error,
    searchResults,
    searchLoading,
    searchTasks,
    clearSearch: clearServerSearch,
    fetchCategory,
    loadingCategory,
    getCategoryCount,
  } = useTasksGallery();
  
  // Keep myTasks for potential future use
  useMySelectedTasks();
  const posthog = usePostHog();
  const hasTrackedView = useRef(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [modalContextTasks, setModalContextTasks] = useState([]);
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(TASK_LOADING_MESSAGES, 2200);
  
  // Filter Modal State
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  
  // Local filter state (for category/difficulty filters applied client-side)
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    difficulties: [],
    priorityOnly: false,
    search: ''
  });

  // Track gallery view once when tasks load
  useEffect(() => {
    if (posthog && previewTasks.length > 0 && !hasTrackedView.current) {
      posthog.capture('gallery_viewed', {
        total_tasks: previewTasks.length,
        available_tasks: previewTasks.filter(t => !t.is_selected).length,
      });
      hasTrackedView.current = true;
    }
  }, [posthog, previewTasks]);

  // Handle search - uses server-side search
  const applySearch = useCallback(async (searchValue) => {
    setFilters(prev => ({ ...prev, search: searchValue || '' }));
    if (searchValue && searchValue.trim()) {
      await searchTasks(searchValue);
    } else {
      clearServerSearch();
    }
  }, [searchTasks, clearServerSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
    clearServerSearch();
  }, [clearServerSearch]);

  // Determine which tasks to display
  const displayTasks = useMemo(() => {
    // If searching, use search results
    if (filters.search && searchResults) {
      return searchResults;
    }
    // Otherwise use preview tasks
    return previewTasks;
  }, [filters.search, searchResults, previewTasks]);

  // Apply client-side filters (category, difficulty, priority)
  const filteredTasks = useMemo(() => {
    return displayTasks.filter(task => {
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
      
      return true;
    });
  }, [displayTasks, filters]);

  // Scroll to top when filters change (only when search is applied, not on every keystroke)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  // Group filtered tasks by category for "grouped" view
  const groupedTasks = useMemo(() => {
    const groups = {};
    filteredTasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
    });
    
    // Sort groups: Prioritized categories first, then by number of tasks
    return Object.entries(groups).sort((a, b) => {
      const aHasPriority = a[1].some(t => t.is_special || t.priority_tag);
      const bHasPriority = b[1].some(t => t.is_special || t.priority_tag);
      
      if (aHasPriority && !bHasPriority) return -1;
      if (!aHasPriority && bHasPriority) return 1;
      
      return b[1].length - a[1].length;
    });
  }, [filteredTasks]);

  const handleViewDetails = (task, contextTasks = []) => {
    setSelectedTaskForModal(task);
    setModalContextTasks(contextTasks);
  };

  const handleCloseModal = () => {
    setSelectedTaskForModal(null);
    setModalContextTasks([]);
  };

  const handleNavigateTask = (task) => {
    setSelectedTaskForModal(task);
  };

  // Track which category is being explored (for drill-down view)
  const [exploringCategory, setExploringCategory] = useState(null);
  const [exploreCategoryTasks, setExploreCategoryTasks] = useState([]);

  const handleExplore = async (category) => {
    setExploringCategory(category);
    // Scroll to top when exploring
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch all tasks for this category
    try {
      const tasks = await fetchCategory(category);
      setExploreCategoryTasks(tasks);
    } catch (err) {
      console.error('Error loading category:', err);
    }
  };

  const handleBackFromExplore = () => {
    setExploringCategory(null);
    setExploreCategoryTasks([]);
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) + 
    (filters.difficulties?.length || 0) + 
    (filters.priorityOnly ? 1 : 0);

  // Only show "active filters" when search is actually applied (after Enter)
  const hasActiveFilters = filters.search || activeFilterCount > 0;

  if (loading) {
    return (
      <div className="tasks-view">
        <div className="tasks-header">
          <h1>Task Inspiration</h1>
          <p>Browse and select tasks to work on</p>
        </div>
        <div className="tasks-loading">
          <LoadingState size="lg" message={loadingMessage} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-view">
        <div className="tasks-header">
          <h1>Task Inspiration</h1>
          <p>Browse and select tasks to work on</p>
        </div>
        <div className="tasks-error">
          <p>Error loading tasks: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-view tasks-gallery">
      {/* Header */}
      <div className="tasks-header">
        <h1>Pick Your Next Challenge.</h1>
        <p>Real problems frontier models still struggle with. Choose one and start building.</p>
      </div>

      <div className="gallery-container">
        {/* Search Header */}
        <TaskSearchHeader
          onSearch={applySearch}
          onClearSearch={clearSearch}
          onOpenFilters={() => setFiltersModalOpen(true)}
        />

        <div className="gallery-content">
          {/* Results Header */}
          <div className="tasks-results-header">
            <p className="results-count">
              {hasActiveFilters && (
                <>Found {filteredTasks.length} tasks</>
              )}
            </p>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearSearch();
                  setFilters({
                    categories: [],
                    subcategories: [],
                    difficulties: [],
                    priorityOnly: false,
                    search: ''
                  });
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Category Explore View or Grouped Sections */}
          {exploringCategory ? (
            loadingCategory === exploringCategory ? (
              <div className="tasks-loading">
                <LoadingState size="lg" message={`Loading ${exploringCategory}...`} />
              </div>
            ) : (
              <CategoryExploreView
                category={exploringCategory}
                tasks={exploreCategoryTasks.filter(t => !t.is_selected)}
                onTaskSelect={handleViewDetails}
                onBack={handleBackFromExplore}
                searchQuery={filters.search}
              />
            )
          ) : (searchLoading) ? (
            <div className="tasks-loading">
              <LoadingState size="lg" message="Searching..." />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="tasks-empty">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h3>No tasks found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="secondary" 
                onClick={() => {
                  clearSearch();
                  setFilters({
                    categories: [],
                    subcategories: [],
                    difficulties: [],
                    priorityOnly: false,
                    search: ''
                  });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="tasks-grouped-layout">
              {groupedTasks.map(([category, categoryTasks]) => {
                const counts = getCategoryCount(category);
                return (
                  <TaskCategorySection
                    key={category}
                    title={category}
                    tasks={categoryTasks}
                    totalCount={counts.available}
                    onTaskSelect={handleViewDetails}
                    onTaskUnselect={() => {}}
                    onExplore={handleExplore}
                    searchQuery={filters.search}
                    showAll={filters.categories?.includes(category)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal */}
      <TaskFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        tasks={previewTasks}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Task Detail Modal - uses design system component */}
      <TaskDetailModal
        task={selectedTaskForModal}
        isOpen={!!selectedTaskForModal}
        onClose={handleCloseModal}
        contextTasks={modalContextTasks}
        onNavigate={handleNavigateTask}
        showNavigation={modalContextTasks.length > 1}
      />
    </div>
  );
}

export default TasksView;
