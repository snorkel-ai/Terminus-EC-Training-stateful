import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks, useMySelectedTasks } from '../../hooks/useTasks';
import { useTaskSearch } from '../../hooks/useTaskSearch';
import { Button, LoadingState, Modal, Badge } from '../ui';
import TaskSearchHeader from './TaskSearchHeader';
import TaskFiltersModal from './TaskFiltersModal';
import TaskCategorySection from './TaskCategorySection';
import CategoryExploreView from './CategoryExploreView';
import { TaskClaimSuccess } from './TaskClaimSuccess';
import './Tasks.css';
import './TasksViewLayout.css';

// Reusing the DifficultyRating component locally for the modal as well
const DifficultyRating = ({ difficulty }) => {
  const diff = difficulty?.toLowerCase();
  let count = 0;
  if (diff === 'hard') count = 3;
  else if (diff === 'medium') count = 2;
  else if (diff === 'easy') count = 1;
  
  return (
    <div className="difficulty-rating" title={`Difficulty: ${difficulty}`} style={{ display: 'flex', gap: '2px' }}>
      {[...Array(3)].map((_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2, fontSize: '1.1em', filter: i < count ? 'none' : 'grayscale(100%)' }}>
          💪
        </span>
      ))}
    </div>
  );
};

function TasksView() {
  const navigate = useNavigate();
  const { tasks, loading, error, selectTask } = useTasks();
  const { selectedTasks: myTasks, unselectTask } = useMySelectedTasks();
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [modalContextTasks, setModalContextTasks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  
  // Filter Modal State
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

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
    setShowClaimSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedTaskForModal(null);
    setModalContextTasks([]);
    setShowClaimSuccess(false);
  };

  const navigateTask = (direction) => {
    if (!selectedTaskForModal || modalContextTasks.length === 0) return;
    
    const currentIndex = modalContextTasks.findIndex(t => t.id === selectedTaskForModal.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex < modalContextTasks.length) {
        setSelectedTaskForModal(modalContextTasks[nextIndex]);
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex >= 0) {
        setSelectedTaskForModal(modalContextTasks[nextIndex]);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedTaskForModal || showClaimSuccess) return;
      
      if (e.key === 'ArrowLeft') {
        navigateTask('prev');
      } else if (e.key === 'ArrowRight') {
        navigateTask('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskForModal, modalContextTasks, showClaimSuccess]);

  const handleSelectFromModal = async () => {
    if (!selectedTaskForModal || isSelecting) return;
    
    setIsSelecting(true);
    try {
      await selectTask(selectedTaskForModal.id);
      setShowClaimSuccess(true);
    } catch (error) {
      console.error('Error selecting task:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleReleaseFromModal = async () => {
    if (!selectedTaskForModal) return;
    
    if (window.confirm('Are you sure you want to release this task?')) {
      try {
        await unselectTask(selectedTaskForModal.id);
        handleCloseModal();
      } catch (error) {
        console.error('Error releasing task:', error);
      }
    }
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
          <LoadingState size="lg" message="Loading tasks..." />
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

  const currentIndex = selectedTaskForModal && modalContextTasks.length > 0
    ? modalContextTasks.findIndex(t => t.id === selectedTaskForModal.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < modalContextTasks.length - 1;

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

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTaskForModal}
        onClose={handleCloseModal}
        size="lg"
        className="task-detail-modal"
      >
        {selectedTaskForModal && (
          showClaimSuccess ? (
            <TaskClaimSuccess 
              task={selectedTaskForModal} 
              onClose={handleCloseModal} 
              onRelease={handleReleaseFromModal}
              onGoToMyTasks={() => {
                handleCloseModal();
                navigate('/portal/my-tasks');
              }}
            />
          ) : (
            <>
              <div className="task-detail-modal-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="modal-badges" style={{ alignItems: 'center' }}>
                      {/* Breadcrumb instead of pill */}
                      <div className="task-breadcrumb">
                        <span className="breadcrumb-segment parent">{selectedTaskForModal.category}</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-segment current">
                          {selectedTaskForModal.subcategory || selectedTaskForModal.subsubcategory}
                        </span>
                      </div>

                      {selectedTaskForModal.difficulty && (
                         <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                           <DifficultyRating difficulty={selectedTaskForModal.difficulty} />
                         </div>
                      )}
                    </div>
                    <h2>Your challenge</h2>
                  </div>
                  
                  <div className="modal-navigation" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="modal-nav-btn"
                      onClick={() => navigateTask('prev')}
                      disabled={!hasPrev}
                      title="Previous Task (Left Arrow)"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button 
                      className="modal-nav-btn"
                      onClick={() => navigateTask('next')}
                      disabled={!hasNext}
                      title="Next Task (Right Arrow)"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="task-detail-modal-body">
                <p>{selectedTaskForModal.description}</p>
              </div>

              <div className="task-detail-modal-footer">
                {(selectedTaskForModal.is_special || selectedTaskForModal.priority_tag || selectedTaskForModal.is_highlighted) && (
                  <div style={{ marginRight: 'auto' }}>
                    <Badge variant="accent">Double Pay</Badge>
                  </div>
                )}
                <Button 
                  variant="secondary" 
                  onClick={handleCloseModal}
                  disabled={isSelecting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSelectFromModal}
                  loading={isSelecting}
                >
                  Claim Challenge
                </Button>
              </div>
            </>
          )
        )}
      </Modal>
    </div>
  );
}

export default TasksView;
