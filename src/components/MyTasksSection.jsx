import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { useMySelectedTasks, TASK_STATUS, TASK_STATUS_LABELS } from '../hooks/useTasks';
import { Button, Badge, TaskWorkflowModal, EmptyState } from './ui';
import { FiSearch, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './TaskPreviewSection.css'; 
import './MyTasksSection.css';

const ITEMS_PER_PAGE = 10;

const MyTasksSection = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const { selectedTasks, loading, refetch } = useMySelectedTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter for active tasks (Claimed, In Progress, or Waiting Review)
  const activeTasks = selectedTasks.filter(t => 
    t.status === TASK_STATUS.CLAIMED || 
    t.status === TASK_STATUS.IN_PROGRESS ||
    t.status === TASK_STATUS.WAITING_REVIEW
  );

  const handleBrowseTasksClick = (source) => {
    if (posthog) {
      posthog.capture('browse_tasks_clicked', {
        source,
        active_task_count: activeTasks.length
      });
    }
    navigate('/portal/tasks');
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    // Refetch to ensure table is in sync after modal actions
    refetch();
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  // Get the most recent update timestamp for a task
  const getLastUpdated = (task) => {
    const dates = [
      task.started_at,
      task.selected_at,
      task.submitted_for_review_at,
      task.completed_at
    ].filter(Boolean).map(d => new Date(d).getTime());
    return dates.length > 0 ? Math.max(...dates) : 0;
  };

  const processedTasks = useMemo(() => {
    let tasks = [...activeTasks];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      tasks = tasks.filter(task => 
        task.description.toLowerCase().includes(lowerTerm) ||
        task.category.toLowerCase().includes(lowerTerm) ||
        (task.subcategory && task.subcategory.toLowerCase().includes(lowerTerm))
      );
    }

    // Sort
    tasks.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'lastUpdated') {
        aValue = getLastUpdated(a);
        bValue = getLastUpdated(b);
      } else if (sortConfig.key === 'category') {
        aValue = `${a.category} ${a.subcategory || ''}`;
        bValue = `${b.category} ${b.subcategory || ''}`;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return tasks;
  }, [activeTasks, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = processedTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return null; 
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case TASK_STATUS.IN_PROGRESS: return 'info';
      case TASK_STATUS.CLAIMED: return 'secondary';
      case TASK_STATUS.WAITING_REVIEW: return 'success';
      case TASK_STATUS.ACCEPTED: return 'success';
      default: return 'default';
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="sort-icon-placeholder" />;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <section className="task-preview-section my-tasks-section">
      <div className="my-tasks-header-row">
        <div className="header-title-group">
          <h2>My Active Tasks</h2>
          {activeTasks.length > 0 && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/portal/my-tasks')}
              className="view-all-tasks-btn"
            >
              Show all tasks
            </Button>
          )}
        </div>
        <div className="header-actions">
          {activeTasks.length > 0 && (
            <div className="search-input-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="task-search-input"
              />
            </div>
          )}
        </div>
      </div>

      <div className="my-tasks-content">
         {activeTasks.length > 0 ? (
           <>
             <div className="my-tasks-table-container">
               <table className="my-tasks-table">
                 <thead>
                   <tr>
                    <th 
                      className="col-category sortable" 
                      onClick={() => handleSort('category')}
                    >
                      Category <SortIcon columnKey="category" />
                     </th>
                     <th 
                       className="col-description sortable"
                       onClick={() => handleSort('description')}
                     >
                       Description <SortIcon columnKey="description" />
                     </th>
                     <th 
                       className="col-status sortable"
                       onClick={() => handleSort('status')}
                     >
                       Status <SortIcon columnKey="status" />
                     </th>
                     <th 
                       className="col-updated sortable"
                       onClick={() => handleSort('lastUpdated')}
                     >
                       Updated <SortIcon columnKey="lastUpdated" />
                     </th>
                   </tr>
                 </thead>
                 <tbody>
                   {paginatedTasks.length > 0 ? (
                     paginatedTasks.map(task => (
                       <tr key={task.id} onClick={() => handleTaskClick(task)} style={{ cursor: 'pointer' }}>
                        <td>
                          <span className="task-category" title={`${task.category}${task.subcategory ? ' / ' + task.subcategory : ''}`}>
                            {task.subcategory || task.category}
                          </span>
                        </td>
                         <td>
                           <span className="task-description" title={task.description}>
                             {task.description}
                           </span>
                         </td>
                         <td>
                           <Badge variant={getStatusVariant(task.status)}>
                             {TASK_STATUS_LABELS[task.status]}
                           </Badge>
                         </td>
                         <td className="task-date">
                           {new Date(getLastUpdated(task)).toLocaleDateString('en-US', {
                             month: 'short',
                             day: 'numeric',
                           })}
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan="4" className="no-results-cell">
                         No tasks match your search
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination */}
             {totalPages > 1 && (
               <div className="pagination-controls">
                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                 >
                   <FiChevronLeft /> Prev
                 </Button>
                 <span className="pagination-info">
                   Page {currentPage} of {totalPages}
                 </span>
                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages}
                 >
                   Next <FiChevronRight />
                 </Button>
              </div>
            )}
            
            {/* Always show Browse Tasks button when user has tasks */}
            <div className="my-tasks-footer">
              <Button 
                variant="primary"
                size="lg"
                onClick={() => handleBrowseTasksClick('landing_page_footer')}
              >
                Browse tasks →
              </Button>
            </div>
          </>
        ) : (
            <EmptyState
              icon={
                <img 
                  src="/images/empty_tasks.png" 
                  alt="No tasks" 
                  style={{ width: '300px', height: 'auto', opacity: 0.9 }}
                />
              }
              title="No active tasks yet"
              description="Browse the gallery to find and claim your first task!"
              action={
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={() => handleBrowseTasksClick('landing_page_empty_state')}
                >
                  Browse tasks →
                </Button>
              }
            />
          )}
        </div>
      
      {/* Reusable Task Workflow Modal */}
      <TaskWorkflowModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
        onTaskUpdate={() => refetch()}
      />
    </section>
  );
};

export default MyTasksSection;
