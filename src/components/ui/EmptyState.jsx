import './EmptyState.css';

export function EmptyState({ 
  icon,
  title,
  description,
  action,
  className = '',
  ...props 
}) {
  return (
    <div className={`ui-empty-state ${className}`} {...props}>
      {icon && (
        <span className="ui-empty-state-icon">
          {typeof icon === 'string' ? icon : icon}
        </span>
      )}
      {title && <h3 className="ui-empty-state-title">{title}</h3>}
      {description && <p className="ui-empty-state-description">{description}</p>}
      {action && <div className="ui-empty-state-action">{action}</div>}
    </div>
  );
}

export default EmptyState;

