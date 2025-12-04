import './Note.css';

const icons = {
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  none: null
};

export function Note({ 
  title,
  icon = 'none',
  variant = 'default',
  squared = false,
  className = '',
  children,
  ...props 
}) {
  const iconElement = typeof icon === 'string' ? icons[icon] : icon;

  return (
    <div 
      className={`ui-note ui-note-${variant} ${squared ? 'ui-note-squared' : ''} ${className}`}
      {...props}
    >
      {(iconElement || title) && (
        <div className="ui-note-header">
          {iconElement && <span className="ui-note-icon">{iconElement}</span>}
          {title && <span className="ui-note-title">{title}</span>}
        </div>
      )}
      {children && (
        <div className={`ui-note-content ${iconElement || title ? 'ui-note-content-indented' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default Note;




