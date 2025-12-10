import './Divider.css';

export function Divider({ 
  text,
  orientation = 'horizontal',
  className = '',
  ...props 
}) {
  const classes = [
    'ui-divider',
    `ui-divider-${orientation}`,
    text && 'ui-divider-with-text',
    className
  ].filter(Boolean).join(' ');

  if (text) {
    return (
      <div className={classes} {...props}>
        <span className="ui-divider-text">{text}</span>
      </div>
    );
  }

  return <hr className={classes} {...props} />;
}

export function LogoSeparator({ className = '', ...props }) {
  return (
    <span className={`ui-logo-separator ${className}`} {...props}>
      ×
    </span>
  );
}

export default Divider;








