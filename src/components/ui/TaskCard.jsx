import { useMemo } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import './TaskCard.css';

function highlightMatches(text, query) {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  );
}

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
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * DifficultyRating - kept for backward compatibility with v1 task views (e.g. TaskWorkflowModal)
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
 * TaskCard - Reusable task card for TBench v2 tasks
 * Built on top of the Card design system component
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
  const displayedTitle = useMemo(() => {
    const title = task?.title || 'Task';
    if (!searchQuery) return title;
    return highlightMatches(title, searchQuery);
  }, [task?.title, searchQuery]);

  const displayedSubtypes = useMemo(() => {
    const subtypes = task?.subtypes || [];
    if (subtypes.length === 0) return task?.type || null;
    return subtypes.join(', ');
  }, [task?.subtypes, task?.type]);

  const isClickable = !!onClick;

  const taskClasses = [
    'task-card',
    isCompleted && 'task-card--completed',
    isHighlighted && 'task-card--highlighted',
    className
  ].filter(Boolean).join(' ');

  const getStatusBadgeVariant = (status) => {
    const normalized = status?.toLowerCase().replace(/\s+/g, '-');
    if (normalized === 'in-progress') return 'info';
    if (normalized === 'waiting-on-review') return 'warning';
    if (normalized === 'accepted') return 'success';
    return 'default';
  };

  const hasFeatures = task?.is_milestone || task?.has_external_code;

  return (
    <Card 
      variant="bordered"
      padding="none" /* We'll handle padding internally for better layout control */
      hoverable={isClickable}
      className={taskClasses}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.(e) : undefined}
    >
      <div className="task-card__inner">
        {isCompleted && (
          <div className="task-card__ribbon">
            <span>Marked as Accepted</span>
          </div>
        )}
        
        {/* Header: Subtypes */}
        <div className="task-card__header">
          <div className="task-card__subcategory">
            {searchQuery ? highlightMatches(displayedSubtypes, searchQuery) : displayedSubtypes}
          </div>
          {/* Status Badge (if present) - top right */}
          {(claimedAt || completedAt || statusBadge) && (
            <div className="task-card__status-indicator">
              {statusBadge ? (
                 <Badge variant={getStatusBadgeVariant(statusBadge)} size="sm">{statusBadge}</Badge>
              ) : (
                 <span className="task-card__claimed-text">Claimed</span>
              )}
            </div>
          )}
        </div>
        
        {/* Title - The Hero */}
        <h3 className="task-card__title" title={task?.title || 'Task'}>
          {displayedTitle}
        </h3>

        {/* Description snippet */}
        {task?.description && (
          <p className="task-card__description">
            {searchQuery ? highlightMatches(task.description, searchQuery) : task.description}
          </p>
        )}

        {/* Languages */}
        <div className="task-card__languages">
          {(task?.languages || []).slice(0, 3).map(lang => (
            <span key={lang} className="task-lang-tag">{lang}</span>
          ))}
          {(task?.languages || []).length > 3 && (
            <span className="task-lang-tag">+{task.languages.length - 3}</span>
          )}
        </div>

        {/* Spacer to push footer down */}
        <div className="task-card__spacer" />

        {/* Footer: Features Row */}
        {hasFeatures && (
          <div className="task-card__footer-features">
             {task.is_milestone && (
              <div className="feature-item" title="This task is broken down into milestones">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span>Has Milestones</span>
              </div>
             )}
             {task.has_external_code && (
              <div className="feature-item" title="This task includes additional inspiration to help guide your work">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Extra Inspiration</span>
              </div>
             )}
          </div>
        )}

        {/* Action Footer (for My Tasks view) */}
        {footer && (
          <div className="task-card__actions-footer">
            {footer}
          </div>
        )}

        {/* Timestamp Footer (if needed) */}
        {(claimedAt || completedAt) && !footer && (
          <div className="task-card__timestamp-footer">
            <span className={`task-card__timestamp ${isCompleted && completedAt ? 'task-card__timestamp--accepted' : ''}`}>
              {isCompleted && completedAt ? '🎉 ' : '⏱ '}
              {isCompleted && completedAt 
                ? `Accepted ${formatTimeSince(completedAt)}`
                : `Claimed ${formatTimeSince(claimedAt)}`
              }
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default TaskCard;
