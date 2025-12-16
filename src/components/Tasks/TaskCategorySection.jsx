import { useState, useRef } from 'react';
import { Button, Badge } from '../ui';
import TaskTile from './TaskTile';
import './TaskCategorySection.css';

function TaskCategorySection({ 
  title, 
  tasks = [], 
  totalCount,  // Total available tasks in category (from server)
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

  if (tasks.length === 0) return null;

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
