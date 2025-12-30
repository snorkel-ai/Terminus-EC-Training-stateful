import './Timer.css';

export function Timer({ 
  time,
  label = 'Time Remaining',
  size = 'md',
  variant = 'default',
  showLabel = true,
  className = '',
  ...props 
}) {
  return (
    <div className={`ui-timer ui-timer-${size} ui-timer-${variant} ${className}`} {...props}>
      {showLabel && <span className="ui-timer-label">{label}</span>}
      <div className="ui-timer-value">{time}</div>
    </div>
  );
}

export function TimerCompact({ 
  time,
  label = 'Time Remaining',
  className = '',
  ...props 
}) {
  return (
    <div className={`ui-timer-compact ${className}`} {...props}>
      <span className="ui-timer-compact-label">{label}</span>
      <span className="ui-timer-compact-value">{time}</span>
    </div>
  );
}

export default Timer;












