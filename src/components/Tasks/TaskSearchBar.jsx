import { useState, useRef, useEffect, useCallback } from 'react';
import { Badge } from '../ui';
import './TaskSearchBar.css';

function TaskSearchBar({ 
  value, 
  onChange, 
  suggestions = [], 
  recentSearches = [],
  onSuggestionSelect,
  onClear,
  placeholder = "Search tasks by keyword, category, or topic...",
  loading = false,
  variant = "default" // default | embedded
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Combine suggestions and recent searches for dropdown
  const dropdownItems = value.trim() 
    ? suggestions 
    : recentSearches.length > 0 
      ? recentSearches.map(s => ({ type: 'recent', value: s, label: s }))
      : [];

  const hasDropdownItems = dropdownItems.length > 0;

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!showDropdown || !hasDropdownItems) {
      if (e.key === 'ArrowDown' && hasDropdownItems) {
        setShowDropdown(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < dropdownItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : dropdownItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && dropdownItems[highlightedIndex]) {
          handleSelectItem(dropdownItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [showDropdown, hasDropdownItems, highlightedIndex, dropdownItems]);

  const handleSelectItem = (item) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(item);
    } else {
      onChange(item.value || item.label);
    }
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (hasDropdownItems || (!value && recentSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding to allow click on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false);
      }
    }, 150);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

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
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Search tasks"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          autoComplete="off"
        />

        {loading && (
          <div className="search-loading">
            <div className="search-spinner" />
          </div>
        )}

        {value && !loading && (
          <button 
            className="search-clear" 
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="search-shortcut">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && hasDropdownItems && (
        <div 
          ref={dropdownRef}
          className="search-dropdown"
          role="listbox"
        >
          {!value && recentSearches.length > 0 && (
            <div className="dropdown-section-label">Recent searches</div>
          )}
          {value && suggestions.length > 0 && (
            <div className="dropdown-section-label">Suggestions</div>
          )}
          
          {dropdownItems.map((item, index) => (
            <div
              key={`${item.type}-${item.value}-${index}`}
              className={`dropdown-item ${highlightedIndex === index ? 'highlighted' : ''}`}
              onClick={() => handleSelectItem(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              {item.type === 'recent' && (
                <svg className="dropdown-item-icon recent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )}
              {item.type === 'category' && (
                <svg className="dropdown-item-icon category" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {item.type === 'subcategory' && (
                <svg className="dropdown-item-icon subcategory" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
              {item.type === 'keyword' && (
                <svg className="dropdown-item-icon keyword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="14" y2="15" />
                </svg>
              )}
              
              <span className="dropdown-item-label">{item.label}</span>
              
              {item.count !== undefined && (
                <Badge variant="secondary" size="sm">{item.count}</Badge>
              )}
              
              {item.type === 'category' && (
                <span className="dropdown-item-hint">in {item.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state when focused but no results */}
      {showDropdown && value && dropdownItems.length === 0 && !loading && (
        <div className="search-dropdown">
          <div className="dropdown-empty">
            <p>No suggestions found</p>
            <span>Press Enter to search for "{value}"</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskSearchBar;

