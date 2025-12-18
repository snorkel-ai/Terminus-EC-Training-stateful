import { useState, useRef } from 'react';
import { Button, Badge } from '../ui';
import TaskTile from './TaskTile';
import './TaskCategorySection.css';

function TaskCategorySection({ 
  title, 
  tasks = [], 
  totalCount,  // Total available tasks in category (from server)
  totalInCategory = 0,  // Total tasks (including claimed) for empty state
  onTaskSelect, 
  onTaskUnselect,
  onTaskComplete,
  onTaskUncomplete,
  onExplore,
  searchQuery,
  showAll = false,
  isMine = false
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);

  // Carousel scrolling
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isPrioritized = tasks.some(t => t.is_special || t.priority_tag);

  // Show empty state when no available tasks but category has claimed tasks
  if (tasks.length === 0) {
    // Only show empty state if there are actually tasks in this category (just all claimed)
    if (totalInCategory === 0) return null;
    
    return (
      <div className="task-category-section">
        <div className="section-header">
          <div className="section-title-group">
            <div className="section-title-wrapper">
              <h3>
                {title}
                <span className="section-count section-count-empty">0</span>
              </h3>
            </div>
          </div>
        </div>
        
        <div className="section-content">
          <div className="category-empty-state">
            <div className="empty-state-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.8 11.3 2 22l10.7-3.79" />
                <path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" />
                <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.51 9 6.22V7" />
              </svg>
            </div>
            <div className="empty-state-text">
              <h4>All Tasks Claimed</h4>
              <p>
                All <strong>{totalInCategory}</strong> tasks in this category have been claimed by the community.
              </p>
              <span className="empty-state-hint">Check back later as tasks may reopen if they are released.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-category-section ${isPrioritized ? 'prioritized-section' : ''}`}>
      <div className="section-header">
        <div className="section-title-group" onClick={() => setIsCollapsed(!isCollapsed)}>
          <button className={`collapse-btn ${isCollapsed ? 'collapsed' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="section-title-wrapper">
            <h3>
              {title}
              <button 
                className="section-count section-count-link" 
                onClick={(e) => {
                  e.stopPropagation();
                  onExplore?.(title);
                }}
                title="Explore all tasks in this category"
              >
                {totalCount ?? tasks.length}
              </button>
            </h3>
            {isPrioritized && (
              <Badge variant="accent" size="sm" className="double-pay-badge">
                💰💰 Double Pay
              </Badge>
            )}
          </div>
        </div>
        
        {!isCollapsed && !showAll && (
          <div className="section-controls">
            <Button variant="ghost" size="sm" className="explore-all-btn" onClick={(e) => {
              e.stopPropagation();
              onExplore(title);
            }}>
              <span className="explore-btn-content">
                <span>Explore domain</span>
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
      </div>

      {!isCollapsed && (
        <div className="section-content">
          {showAll ? (
             <div className="tasks-grid-row show-all">
                {tasks.map(task => (
                  <div key={task.id} className="grid-item">
                    <TaskTile
                      task={task}
                      isSelected={task.is_selected}
                      isMine={isMine}
                      isCompleted={!!task.completed_at}
                      onSelect={() => onTaskSelect?.(task, tasks)}
                      onUnselect={() => onTaskUnselect?.(task.id)}
                      onComplete={() => onTaskComplete?.(task.id)}
                      onUncomplete={() => onTaskUncomplete?.(task.id)}
                      showActions={true}
                      searchQuery={searchQuery}
                    />
                  </div>
                ))}
             </div>
          ) : (
            <div className="tasks-carousel" ref={scrollContainerRef}>
              {tasks.map(task => (
                <div key={task.id} className="carousel-item">
                  <TaskTile
                    task={task}
                    isSelected={task.is_selected}
                    isMine={isMine}
                    isCompleted={!!task.completed_at}
                    onSelect={() => onTaskSelect?.(task, tasks)}
                    onUnselect={() => onTaskUnselect?.(task.id)}
                    onComplete={() => onTaskComplete?.(task.id)}
                    onUncomplete={() => onTaskUncomplete?.(task.id)}
                    showActions={true}
                    searchQuery={searchQuery}
                  />
                </div>
              ))}
              {/* Show "Explore more" card at end of carousel if there are more tasks */}
              {totalCount && totalCount > tasks.length && (
                <div className="carousel-item carousel-explore-more">
                  <button 
                    className="explore-more-card"
                    onClick={() => onExplore?.(title)}
                  >
                      <div className="explore-more-content">
                        <div className="explore-icon-wrapper">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                        <div className="explore-stats">
                          <span className="explore-more-count">+{totalCount - tasks.length}</span>
                          <span className="explore-more-label">more tasks</span>
                        </div>
                        <div className="explore-more-cta">
                          <span>View All</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCategorySection;
