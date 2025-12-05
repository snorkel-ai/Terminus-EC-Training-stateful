import './Avatar.css';

export function Avatar({ 
  src,
  alt = '',
  fallback,
  size = 'md',
  className = '',
  ...props 
}) {
  const classes = [
    'ui-avatar',
    `ui-avatar-${size}`,
    className
  ].filter(Boolean).join(' ');

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={classes}
        {...props}
      />
    );
  }

  return (
    <div className={`${classes} ui-avatar-fallback`} {...props}>
      {fallback}
    </div>
  );
}

export default Avatar;





