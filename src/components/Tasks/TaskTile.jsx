import { useState, useMemo } from 'react';
import { Button, Badge } from '../ui';
import './Tasks.css';

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

const DifficultyRating = ({ difficulty }) => {
  const diff = difficulty?.toLowerCase();
  let count = 0;
  if (diff === 'hard') count = 3;
  else if (diff === 'medium') count = 2;
  else if (diff === 'easy') count = 1;
  
  return (
    <div className="difficulty-rating" title={`Difficulty: ${difficulty}`} style={{ display: 'flex', gap: '2px' }}>
      {[...Array(3)].map((_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2, fontSize: '1.1em', filter: i < count ? 'none' : 'grayscale(100%)' }}>
          💪
        </span>
      ))}
    </div>
  );
};

function TaskTile({ task, isSelected, isMine, onSelect, onUnselect, showActions = true, searchQuery = '' }) {
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

  // Search highlighting
  const displayedDesc = useMemo(() => {
    if (!searchQuery || !task.description) return task.description;
    return highlightMatches(task.description, searchQuery);
  }, [task.description, searchQuery]);

  return (
    <div 
      className={`task-tile ${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''} ${task.is_highlighted ? 'highlighted' : ''}`}
      onClick={!isMine ? handleSelect : undefined}
      role={!isMine ? "button" : undefined}
      tabIndex={!isMine ? 0 : undefined}
    >
      
      <div className="task-tile-header">
        <span className="task-tile-title" title={task.subcategory || task.subsubcategory || 'Task'}>
          {task.subcategory ? (
            searchQuery ? highlightMatches(task.subcategory, searchQuery) : task.subcategory
          ) : (
             task.subsubcategory || 'Task'
          )}
        </span>
        {task.difficulty && (
          <div className="task-difficulty">
            <DifficultyRating difficulty={task.difficulty} />
          </div>
        )}
      </div>

      <div className="task-tile-separator"></div>

      <div className="task-tile-body">
        <div className="task-description line-clamp-6" title={task.description}>
          {displayedDesc}
        </div>
      </div>

      {showActions && isMine && (
        <div className="task-footer">
          <div className="task-actions full-width">
            <Button 
              variant="danger"
              size="sm"
              onClick={handleUnselect}
              loading={loading}
              className="task-action-btn"
            >
              Abandon Task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskTile;
