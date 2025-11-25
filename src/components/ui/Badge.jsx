import './Badge.css';

export function Badge({ 
  variant = 'default',
  size = 'md',
  className = '',
  children, 
  ...props 
}) {
  const classes = [
    'ui-badge',
    `ui-badge-${variant}`,
    `ui-badge-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Badge;

