import { useMemo } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import './TaskCard.css';

// Helper to highlight search matches in text
function highlightMatches(text, query) {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  );
}

// Helper to format time since a date
function formatTimeSince(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  // Format as date for older items
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * DifficultyRating - Visual difficulty indicator with muscle emojis
 */
export const DifficultyRating = ({ difficulty }) => {
  const diff = difficulty?.toLowerCase();
  let count = 0;
  if (diff === 'hard') count = 3;
  else if (diff === 'medium') count = 2;
  else if (diff === 'easy') count = 1;
  
  return (
    <div className="task-card-difficulty" title={`Difficulty: ${difficulty}`}>
      {[...Array(3)].map((_, i) => (
        <span key={i} className={i < count ? 'active' : 'inactive'}>
          💪
        </span>
      ))}
    </div>
  );
};

/**
 * TaskCard - Reusable task card component for displaying task information
 * Built on top of the Card design system component
 * 
 * @param {Object} task - Task object with title, category, subcategory, difficulty, etc.
 * @param {boolean} isCompleted - Whether the task is marked as completed
 * @param {boolean} isHighlighted - Whether to show highlighted/priority styling
 * @param {string} searchQuery - Search query for highlighting matches
 * @param {function} onClick - Click handler for the card
 * @param {React.ReactNode} footer - Optional footer content (buttons, etc.)
 * @param {string} claimedAt - ISO date string of when the task was claimed
 * @param {string} completedAt - ISO date string of when the task was completed/accepted
 * @param {string} statusBadge - Optional status badge text to display (e.g., "In Progress", "Waiting on Review")
 * @param {string} className - Additional CSS classes
 */
function TaskCard({ 
  task, 
  isCompleted = false,
  isHighlighted = false,
  searchQuery = '',
  onClick,
  footer,
  claimedAt,
  completedAt,
  statusBadge,
  className = ''
}) {
  // Search highlighting for title
  const displayedTitle = useMemo(() => {
    const title = task?.title || 'Task';
    if (!searchQuery) return title;
    return highlightMatches(title, searchQuery);
  }, [task?.title, searchQuery]);

  // Search highlighting for category breadcrumb
  const displayedSubcategory = useMemo(() => {
    const subcategory = task?.subcategory || task?.subsubcategory;
    if (!searchQuery || !subcategory) return subcategory;
    return highlightMatches(subcategory, searchQuery);
  }, [task?.subcategory, task?.subsubcategory, searchQuery]);

  const isClickable = !!onClick;

  // Build class names for task-specific styling
  const taskClasses = [
    'task-card',
    isCompleted && 'task-card--completed',
    isHighlighted && 'task-card--highlighted',
    className
  ].filter(Boolean).join(' ');

  // Map status badge to Badge variant
  const getStatusBadgeVariant = (status) => {
    const normalized = status?.toLowerCase().replace(/\s+/g, '-');
    if (normalized === 'in-progress') return 'info';
    if (normalized === 'waiting-on-review') return 'warning';
    if (normalized === 'accepted') return 'success';
    return 'default';
  };

  return (
    <Card 
      variant="bordered"
      padding="sm"
      hoverable={isClickable}
      className={taskClasses}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
    >
      {/* Corner ribbon for completed/accepted tasks */}
      {isCompleted && (
        <div className="task-card__ribbon">
          <span>Accepted</span>
        </div>
      )}
      
      {/* Subcategory label */}
      <div className="task-card__subcategory">
        {displayedSubcategory || task?.category}
      </div>
      
      <div className="task-card__divider" />
      
      {/* Task label */}
      <span className="task-card__label">Task</span>
      
      {/* Title row with difficulty */}
      <div className="task-card__title-row">
        <h3 className="task-card__title" title={task?.title || 'Task'}>
          {displayedTitle}
        </h3>
        {task?.difficulty && (
          <DifficultyRating difficulty={task.difficulty} />
        )}
      </div>

      {/* Meta info (claim/completion date and status) */}
      {(claimedAt || completedAt || statusBadge) && (
        <div className="task-card__meta">
          {statusBadge && (
            <Badge variant={getStatusBadgeVariant(statusBadge)} size="sm">
              {statusBadge}
            </Badge>
          )}
          {(claimedAt || completedAt) && (
            <span className={`task-card__timestamp ${isCompleted && completedAt ? 'task-card__timestamp--accepted' : ''}`}>
              {isCompleted && completedAt ? (
                <span className="task-card__timestamp-icon">🎉</span>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )}
              {isCompleted && completedAt 
                ? `Accepted ${formatTimeSince(completedAt)}`
                : `Claimed ${formatTimeSince(claimedAt)}`
              }
            </span>
          )}
        </div>
      )}

      {footer && (
        <div className="task-card__footer">
          {footer}
        </div>
      )}
    </Card>
  );
}

export default TaskCard;
