import { useState, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskFilters from './TaskFilters';
import TaskTile from './TaskTile';
import './Tasks.css';

function TasksView() {
  const { tasks, loading, error, selectTask } = useTasks();
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    subsubcategory: '',
    search: ''
  });

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Hide already selected tasks completely
      if (task.is_selected) {
        return false;
      }

      // Filter by category
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      // Filter by subcategory
      if (filters.subcategory && task.subcategory !== filters.subcategory) {
        return false;
      }

      // Filter by subsubcategory
      if (filters.subsubcategory && task.subsubcategory !== filters.subsubcategory) {
        return false;
      }

      // Filter by search term (search in category, subcategory, and description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesCategory = task.category?.toLowerCase().includes(searchLower);
        const matchesSubcategory = task.subcategory?.toLowerCase().includes(searchLower);
        const matchesSubsubcategory = task.subsubcategory?.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        
        if (!matchesCategory && !matchesSubcategory && !matchesSubsubcategory && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // Count total available and claimed tasks (before filtering)
  const totalAvailable = tasks.filter(t => !t.is_selected).length;
  const totalClaimed = tasks.filter(t => t.is_selected).length;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="tasks-view">
        <div className="tasks-header">
          <h1>Task Inspiration</h1>
          <p>Browse and select tasks to work on</p>
        </div>
        <div className="tasks-loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-view">
        <div className="tasks-header">
          <h1>Task Inspiration</h1>
          <p>Browse and select tasks to work on</p>
        </div>
        <div className="tasks-error">
          <p>Error loading tasks: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-view">
      <div className="tasks-header">
        <h1>Task Inspiration</h1>
        <p>Browse from {tasks.length} terminal-bench style task prompts</p>
        <div className="tasks-stats">
          <span className="stat">
            <strong>{totalAvailable}</strong> available
          </span>
          <span className="stat-separator">•</span>
          <span className="stat">
            <strong>{totalClaimed}</strong> claimed
          </span>
        </div>
      </div>

      <TaskFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        tasks={tasks}
      />

      <div className="tasks-results">
        <p className="results-count">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </p>

        {filteredTasks.length === 0 ? (
          <div className="tasks-empty">
            <p>No tasks match your current filters.</p>
            <button onClick={() => handleFilterChange({ category: '', subcategory: '', subsubcategory: '', search: '' })}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskTile
                key={task.id}
                task={task}
                isSelected={task.is_selected}
                isMine={false}
                onSelect={selectTask}
                onUnselect={() => {}}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksView;
