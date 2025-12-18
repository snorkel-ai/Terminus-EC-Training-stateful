import { useEffect, useCallback, useRef, useState } from 'react';
import './Modal.css';

// Threshold for swipe-to-dismiss (in pixels)
const SWIPE_THRESHOLD = 100;

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
  const contentRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose?.();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Reset drag state when modal opens
      setDragOffset(0);
      setIsDragging(false);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  // Check if we're on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  // Handle touch start on the drag handle area
  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    
    // Only start drag if touching near the top of the modal (drag handle area)
    const contentEl = contentRef.current;
    if (!contentEl) return;
    
    const touch = e.touches[0];
    const rect = contentEl.getBoundingClientRect();
    const touchYRelative = touch.clientY - rect.top;
    
    // Only allow drag from the top 60px (handle area)
    if (touchYRelative <= 60) {
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      setIsDragging(true);
      e.preventDefault(); // Prevent scroll
    }
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !isMobile) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      setDragOffset(deltaY);
      e.preventDefault(); // Prevent scroll while dragging
    }
  }, [isDragging, isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !isMobile) return;
    
    const timeDelta = Date.now() - touchStartTime.current;
    const velocity = dragOffset / timeDelta; // pixels per ms
    
    // Close if dragged past threshold OR if swiped quickly
    if (dragOffset > SWIPE_THRESHOLD || (velocity > 0.5 && dragOffset > 30)) {
      // Animate out then close
      setDragOffset(window.innerHeight);
      setTimeout(() => {
        onClose?.();
        setDragOffset(0);
      }, 200);
    } else {
      // Snap back
      setDragOffset(0);
    }
    
    setIsDragging(false);
  }, [isDragging, isMobile, dragOffset, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  // Dynamic styles for drag effect
  const contentStyle = isMobile && dragOffset > 0 ? {
    transform: `translateY(${dragOffset}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
  } : {};

  return (
    <div className="ui-modal-overlay" onClick={handleOverlayClick} {...props}>
      <div 
        ref={contentRef}
        className={`ui-modal-content ui-modal-${size} ${className}`}
        style={contentStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
