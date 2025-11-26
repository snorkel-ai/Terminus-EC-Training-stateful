import { useState } from 'react';
import { Button, Badge, CornerBadge } from '../ui';
import './Tasks.css';

function TaskTile({ task, isSelected, isMine, onSelect, onUnselect, showActions = true }) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (e) => {
    e?.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onSelect(task.id);
    } catch (error) {
      console.error('Error selecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnselect = async (e) => {
    e?.stopPropagation();
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

  // Show more text by default (300 chars)
  const PREVIEW_LENGTH = 300;
  const needsTruncation = task.description?.length > PREVIEW_LENGTH;
  const displayedDesc = needsTruncation
    ? task.description?.substring(0, PREVIEW_LENGTH) + '...'
    : task.description;

  return (
    <div className={`task-tile ${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''} ${task.is_highlighted ? 'highlighted' : ''}`}>
      {(task.is_special || task.priority_tag) && (
        <CornerBadge>2x</CornerBadge>
      )}
      <div className="task-tile-header">
        <div className="task-badges">
          {task.is_highlighted && (
            <Badge variant="priority" size="sm">Priority</Badge>
          )}
          <Badge variant="category" size="sm">{task.category}</Badge>
        </div>
      </div>

      {task.subcategory && (
        <div className="task-subcategory">{task.subcategory}</div>
      )}

      <div 
        className={`task-description ${needsTruncation ? 'clickable' : ''}`}
        onClick={needsTruncation ? handleSelect : undefined}
        role={needsTruncation ? 'button' : undefined}
        tabIndex={needsTruncation ? 0 : undefined}
      >
        {displayedDesc}
        {needsTruncation && (
          <span className="expand-indicator">
            Read more
          </span>
        )}
      </div>

      <div className="task-footer">
        {task.difficulty && (
          <div className="task-difficulty">
            <Badge variant={task.difficulty.toLowerCase()} size="sm">
              {task.difficulty}
            </Badge>
          </div>
        )}

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
                variant="secondary"
                size="sm"
                onClick={handleSelect}
                loading={loading}
              >
                View Details
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTile;
