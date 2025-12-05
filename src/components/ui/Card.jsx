import './Card.css';

export function Card({ 
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children, 
  ...props 
}) {
  const classes = [
    'ui-card',
    `ui-card-${variant}`,
    `ui-card-padding-${padding}`,
    hoverable && 'ui-card-hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`ui-card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={`ui-card-body ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`ui-card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;





