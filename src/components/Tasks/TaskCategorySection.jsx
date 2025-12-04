import { useState, useRef } from 'react';
import { Button, Badge } from '../ui';
import TaskTile from './TaskTile';
import './TaskCategorySection.css';

function TaskCategorySection({ 
  title, 
  tasks = [], 
  onTaskSelect, 
  onTaskUnselect,
  onExplore,
  searchQuery,
  showAll = false
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
              <span className="section-count">{tasks.length}</span>
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
              Explore all
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
                      isMine={false}
                      onSelect={() => onTaskSelect(task)}
                      onUnselect={() => onTaskUnselect(task)}
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
                    isMine={false}
                    onSelect={() => onTaskSelect(task)}
                    onUnselect={() => onTaskUnselect(task)}
                    showActions={true}
                    searchQuery={searchQuery}
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

export default TaskCategorySection;
