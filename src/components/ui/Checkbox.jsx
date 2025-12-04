import { useRef, useEffect } from 'react';
import './Checkbox.css';

export function Checkbox({ 
  checked = false, 
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
  ...props 
}) {
  const inputRef = useRef(null);
  
  // Set indeterminate state via ref (can't be set via attribute)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const classes = [
    'ui-checkbox',
    `ui-checkbox-${size}`,
    checked && 'ui-checkbox-checked',
    indeterminate && 'ui-checkbox-indeterminate',
    disabled && 'ui-checkbox-disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled) return;
    // Only handle if onChange is provided, otherwise let click bubble up
    if (onChange) {
      e.stopPropagation();
      onChange(!checked);
    }
  };

  const checkbox = (
    <div className={classes} onClick={handleClick}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(!checked)}
        className="ui-checkbox-input"
        {...props}
      />
      <div className="ui-checkbox-box">
        {indeterminate ? (
          <div className="ui-checkbox-indeterminate-icon" />
        ) : (
          <svg 
            className="ui-checkbox-check-icon" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );

  if (label) {
    return (
      <label className={`ui-checkbox-label ${disabled ? 'ui-checkbox-label-disabled' : ''}`}>
        {checkbox}
        <span className="ui-checkbox-label-text">{label}</span>
      </label>
    );
  }

  return checkbox;
}

export default Checkbox;

