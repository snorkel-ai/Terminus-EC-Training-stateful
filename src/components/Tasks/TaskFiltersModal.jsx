import { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Checkbox, Modal } from '../ui';
import './TaskFiltersModal.css';

// Animated counting component
function AnimatedCount({ value, duration = 300 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef(null);
  const startValueRef = useRef(value);

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = startValueRef.current;
    const endValue = value;
    const startTime = performance.now();
    const difference = endValue - startValue;

    // If no change, skip animation
    if (difference === 0) return;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.round(startValue + difference * easeOut);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        startValueRef.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className="animated-count">
      {displayValue}
    </span>
  );
}

function TaskFiltersModal({ 
  isOpen,
  onClose,
  tasks = [], 
  filters, 
  onFilterChange,
}) {
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // 1. Build Category Tree
  const categoryTree = useMemo(() => {
    const tree = {};
    tasks.forEach(task => {
      if (task.is_selected) return;
      const cat = task.category || 'Uncategorized';
      const sub = task.subcategory || 'General';
      
      if (!tree[cat]) {
        tree[cat] = { count: 0, subcategories: {} };
      }
      tree[cat].count++;
      
      if (!tree[cat].subcategories[sub]) {
        tree[cat].subcategories[sub] = 0;
      }
      tree[cat].subcategories[sub]++;
    });
    // Sort categories alphabetically
    return Object.keys(tree).sort().reduce((acc, key) => {
      acc[key] = tree[key];
      return acc;
    }, {});
  }, [tasks]);

  // 2. Filter Tree for Search
  const displayTree = useMemo(() => {
    if (!categorySearch) return categoryTree;
    const lower = categorySearch.toLowerCase();
    const result = {};
    
    Object.entries(categoryTree).forEach(([cat, data]) => {
      const catMatch = cat.toLowerCase().includes(lower);
      const matchingSubs = {};
      let hasMatchingSub = false;
      
      Object.entries(data.subcategories).forEach(([sub, count]) => {
        if (sub.toLowerCase().includes(lower) || catMatch) {
          matchingSubs[sub] = count;
          hasMatchingSub = true;
        }
      });
      
      if (catMatch || hasMatchingSub) {
        result[cat] = {
          count: data.count,
          subcategories: matchingSubs
        };
      }
    });
    return result;
  }, [categoryTree, categorySearch]);

  // Handlers
  const handlePriorityToggle = () => {
    onFilterChange({
      ...filters,
      priorityOnly: !filters.priorityOnly
    });
  };

  const handleDifficultyToggle = (diff) => {
    const current = filters.difficulties || [];
    const next = current.includes(diff)
      ? current.filter(d => d !== diff)
      : [...current, diff];
    onFilterChange({ ...filters, difficulties: next });
  };

  const handleCategoryToggle = (cat) => {
    // Toggle selection of the category
    const currentCats = filters.categories || [];
    const isSelected = currentCats.includes(cat);
    
    let nextCats;
    let nextSubs = [...(filters.subcategories || [])];
    
    if (isSelected) {
      // Deselect category and all its subcategories
      nextCats = currentCats.filter(c => c !== cat);
      
      const catData = categoryTree[cat];
      if (catData && catData.subcategories) {
        const subCats = Object.keys(catData.subcategories);
        nextSubs = nextSubs.filter(s => !subCats.includes(s));
      }
    } else {
      // Select category and ALL its subcategories
      nextCats = [...currentCats, cat];
      
      const catData = categoryTree[cat];
      if (catData && catData.subcategories) {
        const subCats = Object.keys(catData.subcategories);
        // Add all subcategories that aren't already selected
        subCats.forEach(sub => {
          if (!nextSubs.includes(sub)) {
            nextSubs.push(sub);
          }
        });
      }
    }
    
    onFilterChange({ 
      ...filters, 
      categories: nextCats,
      subcategories: nextSubs
    });
  };

  const handleSubcategoryToggle = (sub, parentCat) => {
    const currentSubs = filters.subcategories || [];
    const isSubSelected = currentSubs.includes(sub);
    
    let nextSubs;
    if (isSubSelected) {
      nextSubs = currentSubs.filter(s => s !== sub);
    } else {
      nextSubs = [...currentSubs, sub];
    }
    
    // Determine parent category state
    const currentCats = filters.categories || [];
    let nextCats = [...currentCats];
    
    const catData = categoryTree[parentCat];
    if (catData && catData.subcategories) {
      const allSubs = Object.keys(catData.subcategories);
      const selectedSubsCount = allSubs.filter(s => nextSubs.includes(s)).length;
      
      if (selectedSubsCount === allSubs.length && allSubs.length > 0) {
        // All selected -> Select parent
        if (!nextCats.includes(parentCat)) {
          nextCats.push(parentCat);
        }
      } else if (selectedSubsCount === 0) {
        // None selected -> Deselect parent
        nextCats = nextCats.filter(c => c !== parentCat);
      } else {
        // Some selected -> Parent must be selected for filtering to work
        // Visual indeterminate state is handled by the Checkbox component props
        if (!nextCats.includes(parentCat)) {
          nextCats.push(parentCat);
        }
      }
    }
      
    onFilterChange({ 
      ...filters, 
      categories: nextCats,
      subcategories: nextSubs 
    });
  };

  const toggleExpand = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      subcategories: [],
      difficulties: [],
      priorityOnly: false,
      search: ''
    });
    setCategorySearch('');
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) + 
    (filters.subcategories?.length || 0) + 
    (filters.difficulties?.length || 0) + 
    (filters.priorityOnly ? 1 : 0);

  // Calculate filtered results count
  const filteredCount = useMemo(() => {
    return tasks.filter(task => {
      // Exclude already selected tasks
      if (task.is_selected) return false;
      
      // Priority filter
      if (filters.priorityOnly && !task.is_priority) return false;
      
      // Difficulty filter
      if (filters.difficulties?.length > 0) {
        if (!filters.difficulties.includes(task.difficulty)) return false;
      }
      
      // Category/Subcategory filter
      if (filters.subcategories?.length > 0) {
        const taskSub = task.subcategory || 'General';
        if (!filters.subcategories.includes(taskSub)) return false;
      }
      
      return true;
    }).length;
  }, [tasks, filters]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Tasks"
      size="md"
    >
      <div className="task-filters-modal">
        
        {/* Priority Section */}
        <div className="filter-section">
          <h4>Priority</h4>
          <div 
            className={`priority-toggle-row ${filters.priorityOnly ? 'active' : ''}`}
            onClick={handlePriorityToggle}
          >
            <div className="priority-info">
              <span className="priority-label">
                Double Pay Tasks 💰💰
              </span>
              <span className="priority-sublabel">Show only high-priority items</span>
            </div>
            <div className="toggle-switch" />
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="filter-section">
          <h4>Difficulty</h4>
          <div className="difficulty-list">
            {['easy', 'medium', 'hard'].map(diff => (
              <div 
                key={diff}
                className={`checkbox-row ${filters.difficulties?.includes(diff) ? 'active' : ''}`}
                onClick={() => handleDifficultyToggle(diff)}
              >
                <div className="checkbox-label-group">
                  <Checkbox checked={filters.difficulties?.includes(diff)} />
                  <span style={{ textTransform: 'capitalize' }}>{diff}</span>
                </div>
                {/* Use muscle icons */}
                <span style={{ fontSize: '1rem' }}>
                  {diff === 'easy' ? '💪' : diff === 'medium' ? '💪💪' : '💪💪💪'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Tree Section */}
        <div className="filter-section" style={{ flex: 1, minHeight: 0 }}>
          <h4>Categories</h4>
          <div className="categories-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="category-search-input"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>
            
            <div className="category-tree">
              {Object.entries(displayTree).map(([cat, data]) => {
                const isExpanded = expandedCategories[cat] || categorySearch.length > 0;
                
                // Calculate checkbox state based on subcategory selection
                const allSubs = Object.keys(data.subcategories);
                const selectedSubs = allSubs.filter(s => filters.subcategories?.includes(s));
                const subCount = allSubs.length;
                
                // Determine visual checkbox state:
                // - checked: all children selected (or no children and category selected)
                // - indeterminate: some (but not all) children selected
                const allChildrenSelected = subCount > 0 && selectedSubs.length === subCount;
                const someChildrenSelected = selectedSubs.length > 0 && selectedSubs.length < subCount;
                const isChecked = subCount === 0 
                  ? filters.categories?.includes(cat) 
                  : allChildrenSelected;
                const isIndeterminate = someChildrenSelected;

                return (
                  <div key={cat} className="tree-node">
                    <div className="tree-header">
                      <div className="tree-label-group">
                        <div 
                          className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleExpand(cat); }}
                        >
                          {subCount > 0 && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </div>
                        <div 
                          className="checkbox-label-group" 
                          onClick={() => handleCategoryToggle(cat)}
                          style={{ flex: 1 }}
                        >
                          <Checkbox checked={isChecked} indeterminate={isIndeterminate} />
                          <span className="node-label">{cat}</span>
                        </div>
                      </div>
                      <span className="filter-count">{data.count}</span>
                    </div>

                    {isExpanded && subCount > 0 && (
                      <div className="tree-children">
                        {Object.entries(data.subcategories).map(([sub, count]) => {
                          const isSubSelected = filters.subcategories?.includes(sub);
                          return (
                            <div 
                              key={sub} 
                              className={`child-node ${isSubSelected ? 'active' : ''}`}
                              onClick={() => handleSubcategoryToggle(sub, cat)}
                            >
                              <div className="checkbox-label-group">
                                <Checkbox checked={isSubSelected} />
                                <span>{sub}</span>
                              </div>
                              <span className="filter-count">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            disabled={activeFilterCount === 0}
          >
            Clear all
          </Button>
          <Button variant="primary" onClick={onClose}>
            {activeFilterCount > 0 
              ? <>Show <AnimatedCount value={filteredCount} /> {filteredCount === 1 ? 'Result' : 'Results'}</>
              : 'Show Results'
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default TaskFiltersModal;
