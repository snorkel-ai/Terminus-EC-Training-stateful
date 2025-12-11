import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMySelectedTasks, TASK_STATUS, TASK_STATUS_LABELS, MAX_ACTIVE_TASKS } from '../../hooks/useTasks';
import { useLoadingMessage } from '../../hooks/useLoadingMessage';
import { MY_CHALLENGES_LOADING_MESSAGES } from '../../utils/loadingMessages';
import { Button, LoadingState, TaskCard, TaskWorkflowModal, Tabs, Tab } from '../ui';
import './Tasks.css';
import './TaskCategorySection.css';

// Collapsible category section for accepted tasks
function AcceptedCategorySection({ category, tasks, onTaskClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const scrollContainerRef = useRef(null);
  
  // Only show controls if more than 4 tasks
  const needsScrollControls = tasks.length > 4;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="task-category-section">
      <div className="section-header">
        <div className="section-title-group" onClick={() => setIsCollapsed(!isCollapsed)}>
          <button className={`collapse-btn ${isCollapsed ? 'collapsed' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="section-title-wrapper">
            <h3>
              {category}
              <span className="section-count">{tasks.length}</span>
            </h3>
          </div>
        </div>
        
        {!isCollapsed && !showAll && needsScrollControls && (
          <div className="section-controls">
            <Button variant="ghost" size="sm" className="explore-all-btn" onClick={(e) => {
              e.stopPropagation();
              setShowAll(true);
            }}>
              <span className="explore-btn-content">
                <span>View all</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </Button>
            <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
        
        {!isCollapsed && showAll && (
          <div className="section-controls">
            <Button variant="ghost" size="sm" className="explore-all-btn" onClick={(e) => {
              e.stopPropagation();
              setShowAll(false);
            }}>
              <span className="explore-btn-content">
                <span>Collapse</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </span>
            </Button>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="section-content">
          {showAll ? (
            <div className="tasks-grid-row show-all">
              {tasks.map(task => (
                <div key={task.id} className="grid-item">
                  <TaskCard
                    task={task}
                    isCompleted={true}
                    isHighlighted={task.is_highlighted}
                    claimedAt={task.selected_at}
                    completedAt={task.completed_at}
                    onClick={() => onTaskClick(task)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="tasks-carousel" ref={scrollContainerRef}>
              {tasks.map(task => (
                <div key={task.id} className="carousel-item">
                  <TaskCard
                    task={task}
                    isCompleted={true}
                    isHighlighted={task.is_highlighted}
                    claimedAt={task.selected_at}
                    completedAt={task.completed_at}
                    onClick={() => onTaskClick(task)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MySelectedTasks() {
  const navigate = useNavigate();
  const { 
    selectedTasks, 
    loading, 
    error, 
    activeTaskCount,
    canClaimMore,
    refetch
  } = useMySelectedTasks();
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(MY_CHALLENGES_LOADING_MESSAGES, 2200);

  // Group tasks by their workflow status
  const activeTasks = selectedTasks.filter(t => 
    t.status === TASK_STATUS.CLAIMED || t.status === TASK_STATUS.IN_PROGRESS
  );
  const reviewTasks = selectedTasks.filter(t => t.status === TASK_STATUS.WAITING_REVIEW);
  const acceptedTasks = selectedTasks.filter(t => t.status === TASK_STATUS.ACCEPTED);

  // Group accepted tasks by category for hierarchical display
  const groupedAcceptedTasks = useMemo(() => {
    const groups = {};
    acceptedTasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
    });
    
    // Sort groups by number of tasks (most first)
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [acceptedTasks]);

  const handleOpenModal = (task) => {
    setSelectedTaskForModal(task);
  };

  const handleCloseModal = () => {
    setSelectedTaskForModal(null);
    // Refetch to ensure data is in sync after modal actions
    refetch();
  };

  if (loading) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Tasks</h1>
          <p>Track your progress and complete challenges</p>
        </div>
        <div className="tasks-loading">
          <LoadingState size="lg" message={loadingMessage} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Tasks</h1>
          <p>Track your progress and complete challenges</p>
        </div>
        <div className="tasks-error">
          <p>Error loading your tasks: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-view my-tasks-view">
      <div className="tasks-header">
        <h1>My Tasks</h1>
        <p>Track your progress as you work on tasks.</p>
      </div>

      {selectedTasks.length === 0 ? (
        <div className="tasks-empty">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3>No challenges yet</h3>
          <p>Browse tasks and claim challenges to get started.</p>
          <Button variant="primary" onClick={() => navigate('/portal/tasks')}>
            Browse Tasks
          </Button>
        </div>
      ) : (
        <div className="gallery-content" style={{ marginTop: 'var(--space-6)' }}>
          {/* Claim limit indicator */}
          <div className="claim-limit-indicator" style={{ 
            marginBottom: 'var(--space-4)', 
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Active Task Quota: <strong style={{ color: canClaimMore ? 'var(--text-primary)' : 'var(--color-warning)' }}>
                {activeTaskCount} / {MAX_ACTIVE_TASKS}
              </strong>
            </span>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="active">
              Active Tasks
              {activeTasks.length > 0 && (
                <span className="tab-count">{activeTasks.length}</span>
              )}
            </Tab>
            <Tab value="review">
              In Review
              {reviewTasks.length > 0 && (
                <span className="tab-count">{reviewTasks.length}</span>
              )}
            </Tab>
            <Tab value="accepted">
              Accepted
              {acceptedTasks.length > 0 && (
                <span className="tab-count">{acceptedTasks.length}</span>
              )}
            </Tab>
          </Tabs>

          {/* Tab Content */}
          <div className="my-tasks-tab-content">
            {activeTab === 'active' && (
              // Active tasks (claimed or in_progress) - flat grid
              activeTasks.length === 0 ? (
                <div className="tasks-empty-tab">
                  <p>No active challenges. {canClaimMore ? 'Claim some tasks to get started!' : 'Submit tasks for review to free up slots.'}</p>
                  {canClaimMore && (
                    <Button variant="secondary" onClick={() => navigate('/portal/tasks')}>
                      Find Challenges
                    </Button>
                  )}
                </div>
              ) : (
                <div className="my-tasks-grid">
                  {activeTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompleted={false}
                      isHighlighted={task.is_highlighted}
                      claimedAt={task.selected_at}
                      statusBadge={TASK_STATUS_LABELS[task.status]}
                      onClick={() => handleOpenModal(task)}
                    />
                  ))}
                </div>
              )
            )}
            
            {activeTab === 'review' && (
              // Tasks waiting for human review
              reviewTasks.length === 0 ? (
                <div className="tasks-empty-tab">
                  <p>No tasks waiting for review.</p>
                </div>
              ) : (
                <div className="my-tasks-grid">
                  {reviewTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompleted={false}
                      isHighlighted={task.is_highlighted}
                      claimedAt={task.selected_at}
                      statusBadge="Waiting on Review"
                      onClick={() => handleOpenModal(task)}
                    />
                  ))}
                </div>
              )
            )}
            
            {activeTab === 'accepted' && (
              // Accepted tasks - grouped by category with collapsible carousels
              acceptedTasks.length === 0 ? (
                <div className="tasks-empty-tab">
                  <p>No accepted challenges yet. Keep going!</p>
                </div>
              ) : (
                <div className="tasks-grouped-layout">
                  {groupedAcceptedTasks.map(([category, categoryTasks]) => (
                    <AcceptedCategorySection
                      key={category}
                      category={category}
                      tasks={categoryTasks}
                      onTaskClick={handleOpenModal}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Reusable Task Workflow Modal */}
      <TaskWorkflowModal
        task={selectedTaskForModal}
        isOpen={!!selectedTaskForModal}
        onClose={handleCloseModal}
        onTaskUpdate={() => refetch()}
      />
    </div>
  );
}

export default MySelectedTasks;
