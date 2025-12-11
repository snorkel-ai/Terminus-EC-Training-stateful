import { useRef } from 'react';
import TaskSearchBar from './TaskSearchBar';
import './TaskSearchHeader.css';

function TaskSearchHeader({
  onSearch,
  onClearSearch,
  onOpenFilters
}) {
  const searchBarRef = useRef(null);

  const handleSearchSectionClick = (e) => {
    // Focus the search input when clicking anywhere in the search section
    if (!e.target.closest('.search-clear')) {
      searchBarRef.current?.focus();
    }
  };

  const handleSubmit = (value) => {
    onSearch?.(value);
  };

  const handleClear = () => {
    searchBarRef.current?.clear();
    onClearSearch?.();
  };

  return (
    <div className="task-search-header">
      {/* Search Input Section */}
      <div className="header-section search-section" onClick={handleSearchSectionClick}>
        <div className="section-label">Where</div>
        <TaskSearchBar
          ref={searchBarRef}
          onSubmit={handleSubmit}
          onClear={handleClear}
          variant="embedded"
          placeholder="Search tasks... (press Enter)"
        />
      </div>

      <div className="header-divider"></div>

      {/* Advanced Filters Button */}
      <div className="header-section filter-section">
        <div className="filter-button-container" onClick={onOpenFilters}>
          <div className="filter-text-group">
            <div className="section-label">Filters</div>
            <div className="section-value">Advanced</div>
          </div>
          <div className="filter-icon-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="4" y1="21" x2="4" y2="14"></line>
               <line x1="4" y1="10" x2="4" y2="3"></line>
               <line x1="12" y1="21" x2="12" y2="12"></line>
               <line x1="12" y1="8" x2="12" y2="3"></line>
               <line x1="20" y1="21" x2="20" y2="16"></line>
               <line x1="20" y1="12" x2="20" y2="3"></line>
               <line x1="1" y1="14" x2="7" y2="14"></line>
               <line x1="9" y1="8" x2="15" y2="8"></line>
               <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSearchHeader;
