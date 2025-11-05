import { useProgress } from '../../contexts/ProgressContext';
import './ProgressBar.css';

function ProgressBar() {
  const { getCompletionPercentage, getCompletedCount, totalItems, loading } = useProgress();

  if (loading) return null;

  const percentage = getCompletionPercentage();
  const completedCount = getCompletedCount();

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">Your Progress</span>
        <span className="progress-stats">
          {completedCount}/{totalItems} ({percentage}%)
        </span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="progress-bar-text">{percentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;

