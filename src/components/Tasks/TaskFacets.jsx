import { useState, useMemo } from 'react';
import { Badge, Button } from '../ui';
import './TaskFacets.css';

function TaskFacets({ 
  tasks = [], 
  filters, 
  onFilterChange,
  aggregates = {} 
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Calculate category counts from tasks
  const categoryData = useMemo(() => {
    const data = {};
    
    tasks.forEach(task => {
      if (!task.category) return;
      
      if (!data[task.category]) {
        data[task.category] = {
          total: 0,
          available: 0,
          subcategories: {}
        };
      }
      
      data[task.category].total++;
      if (!task.is_selected) {
        data[task.category].available++;
      }
      
      if (task.subcategory) {
        if (!data[task.category].subcategories[task.subcategory]) {
          data[task.category].subcategories[task.subcategory] = { total: 0, available: 0 };
        }
        data[task.category].subcategories[task.subcategory].total++;
        if (!task.is_selected) {
          data[task.category].subcategories[task.subcategory].available++;
        }
      }
    });
    
    return data;
  }, [tasks]);

  // Calculate difficulty counts
  const difficultyData = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0, unknown: 0 };
    
    tasks.forEach(task => {
      if (task.is_selected) return;
      
      const diff = task.difficulty?.toLowerCase();
      if (diff === 'easy' || diff === 'medium' || diff === 'hard') {
        counts[diff]++;
      } else {
        counts.unknown++;
      }
    });
    
    return counts;
  }, [tasks]);

  // Count priority tasks
  const priorityCount = useMemo(() => {
    return tasks.filter(t => t.is_highlighted && !t.is_selected).length;
  }, [tasks]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    // Also clear subcategory filters for this category if unchecking
    let newSubcategories = filters.subcategories || [];
    if (!newCategories.includes(category)) {
      const subs = Object.keys(categoryData[category]?.subcategories || {});
      newSubcategories = newSubcategories.filter(s => !subs.includes(s));
    }
    
    onFilterChange({
      ...filters,
      categories: newCategories,
      subcategories: newSubcategories
    });
  };

  const handleSubcategoryToggle = (subcategory, parentCategory) => {
    const newSubcategories = filters.subcategories?.includes(subcategory)
      ? filters.subcategories.filter(s => s !== subcategory)
      : [...(filters.subcategories || []), subcategory];
    
    // Auto-check parent category if not already
    let newCategories = filters.categories || [];
    if (!newCategories.includes(parentCategory) && newSubcategories.includes(subcategory)) {
      newCategories = [...newCategories, parentCategory];
    }
    
    onFilterChange({
      ...filters,
      categories: newCategories,
      subcategories: newSubcategories
    });
  };

  const handleDifficultyToggle = (difficulty) => {
    const newDifficulties = filters.difficulties?.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...(filters.difficulties || []), difficulty];
    
    onFilterChange({
      ...filters,
      difficulties: newDifficulties
    });
  };

  const handlePriorityToggle = () => {
    onFilterChange({
      ...filters,
      priorityOnly: !filters.priorityOnly
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      categories: [],
      subcategories: [],
      difficulties: [],
      priorityOnly: false
    });
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) + 
    (filters.subcategories?.length || 0) + 
    (filters.difficulties?.length || 0) + 
    (filters.priorityOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  const sortedCategories = Object.entries(categoryData)
    .sort((a, b) => b[1].available - a[1].available);

  return (
    <aside className="task-facets">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="facets-active">
          <div className="facets-active-header">
            <span className="facets-active-count">{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</span>
            <button className="facets-clear-all" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
          <div className="facets-active-pills">
            {filters.search && (
              <span className="filter-pill">
                "{filters.search}"
                <button onClick={() => onFilterChange({ ...filters, search: '' })}>×</button>
              </span>
            )}
            {filters.priorityOnly && (
              <span className="filter-pill priority">
                Priority only
                <button onClick={handlePriorityToggle}>×</button>
              </span>
            )}
            {filters.categories?.map(cat => (
              <span key={cat} className="filter-pill category">
                {cat}
                <button onClick={() => handleCategoryToggle(cat)}>×</button>
              </span>
            ))}
            {filters.difficulties?.map(diff => (
              <span key={diff} className="filter-pill difficulty">
                {diff}
                <button onClick={() => handleDifficultyToggle(diff)}>×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Priority Filter */}
      <div className="facet-section">
        <h3 className="facet-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Priority
        </h3>
        <label className="facet-checkbox priority-checkbox">
          <input
            type="checkbox"
            checked={filters.priorityOnly || false}
            onChange={handlePriorityToggle}
          />
          <span className="checkbox-custom" />
          <span className="checkbox-label">Show priority only</span>
          <Badge variant="priority" size="sm">{priorityCount}</Badge>
        </label>
      </div>

      {/* Difficulty Filter */}
      <div className="facet-section">
        <h3 className="facet-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          Difficulty
        </h3>
        <div className="difficulty-chips">
          <button
            className={`difficulty-chip easy ${filters.difficulties?.includes('easy') ? 'active' : ''}`}
            onClick={() => handleDifficultyToggle('easy')}
          >
            Easy <span>{difficultyData.easy}</span>
          </button>
          <button
            className={`difficulty-chip medium ${filters.difficulties?.includes('medium') ? 'active' : ''}`}
            onClick={() => handleDifficultyToggle('medium')}
          >
            Medium <span>{difficultyData.medium}</span>
          </button>
          <button
            className={`difficulty-chip hard ${filters.difficulties?.includes('hard') ? 'active' : ''}`}
            onClick={() => handleDifficultyToggle('hard')}
          >
            Hard <span>{difficultyData.hard}</span>
          </button>
          <button
            className={`difficulty-chip unknown ${filters.difficulties?.includes('unknown') ? 'active' : ''}`}
            onClick={() => handleDifficultyToggle('unknown')}
          >
            Unrated <span>{difficultyData.unknown}</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="facet-section categories-section">
        <h3 className="facet-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Categories
        </h3>
        <div className="categories-list">
          {sortedCategories.map(([category, data]) => {
            const isExpanded = expandedCategories.has(category);
            const isChecked = filters.categories?.includes(category);
            const subcategoryEntries = Object.entries(data.subcategories || {})
              .sort((a, b) => b[1].available - a[1].available);
            
            return (
              <div key={category} className={`category-group ${isExpanded ? 'expanded' : ''}`}>
                <div className="category-row">
                  <label className="facet-checkbox">
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className="checkbox-custom" />
                    <span className="checkbox-label">{category}</span>
                  </label>
                  <span className="category-count">{data.available}</span>
                  {subcategoryEntries.length > 0 && (
                    <button 
                      className="category-expand"
                      onClick={() => toggleCategory(category)}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {isExpanded && subcategoryEntries.length > 0 && (
                  <div className="subcategories-list">
                    {subcategoryEntries.map(([subcategory, subData]) => (
                      <label key={subcategory} className="facet-checkbox subcategory-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.subcategories?.includes(subcategory) || false}
                          onChange={() => handleSubcategoryToggle(subcategory, category)}
                        />
                        <span className="checkbox-custom" />
                        <span className="checkbox-label">{subcategory}</span>
                        <span className="category-count">{subData.available}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default TaskFacets;





