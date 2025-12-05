import { useState } from 'react';
import { Button, TaskCard } from '../ui';

/**
 * TaskTile - Task card with selection/action logic
 * Uses TaskCard from the design system for consistent visual presentation
 */
function TaskTile({ 
  task, 
  isSelected, 
  isMine, 
  onSelect, 
  onUnselect, 
  onComplete,
  onUncomplete,
  isCompleted,
  showActions = true, 
  searchQuery = '' 
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e?.stopPropagation();
    if (loading || isMine) return;
    
    setLoading(true);
    try {
      await onSelect?.(task.id);
    } catch (error) {
      console.error('Error selecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnselect = async (e) => {
    e?.stopPropagation();
    if (loading) return;
    if (!window.confirm('Are you sure you want to abandon this task?')) return;
    
    setLoading(true);
    try {
      await onUnselect?.(task.id);
    } catch (error) {
      console.error('Error unselecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e?.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onComplete?.(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUncomplete = async (e) => {
    e?.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onUncomplete?.(task.id);
    } catch (error) {
      console.error('Error uncompleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build footer with action buttons for "mine" tasks
  const renderFooter = () => {
    if (!showActions || !isMine) return null;
    
    return (
      <div className="task-card-actions">
        {onComplete && !isCompleted && (
          <Button 
            variant="primary"
            size="sm"
            onClick={handleComplete}
            loading={loading}
          >
            Accept
          </Button>
        )}
        {onUncomplete && isCompleted && (
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleUncomplete}
            loading={loading}
          >
            Mark Active
          </Button>
        )}
        <Button 
          variant="danger"
          size="sm"
          onClick={handleUnselect}
          loading={loading}
        >
          Abandon Task
        </Button>
      </div>
    );
  };

  return (
    <TaskCard
      task={task}
      isCompleted={isCompleted}
      isHighlighted={task?.is_highlighted}
      searchQuery={searchQuery}
      onClick={!isMine ? handleClick : undefined}
      footer={renderFooter()}
      className={`${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''}`}
    />
  );
}

export default TaskTile;
