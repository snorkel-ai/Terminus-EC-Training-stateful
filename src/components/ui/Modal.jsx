import { useEffect, useCallback } from 'react';
import './Modal.css';

export function Modal({ 
  isOpen,
  onClose,
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = false,
  size = 'md',
  className = '',
  children,
  ...props 
}) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose?.();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  return (
    <div className="ui-modal-overlay" onClick={handleOverlayClick} {...props}>
      <div className={`ui-modal-content ui-modal-${size} ${className}`}>
        {showCloseButton && (
          <button className="ui-modal-close" onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ className = '', children, ...props }) {
  return (
    <div className={`ui-modal-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ModalBody({ className = '', children, ...props }) {
  return (
    <div className={`ui-modal-body ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ className = '', children, ...props }) {
  return (
    <div className={`ui-modal-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Modal;






