import { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Checkbox, Modal, SearchInput } from '../ui';
import './TaskFiltersModal.css';

function AnimatedCount({ value, duration = 300 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef(null);
  const startValueRef = useRef(value);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = startValueRef.current;
    const endValue = value;
    const startTime = performance.now();
    const difference = endValue - startValue;

    if (difference === 0) return;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
  const [expandedTypes, setExpandedTypes] = useState({});

  // Build type → subtypes tree from tasks
  // Since subtypes is an array, a single task can contribute to multiple subtypes
  const typeTree = useMemo(() => {
    const tree = {};
    tasks.forEach(task => {
      const type = task.type || 'Uncategorized';
      
      if (!tree[type]) {
        tree[type] = { count: 0, subtypes: {} };
      }
      tree[type].count++;
      
      const subtypes = task.subtypes || [];
      subtypes.forEach(sub => {
        if (!tree[type].subtypes[sub]) {
          tree[type].subtypes[sub] = 0;
        }
        tree[type].subtypes[sub]++;
      });
    });
    return Object.keys(tree).sort().reduce((acc, key) => {
      acc[key] = tree[key];
      return acc;
    }, {});
  }, [tasks]);

  // Collect all unique languages from tasks
  const allLanguages = useMemo(() => {
    const langSet = new Set();
    tasks.forEach(task => {
      (task.languages || []).forEach(l => langSet.add(l));
    });
    return [...langSet].sort();
  }, [tasks]);

  // Filter tree for search
  const displayTree = useMemo(() => {
    if (!categorySearch) return typeTree;
    const lower = categorySearch.toLowerCase();
    const result = {};
    
    Object.entries(typeTree).forEach(([type, data]) => {
      const typeMatch = type.toLowerCase().includes(lower);
      const matchingSubs = {};
      let hasMatchingSub = false;
      
      Object.entries(data.subtypes).forEach(([sub, count]) => {
        if (sub.toLowerCase().includes(lower) || typeMatch) {
          matchingSubs[sub] = count;
          hasMatchingSub = true;
        }
      });
      
      if (typeMatch || hasMatchingSub) {
        result[type] = {
          count: data.count,
          subtypes: matchingSubs
        };
      }
    });
    return result;
  }, [typeTree, categorySearch]);

  const handleTypeToggle = (type) => {
    const currentTypes = filters.types || [];
    const isSelected = currentTypes.includes(type);
    
    let nextTypes;
    let nextSubs = [...(filters.subtypes || [])];
    
    if (isSelected) {
      nextTypes = currentTypes.filter(t => t !== type);
      const typeData = typeTree[type];
      if (typeData?.subtypes) {
        const subNames = Object.keys(typeData.subtypes);
        nextSubs = nextSubs.filter(s => !subNames.includes(s));
      }
    } else {
      nextTypes = [...currentTypes, type];
      const typeData = typeTree[type];
      if (typeData?.subtypes) {
        Object.keys(typeData.subtypes).forEach(sub => {
          if (!nextSubs.includes(sub)) {
            nextSubs.push(sub);
          }
        });
      }
    }
    
    onFilterChange({ 
      ...filters, 
      types: nextTypes,
      subtypes: nextSubs
    });
  };

  const handleSubtypeToggle = (sub, parentType) => {
    const currentSubs = filters.subtypes || [];
    const isSubSelected = currentSubs.includes(sub);
    
    let nextSubs = isSubSelected
      ? currentSubs.filter(s => s !== sub)
      : [...currentSubs, sub];
    
    const currentTypes = filters.types || [];
    let nextTypes = [...currentTypes];
    
    const typeData = typeTree[parentType];
    if (typeData?.subtypes) {
      const allSubs = Object.keys(typeData.subtypes);
      const selectedSubsCount = allSubs.filter(s => nextSubs.includes(s)).length;
      
      if (selectedSubsCount === allSubs.length && allSubs.length > 0) {
        if (!nextTypes.includes(parentType)) nextTypes.push(parentType);
      } else if (selectedSubsCount === 0) {
        nextTypes = nextTypes.filter(t => t !== parentType);
      } else {
        if (!nextTypes.includes(parentType)) nextTypes.push(parentType);
      }
    }
      
    onFilterChange({ 
      ...filters, 
      types: nextTypes,
      subtypes: nextSubs 
    });
  };

  const handleLanguageToggle = (lang) => {
    const current = filters.languages || [];
    const next = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    onFilterChange({ ...filters, languages: next });
  };

  const toggleExpand = (type) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const clearAllFilters = () => {
    onFilterChange({
      types: [],
      subtypes: [],
      languages: [],
      milestoneOnly: false,
      externalCodeOnly: false,
      search: ''
    });
    setCategorySearch('');
  };

  const activeFilterCount = 
    (filters.types?.length || 0) + 
    (filters.subtypes?.length || 0) + 
    (filters.languages?.length || 0) +
    (filters.milestoneOnly ? 1 : 0) +
    (filters.externalCodeOnly ? 1 : 0);

  const filteredCount = useMemo(() => {
    return tasks.filter(task => {
      if (filters.subtypes?.length > 0) {
        const taskSubs = task.subtypes || [];
        if (!taskSubs.some(s => filters.subtypes.includes(s))) return false;
      }
      
      if (filters.languages?.length > 0) {
        const taskLangs = task.languages || [];
        if (!taskLangs.some(l => filters.languages.includes(l))) return false;
      }
      
      if (filters.milestoneOnly && !task.is_milestone) return false;
      if (filters.externalCodeOnly && !task.has_external_code) return false;
      
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
        
        {/* Task Type Toggles */}
        <div className="filter-section">
          <h4>Task Properties</h4>
          <div className="toggle-group">
            <div 
              className={`priority-toggle-row ${filters.milestoneOnly ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, milestoneOnly: !filters.milestoneOnly })}
            >
              <div className="priority-info">
                <span className="priority-label">Milestone tasks only</span>
              </div>
              <div className="toggle-switch" />
            </div>
            <div 
              className={`priority-toggle-row ${filters.externalCodeOnly ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, externalCodeOnly: !filters.externalCodeOnly })}
            >
              <div className="priority-info">
                <span className="priority-label">Has extra inspiration</span>
              </div>
              <div className="toggle-switch" />
            </div>
          </div>
        </div>

        {/* Languages */}
        {allLanguages.length > 0 && (
          <div className="filter-section">
            <h4>Languages</h4>
            <div className="language-chips">
              {allLanguages.map(lang => {
                const isActive = (filters.languages || []).includes(lang);
                return (
                  <button
                    key={lang}
                    className={`language-chip ${isActive ? 'active' : ''}`}
                    onClick={() => handleLanguageToggle(lang)}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories Tree Section */}
        <div className="filter-section" style={{ flex: 1, minHeight: 0 }}>
          <h4>Categories</h4>
          <div className="categories-container">
            <div className="search-container">
              <SearchInput
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onClear={() => setCategorySearch('')}
                className="category-search-input"
              />
            </div>
            
            <div className="category-tree">
              {Object.keys(displayTree).length === 0 ? (
                <div className="empty-search-state">
                  <p>No categories found</p>
                </div>
              ) : (
                Object.entries(displayTree).map(([type, data]) => {
                const isExpanded = expandedTypes[type] || categorySearch.length > 0;
                
                const allSubs = Object.keys(data.subtypes);
                const selectedSubs = allSubs.filter(s => filters.subtypes?.includes(s));
                const subCount = allSubs.length;
                
                const allChildrenSelected = subCount > 0 && selectedSubs.length === subCount;
                const someChildrenSelected = selectedSubs.length > 0 && selectedSubs.length < subCount;
                const isChecked = subCount === 0 
                  ? filters.types?.includes(type) 
                  : allChildrenSelected;
                const isIndeterminate = someChildrenSelected;

                return (
                  <div key={type} className="tree-node">
                    <div className="tree-header">
                      <div className="tree-label-group">
                        <div 
                          className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleExpand(type); }}
                        >
                          {subCount > 0 && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </div>
                        <div 
                          className="checkbox-label-group" 
                          onClick={() => handleTypeToggle(type)}
                          style={{ flex: 1 }}
                        >
                          <Checkbox checked={isChecked} indeterminate={isIndeterminate} />
                          <span className="node-label">{type}</span>
                        </div>
                      </div>
                      <span className="filter-count">{data.count}</span>
                    </div>

                    {isExpanded && subCount > 0 && (
                      <div className="tree-children">
                        {Object.entries(data.subtypes).map(([sub, count]) => {
                          const isSubSelected = filters.subtypes?.includes(sub);
                          return (
                            <div 
                              key={sub} 
                              className={`child-node ${isSubSelected ? 'active' : ''}`}
                              onClick={() => handleSubtypeToggle(sub, type)}
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
              })
              )}
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
            Show <AnimatedCount value={filteredCount} /> {filteredCount === 1 ? 'Result' : 'Results'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default TaskFiltersModal;
