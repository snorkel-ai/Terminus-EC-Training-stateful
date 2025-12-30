import './Button.css';

export function Button({ 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children, 
  ...props 
}) {
  const classes = [
    'ui-btn',
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    loading && 'ui-btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="ui-btn-spinner" />}
      <span className={loading ? 'ui-btn-content-hidden' : ''}>{children}</span>
    </button>
  );
}

export default Button;












