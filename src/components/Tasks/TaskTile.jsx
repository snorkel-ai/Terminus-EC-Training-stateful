import { useState } from 'react';
import { Button, Badge } from '../ui';
import './Tasks.css';

function TaskTile({ task, isSelected, isMine, onSelect, onUnselect, showActions = true }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSelect = async () => {
    if (loading || isSelected) return;
    setLoading(true);
    try {
      await onSelect(task.id);
    } catch (error) {
      console.error('Error selecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnselect = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onUnselect(task.id);
    } catch (error) {
      console.error('Error unselecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Show more text by default (300 chars), full text when expanded
  const PREVIEW_LENGTH = 300;
  const needsTruncation = task.description?.length > PREVIEW_LENGTH;
  const displayedDesc = expanded || !needsTruncation
    ? task.description
    : task.description?.substring(0, PREVIEW_LENGTH) + '...';

  return (
    <div className={`task-tile ${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''} ${expanded ? 'expanded' : ''} ${task.is_highlighted ? 'highlighted' : ''}`}>
      {task.priority_tag && (
        <div className="priority-tag-wrapper">
          <div className="priority-tag">
            {task.priority_tag}
          </div>
          {task.tag_label && (
            <div className="priority-tooltip">{task.tag_label}</div>
          )}
        </div>
      )}
      
      <div className="task-tile-header">
        <div className="task-badges">
          {task.is_highlighted && (
            <Badge variant="primary" size="sm">⭐ Priority</Badge>
          )}
          <Badge variant="category" size="sm">{task.category}</Badge>
          {task.difficulty && (
            <Badge variant={task.difficulty} size="sm">
              {task.difficulty}
            </Badge>
          )}
        </div>
      </div>

      {task.subcategory && (
        <div className="task-subcategory">{task.subcategory}</div>
      )}

      <div 
        className={`task-description ${needsTruncation ? 'clickable' : ''}`}
        onClick={needsTruncation ? toggleExpanded : undefined}
        role={needsTruncation ? 'button' : undefined}
        tabIndex={needsTruncation ? 0 : undefined}
      >
        {displayedDesc}
        {needsTruncation && (
          <span className="expand-indicator">
            {expanded ? ' Show less' : ' Read more'}
          </span>
        )}
      </div>

      {showActions && (
        <div className="task-actions">
          {isMine ? (
            <Button 
              variant="secondary"
              size="sm"
              onClick={handleUnselect}
              loading={loading}
            >
              Unselect Task
            </Button>
          ) : (
            <Button 
              variant="primary"
              size="sm"
              onClick={handleSelect}
              loading={loading}
            >
              Select Task
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskTile;
