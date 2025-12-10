import { useMemo } from 'react';
import { Badge, Button } from '../ui';
import './TaskSidebar.css';

function TaskSidebar({ 
  tasks = [], 
  filters, 
  onFilterChange,
  isOpen,
  onClose
}) {
  // Calculate category counts
  const categoryData = useMemo(() => {
    const data = {};
    tasks.forEach(task => {
      if (!task.category || task.is_selected) return;
      if (!data[task.category]) {
        data[task.category] = 0;
      }
      data[task.category]++;
    });
    return Object.entries(data).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  // Count priority tasks
  const priorityCount = useMemo(() => {
    return tasks.filter(t => t.is_highlighted && !t.is_selected).length;
  }, [tasks]);

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    onFilterChange({
      ...filters,
      categories: newCategories
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
      ...filters,
      categories: [],
      priorityOnly: false
    });
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) + 
    (filters.priorityOnly ? 1 : 0);

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <aside className={`task-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear
            </Button>
          )}
        </div>

        {/* Priority Toggle */}
        <div className="sidebar-section">
          <h4>Priority</h4>
          <label className="priority-toggle">
            <input
              type="checkbox"
              checked={filters.priorityOnly || false}
              onChange={handlePriorityToggle}
            />
            <span className="toggle-switch" />
            <span className="toggle-label">Priority Tasks Only</span>
            <Badge variant="priority" size="sm">{priorityCount}</Badge>
          </label>
        </div>

        {/* Categories */}
        <div className="sidebar-section">
          <h4>Categories</h4>
          <div className="filter-group">
            {categoryData.map(([category, count]) => (
              <label key={category} className="filter-item">
                <div className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category) || false}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span className="checkbox-custom" />
                  <span>{category}</span>
                </div>
                <span className="filter-count">{count}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default TaskSidebar;





