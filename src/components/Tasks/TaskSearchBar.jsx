import { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import './TaskSearchBar.css';

/**
 * Uncontrolled search input - manages its own state to avoid re-rendering parent.
 * Only communicates with parent via onSubmit (when Enter is pressed).
 */
const TaskSearchBar = forwardRef(function TaskSearchBar({ 
  onSubmit,
  onClear,
  placeholder = "Search tasks... (press Enter)",
  initialValue = '',
  variant = "default" // default | embedded
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!initialValue);
  const inputRef = useRef(null);

  // Expose focus and getValue methods to parent components
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    getValue: () => inputRef.current?.value || '',
    setValue: (val) => {
      if (inputRef.current) {
        inputRef.current.value = val;
        setHasValue(!!val);
      }
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        setHasValue(false);
      }
    }
  }));

  // Detect if user is on Mac for keyboard shortcut display
  const isMac = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    if (navigator.userAgentData?.platform) {
      return navigator.userAgentData.platform.toLowerCase().includes('mac');
    }
    return navigator.platform?.toLowerCase().includes('mac') ?? false;
  }, []);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputRef.current?.value || '';
      onSubmit?.(value);
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  }, [onSubmit]);

  const handleInputChange = useCallback(() => {
    // Just track if there's a value for showing/hiding clear button
    // No state update to parent - completely local
    setHasValue(!!inputRef.current?.value);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setHasValue(false);
      inputRef.current.focus();
    }
    onClear?.();
  }, [onClear]);

  return (
    <div className={`task-search-bar ${variant} ${isFocused ? 'focused' : ''}`}>
      <div className="search-input-wrapper">
        <svg 
          className="search-icon" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          defaultValue={initialValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Search tasks"
          autoComplete="off"
        />

        {/* Show keyboard shortcut when empty, submit arrow when typing */}
        {hasValue ? (
          <button 
            className="search-submit" 
            onClick={() => onSubmit?.(inputRef.current?.value || '')}
            type="button"
            aria-label="Submit search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="search-shortcut">
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </div>
        )}
      </div>
    </div>
  );
});

export default TaskSearchBar;
