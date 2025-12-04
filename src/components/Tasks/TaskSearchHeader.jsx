import { useState } from 'react';
import TaskSearchBar from './TaskSearchBar';
import { Button } from '../ui';
import './TaskSearchHeader.css';

function TaskSearchHeader({
  searchQuery,
  setSearchQuery,
  suggestions,
  recentSearches,
  handleSuggestionSelect,
  clearSearch,
  filters,
  setFilters,
  onOpenFilters
}) {
  const [difficultyOpen, setDifficultyOpen] = useState(false);

  const handleDifficultySelect = (diff) => {
    // Toggle logic
    const currentDiffs = filters.difficulties || [];
    const newDiffs = currentDiffs.includes(diff)
      ? currentDiffs.filter(d => d !== diff)
      : [...currentDiffs, diff];
    
    setFilters({
      ...filters,
      difficulties: newDiffs
    });
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const activeDifficulties = filters.difficulties || [];
  // Helper to capitalize first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  
  const difficultyLabel = activeDifficulties.length > 0 
    ? activeDifficulties.map(d => capitalize(d)).join(', ')
    : 'Any difficulty';

  return (
    <div className="task-search-header">
      {/* Search Input Section */}
      <div className="header-section search-section">
        <div className="section-label">Where</div>
        <TaskSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          suggestions={suggestions}
          recentSearches={recentSearches}
          onSuggestionSelect={handleSuggestionSelect}
          onClear={clearSearch}
          loading={false}
          variant="embedded"
          placeholder="Search tasks..."
        />
      </div>

      <div className="header-divider"></div>

      {/* Difficulty Dropdown Section */}
      <div className="header-section difficulty-section">
        <div 
          className="difficulty-trigger"
          onClick={() => setDifficultyOpen(!difficultyOpen)}
        >
          <div className="section-label">Difficulty</div>
          <div className={`section-value ${activeDifficulties.length > 0 ? 'active' : ''}`}>
            {difficultyLabel}
          </div>
        </div>
        
        {difficultyOpen && (
          <>
            <div className="fixed-overlay" onClick={() => setDifficultyOpen(false)} />
            <div className="difficulty-dropdown">
              {difficulties.map(diff => (
                <div 
                  key={diff}
                  className={`difficulty-option ${activeDifficulties.includes(diff.toLowerCase()) ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficultySelect(diff.toLowerCase());
                  }}
                >
                  <span>{diff}</span>
                  {activeDifficulties.includes(diff.toLowerCase()) && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
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
