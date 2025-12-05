import { useMemo } from 'react';
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
 * 
 * @param {Object} task - Task object with description, subcategory, difficulty, etc.
 * @param {boolean} isCompleted - Whether the task is marked as completed
 * @param {boolean} isHighlighted - Whether to show highlighted/priority styling
 * @param {string} searchQuery - Search query for highlighting matches
 * @param {function} onClick - Click handler for the card
 * @param {React.ReactNode} footer - Optional footer content (buttons, etc.)
 * @param {string} claimedAt - ISO date string of when the task was claimed
 * @param {string} completedAt - ISO date string of when the task was completed/accepted
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
  className = ''
}) {
  // Search highlighting for description
  const displayedDesc = useMemo(() => {
    if (!searchQuery || !task?.description) return task?.description;
    return highlightMatches(task.description, searchQuery);
  }, [task?.description, searchQuery]);

  // Search highlighting for title
  const displayedTitle = useMemo(() => {
    const title = task?.subcategory || task?.subsubcategory || 'Task';
    if (!searchQuery) return title;
    return highlightMatches(title, searchQuery);
  }, [task?.subcategory, task?.subsubcategory, searchQuery]);

  const isClickable = !!onClick;

  return (
    <div 
      className={`task-card ${isCompleted ? 'completed' : ''} ${isHighlighted ? 'highlighted' : ''} ${isClickable ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
    >
      {/* Corner ribbon for completed/accepted tasks */}
      {isCompleted && (
        <div className="task-card-ribbon">
          <span>Accepted</span>
        </div>
      )}
      
      <div className="task-card-header">
        <div className="task-card-header-content">
          <div className="task-card-title-row">
            <span className="task-card-title" title={task?.subcategory || task?.subsubcategory || 'Task'}>
              {displayedTitle}
            </span>
            <div className="task-card-title-right">
              {task?.difficulty && (
                <DifficultyRating difficulty={task.difficulty} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="task-card-separator" />

      <div className="task-card-body">
        <span className="task-card-label">Goal</span>
        <div className="task-card-description" title={task?.description}>
          {displayedDesc}
        </div>
      </div>

      {/* Meta info (claim/completion date) */}
      {(claimedAt || completedAt) && (
        <div className="task-card-meta">
          <span className={`task-card-claimed ${isCompleted && completedAt ? 'accepted' : ''}`}>
            {isCompleted && completedAt ? (
              // Party/celebration icon for accepted
              <span className="accepted-icon">🎉</span>
            ) : (
              // Clock icon for claimed
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
        </div>
      )}

      {footer && (
        <div className="task-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default TaskCard;

