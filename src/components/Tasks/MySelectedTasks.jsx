import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMySelectedTasks } from '../../hooks/useTasks';
import { Button, LoadingState, Modal, Badge, TaskCard, DifficultyRating, Tabs, Tab } from '../ui';
import './Tasks.css';

function MySelectedTasks() {
  const navigate = useNavigate();
  const { selectedTasks, loading, error, unselectTask, completeTask, uncompleteTask } = useMySelectedTasks();
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [isActioning, setIsActioning] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const activeTasks = selectedTasks.filter(t => !t.completed_at);
  const completedTasks = selectedTasks.filter(t => t.completed_at);

  const handleOpenModal = (task) => {
    setSelectedTaskForModal(task);
  };

  const handleCloseModal = () => {
    setSelectedTaskForModal(null);
  };

  const handleComplete = async () => {
    if (!selectedTaskForModal || isActioning) return;
    
    setIsActioning(true);
    try {
      await completeTask(selectedTaskForModal.id);
      // Update the modal state to reflect completion
      setSelectedTaskForModal(prev => prev ? { ...prev, completed_at: new Date().toISOString() } : null);
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleUncomplete = async () => {
    if (!selectedTaskForModal || isActioning) return;
    
    setIsActioning(true);
    try {
      await uncompleteTask(selectedTaskForModal.id);
      // Update the modal state to reflect uncomplete
      setSelectedTaskForModal(prev => prev ? { ...prev, completed_at: null } : null);
    } catch (err) {
      console.error('Error uncompleting task:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleAbandon = async () => {
    if (!selectedTaskForModal || isActioning) return;
    if (!window.confirm('Are you sure you want to abandon this challenge?')) return;
    
    setIsActioning(true);
    try {
      await unselectTask(selectedTaskForModal.id);
      handleCloseModal();
    } catch (err) {
      console.error('Error abandoning task:', err);
    } finally {
      setIsActioning(false);
    }
  };

  if (loading) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Challenges</h1>
          <p>Track your progress and complete challenges</p>
        </div>
        <div className="tasks-loading">
          <LoadingState size="lg" message="Loading your challenges..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Challenges</h1>
          <p>Track your progress and complete challenges</p>
        </div>
        <div className="tasks-error">
          <p>Error loading your tasks: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const isModalTaskCompleted = selectedTaskForModal?.completed_at;
  const currentTasks = activeTab === 'active' ? activeTasks : completedTasks;

  return (
    <div className="tasks-view my-tasks-view">
      <div className="tasks-header">
        <h1>My Challenges</h1>
        <p>Track your progress and complete challenges.</p>
      </div>

      {selectedTasks.length === 0 ? (
        <div className="tasks-empty">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3>No challenges yet</h3>
          <p>Browse the task gallery and claim challenges to get started.</p>
          <Button variant="primary" onClick={() => navigate('/portal/tasks')}>
            Browse Tasks
          </Button>
        </div>
      ) : (
        <div className="gallery-content" style={{ marginTop: 'var(--space-6)' }}>
          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="active">
              Active Tasks
              {activeTasks.length > 0 && (
                <span className="tab-count">{activeTasks.length}</span>
              )}
            </Tab>
            <Tab value="completed">
              Accepted
              {completedTasks.length > 0 && (
                <span className="tab-count">{completedTasks.length}</span>
              )}
            </Tab>
          </Tabs>

          {/* Tab Content */}
          <div className="my-tasks-tab-content">
            {currentTasks.length === 0 ? (
              <div className="tasks-empty-tab">
                {activeTab === 'active' ? (
                  <>
                    <p>No active challenges. All done! 🎉</p>
                    <Button variant="secondary" onClick={() => navigate('/portal/tasks')}>
                      Find More Challenges
                    </Button>
                  </>
                ) : (
                  <p>No accepted challenges yet. Keep going!</p>
                )}
              </div>
            ) : (
              <div className="my-tasks-grid">
                {currentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={activeTab === 'completed'}
                    isHighlighted={task.is_highlighted}
                    claimedAt={task.selected_at}
                    completedAt={task.completed_at}
                    onClick={() => handleOpenModal(task)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTaskForModal}
        onClose={handleCloseModal}
        size="lg"
        className="task-detail-modal"
      >
        {selectedTaskForModal && (
          <>
            {/* Corner ribbon for accepted tasks */}
            {isModalTaskCompleted && (
              <div className="modal-ribbon">
                <span>Accepted</span>
              </div>
            )}
            
            <div className="task-detail-modal-header">
              <div>
                <div className="modal-badges" style={{ alignItems: 'center' }}>
                  <div className="task-breadcrumb">
                    <span className="breadcrumb-segment parent">{selectedTaskForModal.category}</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-segment current">
                      {selectedTaskForModal.subcategory || selectedTaskForModal.subsubcategory}
                    </span>
                  </div>
                  {selectedTaskForModal.difficulty && (
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                      <DifficultyRating difficulty={selectedTaskForModal.difficulty} />
                    </div>
                  )}
                </div>
                <h2>Your challenge</h2>
              </div>
            </div>
            
            <div className="task-detail-modal-body">
              <p>{selectedTaskForModal.description}</p>
              
              {/* Show accepted date for completed tasks */}
              {isModalTaskCompleted && selectedTaskForModal.completed_at && (
                <div className="modal-accepted-info">
                  <span>🎉</span>
                  <span>Accepted on {new Date(selectedTaskForModal.completed_at).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}</span>
                </div>
              )}
            </div>

            <div className="task-detail-modal-footer">
              {/* Double Pay badge if applicable */}
              {(selectedTaskForModal.is_special || selectedTaskForModal.priority_tag || selectedTaskForModal.is_highlighted) && (
                <div style={{ marginRight: 'auto' }}>
                  <Badge variant="accent">Double Pay</Badge>
                </div>
              )}
              
              {/* Abandon button - only show for active tasks */}
              {!isModalTaskCompleted && (
                <Button 
                  variant="danger" 
                  onClick={handleAbandon}
                  disabled={isActioning}
                >
                  Abandon Task
                </Button>
              )}

              {/* Complete / Mark Active button */}
              {isModalTaskCompleted ? (
                <Button 
                  variant="secondary" 
                  onClick={handleUncomplete}
                  loading={isActioning}
                >
                  Re-open Task
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleComplete}
                  loading={isActioning}
                >
                  Mark as Accepted
                </Button>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default MySelectedTasks;
