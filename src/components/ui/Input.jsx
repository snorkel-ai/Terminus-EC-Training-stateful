import './Input.css';

export function Input({ 
  type = 'text',
  label,
  error,
  id,
  className = '',
  ...props 
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`ui-input-group ${error ? 'ui-input-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className="ui-input"
        {...props}
      />
      {error && <span className="ui-input-error-message">{error}</span>}
    </div>
  );
}

export function TextArea({ 
  label,
  error,
  id,
  className = '',
  rows = 4,
  ...props 
}) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`ui-input-group ${error ? 'ui-input-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="ui-input-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className="ui-input ui-textarea"
        rows={rows}
        {...props}
      />
      {error && <span className="ui-input-error-message">{error}</span>}
    </div>
  );
}

export function SearchInput({ 
  className = '',
  ...props 
}) {
  return (
    <div className={`ui-search-wrapper ${className}`}>
      <svg 
        className="ui-search-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        className="ui-input ui-search-input"
        {...props}
      />
    </div>
  );
}

export default Input;




