import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useMySelectedTasks } from '../../hooks/useTasks';
import { useTasksGallery } from '../../hooks/useTasksGallery';
import { usePromotions } from '../../hooks/usePromotions';
import { useAuth } from '../../contexts/AuthContext';
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
    categoryCounts,
  } = useTasksGallery();
  
  useMySelectedTasks();
  const { promotions } = usePromotions();
  const { profile } = useAuth();
  
  const posthog = usePostHog();
  const hasTrackedView = useRef(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [modalContextTasks, setModalContextTasks] = useState([]);
  
  const loadingMessage = useLoadingMessage(TASK_LOADING_MESSAGES, 2200);
  
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    types: [],
    subtypes: [],
    languages: [],
    milestoneOnly: false,
    externalCodeOnly: false,
    search: ''
  });

  useEffect(() => {
    if (posthog && previewTasks.length > 0 && !hasTrackedView.current) {
      posthog.capture('gallery_viewed', {
        total_tasks: previewTasks.length,
      });
      hasTrackedView.current = true;
    }
  }, [posthog, previewTasks]);

  const applySearch = useCallback(async (searchValue) => {
    setFilters(prev => ({ ...prev, search: searchValue || '' }));
    if (searchValue && searchValue.trim()) {
      await searchTasks(searchValue);
    } else {
      clearServerSearch();
    }
  }, [searchTasks, clearServerSearch]);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
    clearServerSearch();
  }, [clearServerSearch]);

  const displayTasks = useMemo(() => {
    if (filters.search && searchResults) {
      return searchResults;
    }
    return previewTasks;
  }, [filters.search, searchResults, previewTasks]);

  const filteredTasks = useMemo(() => {
    return displayTasks.filter(task => {
      if (filters.types.length > 0 && !filters.types.includes(task.type)) {
        return false;
      }
      
      if (filters.subtypes.length > 0) {
        const taskSubtypes = task.subtypes || [];
        const hasMatchingSubtype = taskSubtypes.some(s => filters.subtypes.includes(s));
        if (!hasMatchingSubtype) return false;
      }
      
      if (filters.languages.length > 0) {
        const taskLangs = task.languages || [];
        const hasMatchingLang = taskLangs.some(l => filters.languages.includes(l));
        if (!hasMatchingLang) return false;
      }
      
      if (filters.milestoneOnly && !task.is_milestone) {
        return false;
      }
      
      if (filters.externalCodeOnly && !task.has_external_code) {
        return false;
      }
      
      return true;
    });
  }, [displayTasks, filters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const groupedTasks = useMemo(() => {
    const groups = {};
    filteredTasks.forEach(task => {
      const type = task.type || 'Uncategorized';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(task);
    });
    
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
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

  const [exploringCategory, setExploringCategory] = useState(null);
  const [exploreCategoryTasks, setExploreCategoryTasks] = useState([]);

  const handleExplore = async (type) => {
    setExploringCategory(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const tasks = await fetchCategory(type);
      setExploreCategoryTasks(tasks);
    } catch (err) {
      console.error('Error loading type:', err);
    }
  };

  const handleBackFromExplore = () => {
    setExploringCategory(null);
    setExploreCategoryTasks([]);
  };

  const clearFilters = () => {
    clearSearch();
    setFilters({
      types: [],
      subtypes: [],
      languages: [],
      milestoneOnly: false,
      externalCodeOnly: false,
      search: ''
    });
  };

  const activeFilterCount = 
    (filters.types?.length || 0) + 
    (filters.languages?.length || 0) + 
    (filters.milestoneOnly ? 1 : 0) +
    (filters.externalCodeOnly ? 1 : 0);

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
      <div className="tasks-header">
        <h1>Pick Your Next Challenge.</h1>
        <p>Real problems frontier models still struggle with. Choose one and start building.</p>
      </div>

      <div className="gallery-container">
        <TaskSearchHeader
          onSearch={applySearch}
          onClearSearch={clearSearch}
          onOpenFilters={() => setFiltersModalOpen(true)}
        />

        <div className="gallery-content">
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
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>

          {exploringCategory ? (
            loadingCategory === exploringCategory ? (
              <div className="tasks-loading">
                <LoadingState size="lg" message={`Loading ${exploringCategory}...`} />
              </div>
            ) : (
              <CategoryExploreView
                category={exploringCategory}
                tasks={exploreCategoryTasks}
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
              <Button variant="secondary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="tasks-grouped-layout">
              {groupedTasks.map(([type, typeTasks]) => {
                const counts = getCategoryCount(type);
                
                return (
                  <TaskCategorySection
                    key={type}
                    title={type}
                    tasks={typeTasks}
                    totalCount={counts.available}
                    totalInCategory={counts.total}
                    onTaskSelect={handleViewDetails}
                    onTaskUnselect={() => {}}
                    onExplore={handleExplore}
                    searchQuery={filters.search}
                    showAll={filters.types?.includes(type)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TaskFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        tasks={previewTasks}
        filters={filters}
        onFilterChange={setFilters}
      />

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
