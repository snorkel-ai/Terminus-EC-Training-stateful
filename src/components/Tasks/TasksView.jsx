import { useState, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Button, LoadingState, Modal, Badge } from '../ui';
import TaskFilters from './TaskFilters';
import TaskTile from './TaskTile';
import { TaskClaimSuccess } from './TaskClaimSuccess';
import './Tasks.css';

function TasksView() {
  const { tasks, loading, error, selectTask } = useTasks();
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    subsubcategory: '',
    search: ''
  });
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

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

  const handleViewDetails = (task) => {
    setSelectedTaskForModal(task);
    setShowClaimSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedTaskForModal(null);
    setShowClaimSuccess(false);
  };

  const handleSelectFromModal = async () => {
    if (!selectedTaskForModal || isSelecting) return;
    
    setIsSelecting(true);
    try {
      await selectTask(selectedTaskForModal.id);
      setShowClaimSuccess(true);
    } catch (error) {
      console.error('Error selecting task:', error);
      // Error is handled by useTasks usually, but we could show an alert here
    } finally {
      setIsSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="tasks-view">
        <div className="tasks-header">
          <h1>Task Inspiration</h1>
          <p>Browse and select tasks to work on</p>
        </div>
        <div className="tasks-loading">
          <LoadingState size="lg" message="Loading tasks..." />
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
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
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
            <Button variant="secondary" onClick={() => handleFilterChange({ category: '', subcategory: '', subsubcategory: '', search: '' })}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskTile
                key={task.id}
                task={task}
                isSelected={task.is_selected}
                isMine={false}
                onSelect={() => handleViewDetails(task)}
                onUnselect={() => {}}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTaskForModal}
        onClose={handleCloseModal}
        size="lg"
        className="task-detail-modal"
      >
        {selectedTaskForModal && (
          showClaimSuccess ? (
            <TaskClaimSuccess task={selectedTaskForModal} onClose={handleCloseModal} />
          ) : (
            <>
              <div className="task-detail-modal-header">
                <div className="modal-badges">
                  {selectedTaskForModal.is_highlighted && (
                    <Badge variant="priority" size="sm">Priority</Badge>
                  )}
                  <Badge variant="category" size="sm">{selectedTaskForModal.category}</Badge>
                  {selectedTaskForModal.difficulty && (
                    <Badge variant={selectedTaskForModal.difficulty.toLowerCase()} size="sm">
                      {selectedTaskForModal.difficulty}
                    </Badge>
                  )}
                </div>
                <h2>{selectedTaskForModal.subcategory || selectedTaskForModal.subsubcategory || 'Engineering Task'}</h2>
              </div>
              
              <div className="task-detail-modal-body">
                <p>{selectedTaskForModal.description}</p>
                {/* Add more details if available in the task object */}
              </div>

              <div className="task-detail-modal-footer">
                {(selectedTaskForModal.is_special || selectedTaskForModal.priority_tag) && (
                  <div style={{ marginRight: 'auto' }}>
                    <Badge variant="accent">Double Pay</Badge>
                  </div>
                )}
                <Button 
                  variant="secondary" 
                  onClick={handleCloseModal}
                  disabled={isSelecting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSelectFromModal}
                  loading={isSelecting}
                >
                  Select Task
                </Button>
              </div>
            </>
          )
        )}
      </Modal>
    </div>
  );
}

export default TasksView;
