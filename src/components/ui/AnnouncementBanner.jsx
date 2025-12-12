import './AnnouncementBanner.css';

/**
 * AnnouncementBanner - A banner for important announcements
 * 
 * Variants:
 * - 'warning' (default): Amber/orange prominent card for warnings
 * - 'info': Blue prominent card for informational messages
 * - 'success': Green prominent card for success confirmations
 * - 'error': Red prominent card for errors
 * - 'subtle': Compact inline strip (great for persistent messages under nav)
 * 
 * @example
 * // Prominent warning banner
 * <AnnouncementBanner variant="warning" title="Important Notice">
 *   Additional details here.
 * </AnnouncementBanner>
 * 
 * @example
 * // Subtle banner for under navigation
 * <AnnouncementBanner variant="subtle" title="Notice —">
 *   Brief message displayed inline.
 * </AnnouncementBanner>
 * 
 * @param {string} variant - 'warning' | 'info' | 'success' | 'error' | 'subtle'
 * @param {string} title - Bold headline text (for subtle variant, add "—" for visual separator)
 * @param {string|ReactNode} children - Description/body content
 * @param {string} className - Additional CSS classes
 * @param {boolean} dismissible - Show dismiss button (default: false)
 * @param {function} onDismiss - Callback when dismissed
 */
export function AnnouncementBanner({ 
  variant = 'warning',
  title,
  children,
  className = '',
  dismissible = false,
  onDismiss,
  ...props 
}) {
  const icons = {
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  };

  return (
    <div 
      className={`announcement-banner announcement-banner--${variant} ${className}`}
      role="alert"
      {...props}
    >
      <div className="announcement-banner__icon">
        {icons[variant] || icons.warning}
      </div>
      <div className="announcement-banner__content">
        {title && <strong className="announcement-banner__title">{title}</strong>}
        {children && <div className="announcement-banner__body">{children}</div>}
      </div>
      {dismissible && (
        <button 
          type="button"
          className="announcement-banner__dismiss" 
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default AnnouncementBanner;

