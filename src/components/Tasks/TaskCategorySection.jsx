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
  const displayTasks = showAll ? tasks : tasks.slice(0, 5);

  if (tasks.length === 0) return null;

  return (
    <div className="task-category-section">
      <div className="section-header">
        <div className="section-title-group" onClick={() => setIsCollapsed(!isCollapsed)}>
          <button className={`collapse-btn ${isCollapsed ? 'collapsed' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <h3>
            {title}
            <span className="section-count">{tasks.length}</span>
          </h3>
        </div>
        
        {!isCollapsed && !showAll && tasks.length > 5 && (
          <div className="section-controls">
            <Button variant="ghost" size="sm" onClick={() => onExplore(title)}>
              View Details
            </Button>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="section-content">
          <div className="tasks-grid-row">
            {displayTasks.map(task => (
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
        </div>
      )}
    </div>
  );
}

export default TaskCategorySection;

