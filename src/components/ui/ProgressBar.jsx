import './ProgressBar.css';

export function ProgressBar({ 
  progress = 0, 
  variant = 'default',
  size = 'md',
  showLabel = false,
  label = '',
  className = '',
  ...props 
}) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Auto-determine variant based on progress if not specified
  const computedVariant = variant === 'auto' 
    ? (clampedProgress < 20 ? 'danger' : clampedProgress < 50 ? 'warning' : 'success')
    : variant;

  return (
    <div className={`ui-progress-wrapper ${className}`} {...props}>
      {showLabel && (
        <div className="ui-progress-label">
          <span>{label}</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`ui-progress-bar ui-progress-${size}`}>
        <div 
          className={`ui-progress-fill ui-progress-${computedVariant}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;




