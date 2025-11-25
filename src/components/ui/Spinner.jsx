import './Spinner.css';

export function Spinner({ 
  size = 'md',
  className = '',
  ...props 
}) {
  const classes = [
    'ui-spinner',
    `ui-spinner-${size}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} {...props} />;
}

export function LoadingState({ 
  size = 'md',
  message,
  className = '',
  ...props 
}) {
  return (
    <div className={`ui-loading-state ${className}`} {...props}>
      <Spinner size={size} />
      {message && <p className="ui-loading-message">{message}</p>}
    </div>
  );
}

export default Spinner;

