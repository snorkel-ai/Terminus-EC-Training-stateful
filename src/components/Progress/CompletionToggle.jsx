import { useState } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import './CompletionToggle.css';

function CompletionToggle({ itemId, label }) {
  const { isCompleted, toggleCompletion } = useProgress();
  const [isUpdating, setIsUpdating] = useState(false);
  const completed = isCompleted(itemId);

  const handleToggle = async () => {
    setIsUpdating(true);
    await toggleCompletion(itemId);
    setIsUpdating(false);
  };

  return (
    <button
      className={`completion-toggle ${completed ? 'completed' : ''}`}
      onClick={handleToggle}
      disabled={isUpdating}
      title={completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      <span className="completion-checkbox">
        {completed && (
          <svg 
            className="completion-checkmark" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </span>
      <span className="completion-label">
        {label || (completed ? 'Completed' : 'Mark as Complete')}
      </span>
    </button>
  );
}

export default CompletionToggle;

