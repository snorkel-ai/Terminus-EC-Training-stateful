import { useState, useMemo, useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useTasks, useMySelectedTasks } from '../../hooks/useTasks';
import { useTaskSearch } from '../../hooks/useTaskSearch';
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
  const { tasks, loading, error } = useTasks();
  const { selectedTasks: myTasks } = useMySelectedTasks();
  const posthog = usePostHog();
  const hasTrackedView = useRef(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [modalContextTasks, setModalContextTasks] = useState([]);
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(TASK_LOADING_MESSAGES, 2200);
  
  // Filter Modal State
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  // Track gallery view once when tasks load
  useEffect(() => {
    if (posthog && tasks.length > 0 && !hasTrackedView.current) {
      posthog.capture('gallery_viewed', {
        total_tasks: tasks.length,
        available_tasks: tasks.filter(t => !t.is_selected).length,
      });
      hasTrackedView.current = true;
    }
  }, [posthog, tasks]);

  // Use the new search hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredTasks,
    suggestions,
    recentSearches,
    handleSuggestionSelect,
    addToRecentSearches,
    clearSearch
  } = useTaskSearch(tasks);

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, searchQuery]);

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

  // Count total available and claimed tasks (before filtering)
  const totalAvailable = tasks.filter(t => !t.is_selected).length;
  const totalClaimed = tasks.filter(t => t.is_selected).length;

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

  const handleExplore = (category) => {
    setExploringCategory(category);
    // Scroll to top when exploring
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromExplore = () => {
    setExploringCategory(null);
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) + 
    (filters.difficulties?.length || 0) + 
    (filters.priorityOnly ? 1 : 0);

  const hasActiveFilters = searchQuery || activeFilterCount > 0;

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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          suggestions={suggestions}
          recentSearches={recentSearches}
          handleSuggestionSelect={handleSuggestionSelect}
          clearSearch={clearSearch}
          filters={filters}
          setFilters={setFilters}
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
            <CategoryExploreView
              category={exploringCategory}
              tasks={filteredTasks.filter(t => t.category === exploringCategory)}
              onTaskSelect={handleViewDetails}
              onBack={handleBackFromExplore}
              searchQuery={searchQuery}
            />
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
              {groupedTasks.map(([category, categoryTasks]) => (
                <TaskCategorySection
                  key={category}
                  title={category}
                  tasks={categoryTasks}
                  onTaskSelect={handleViewDetails}
                  onTaskUnselect={() => {}}
                  onExplore={handleExplore}
                  searchQuery={searchQuery}
                  showAll={filters.categories?.includes(category)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal */}
      <TaskFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        tasks={tasks}
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
