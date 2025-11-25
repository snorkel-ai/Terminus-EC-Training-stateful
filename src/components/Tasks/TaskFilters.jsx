import { useState, useEffect, useMemo } from 'react';
import { Button, SearchInput } from '../ui';
import './Tasks.css';

function TaskFilters({ filters, onFilterChange, tasks }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique values for filter dropdowns
  const { categories, subcategories, subsubcategories } = useMemo(() => {
    const cats = new Set();
    const subs = new Set();
    const subsubs = new Set();

    tasks.forEach(task => {
      if (task.category) cats.add(task.category);
      if (task.subcategory) subs.add(task.subcategory);
      if (task.subsubcategory) subsubs.add(task.subsubcategory);
    });

    return {
      categories: Array.from(cats).sort(),
      subcategories: Array.from(subs).sort(),
      subsubcategories: Array.from(subsubs).sort()
    };
  }, [tasks]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ ...filters, search: searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value });
  };

  const handleSubcategoryChange = (e) => {
    onFilterChange({ ...filters, subcategory: e.target.value });
  };

  const handleSubsubcategoryChange = (e) => {
    onFilterChange({ ...filters, subsubcategory: e.target.value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      category: '',
      subcategory: '',
      subsubcategory: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.category || filters.subcategory || filters.subsubcategory || filters.search;

  return (
    <div className="task-filters">
      <div className="filter-row">
        <input
          type="text"
          className="filter-search"
          placeholder="Search tasks by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="filter-select"
          value={filters.category || ''}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={filters.subcategory || ''}
          onChange={handleSubcategoryChange}
        >
          <option value="">All Subcategories</option>
          {subcategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={filters.subsubcategory || ''}
          onChange={handleSubsubcategoryChange}
        >
          <option value="">All Topics</option>
          {subsubcategories.map(subsub => (
            <option key={subsub} value={subsub}>{subsub}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default TaskFilters;
