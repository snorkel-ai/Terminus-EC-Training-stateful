import { useState } from 'react';
import { Button, Badge, CornerBadge, ProgressBar, CodeBlock, TimerCompact, Note, ExternalLink } from '../ui';
import { useTaskTimer } from '../../hooks/useTaskTimer';
import './Tasks.css';

const SUBMITTER_PORTAL_URL = 'https://submitter.terminus.com'; // External platform URL

function TaskTile({ task, isSelected, isMine, onSelect, onUnselect, showActions = true }) {
  const [loading, setLoading] = useState(false);
  const { timeLeft, formatTime, progress } = useTaskTimer(task.selected_at);
  
  // Check if user has already made their first commit
  const hasCommitted = !!task.first_commit_at;

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
  const shouldTruncate = !isMine && task.description?.length > PREVIEW_LENGTH;
  const displayedDesc = shouldTruncate
    ? task.description?.substring(0, PREVIEW_LENGTH) + '...'
    : task.description;

  return (
    <div className={`task-tile ${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''} ${task.is_highlighted ? 'highlighted' : ''} ${hasCommitted ? 'committed' : ''}`}>
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
        className={`task-description ${shouldTruncate ? 'clickable' : ''}`}
        onClick={shouldTruncate ? handleSelect : undefined}
        role={shouldTruncate ? 'button' : undefined}
        tabIndex={shouldTruncate ? 0 : undefined}
      >
        {displayedDesc}
        {shouldTruncate && (
          <span className="expand-indicator">
            Read more
          </span>
        )}
      </div>

      {isMine && !hasCommitted && (
        <div className="task-active-status" style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TimerCompact time={formatTime(timeLeft)} label="Time Remaining" />
            <div style={{ marginTop: '0.35rem' }}>
              <ProgressBar 
                progress={progress} 
                variant={progress < 20 ? 'danger' : 'success'} 
                size="sm" 
              />
            </div>
          </div>
          <CodeBlock>terminus task start {task.id}</CodeBlock>
        </div>
      )}

      {isMine && hasCommitted && (
        <div className="task-committed-status" style={{ marginBottom: '1rem' }}>
          <Note icon="check" title="First commit received!" squared>
            <p style={{ marginBottom: '0.75rem' }}>Continue working on your task.</p>
            <ExternalLink href={SUBMITTER_PORTAL_URL}>
              Open Submitter Portal
            </ExternalLink>
          </Note>
        </div>
      )}

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
                variant="danger"
                size="sm"
                onClick={handleUnselect}
                loading={loading}
              >
                Abandon Task
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
