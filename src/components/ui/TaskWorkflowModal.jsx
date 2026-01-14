import { useState } from 'react';
import { useMySelectedTasks, TASK_STATUS, TASK_STATUS_LABELS, MAX_ACTIVE_TASKS } from '../../hooks/useTasks';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { Note } from './Note';
import { DifficultyRating } from './TaskCard';
import { FiCopy, FiCheck } from 'react-icons/fi';
import './TaskDetailModal.css';

/**
 * TaskWorkflowModal - Modal for managing tasks the user has already claimed
 * Shows workflow actions like "Start Working", "Submit for Review", etc.
 * 
 * @param {Object} task - The claimed task to display
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal closes
 * @param {function} onTaskUpdate - Optional callback after task status changes
 */
export function TaskWorkflowModal({ 
  task, 
  isOpen, 
  onClose,
  onTaskUpdate
}) {
  const { 
    unselectTask, 
    startTask, 
    submitForReview, 
    acceptTask, 
    reopenTask,
    canClaimMore 
  } = useMySelectedTasks();
  const [isActioning, setIsActioning] = useState(false);
  const [localTask, setLocalTask] = useState(null);
  const [copiedTaskId, setCopiedTaskId] = useState(false);

  // Handle copying task ID to clipboard
  const handleCopyTaskId = async () => {
    if (!displayTask?.id) return;
    
    try {
      await navigator.clipboard.writeText(displayTask.id);
      setCopiedTaskId(true);
      setTimeout(() => setCopiedTaskId(false), 2000);
    } catch (err) {
      console.error('Failed to copy task ID:', err);
    }
  };

  // Use localTask if available (for optimistic updates), otherwise use prop
  const displayTask = localTask?.id === task?.id ? localTask : task;

  const handleClose = () => {
    setLocalTask(null);
    setCopiedTaskId(false);
    onClose?.();
  };

  const handleStartWorking = async () => {
    if (!displayTask || isActioning) return;
    
    setIsActioning(true);
    try {
      await startTask(displayTask.id);
      handleClose();
      onTaskUpdate?.({ 
        ...displayTask, 
        status: TASK_STATUS.IN_PROGRESS,
        started_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error starting task:', err);
      alert(err.message);
    } finally {
      setIsActioning(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!displayTask || isActioning) return;
    
    setIsActioning(true);
    try {
      await submitForReview(displayTask.id);
      handleClose();
      onTaskUpdate?.({ ...displayTask, status: TASK_STATUS.WAITING_REVIEW });
    } catch (err) {
      console.error('Error submitting task for review:', err);
      alert(err.message);
    } finally {
      setIsActioning(false);
    }
  };

  const handleAccept = async () => {
    if (!displayTask || isActioning) return;
    
    setIsActioning(true);
    try {
      await acceptTask(displayTask.id);
      handleClose();
      onTaskUpdate?.({ 
        ...displayTask, 
        status: TASK_STATUS.ACCEPTED,
        completed_at: new Date().toISOString() 
      });
    } catch (err) {
      console.error('Error accepting task:', err);
      alert(err.message);
    } finally {
      setIsActioning(false);
    }
  };

  const handleReopen = async () => {
    if (!displayTask || isActioning) return;
    
    setIsActioning(true);
    try {
      await reopenTask(displayTask.id);
      handleClose();
      onTaskUpdate?.({ ...displayTask, status: TASK_STATUS.IN_PROGRESS });
    } catch (err) {
      console.error('Error reopening task:', err);
      alert(err.message);
    } finally {
      setIsActioning(false);
    }
  };

  const handleAbandon = async () => {
    if (!displayTask || isActioning) return;
    if (!window.confirm('Are you sure you want to abandon this task?')) return;
    
    setIsActioning(true);
    try {
      await unselectTask(displayTask.id);
      handleClose();
    } catch (err) {
      console.error('Error abandoning task:', err);
    } finally {
      setIsActioning(false);
    }
  };

  if (!displayTask) return null;

  const taskStatus = displayTask.status;
  const isTaskActive = taskStatus === TASK_STATUS.CLAIMED || taskStatus === TASK_STATUS.IN_PROGRESS;
  const isTaskInReview = taskStatus === TASK_STATUS.WAITING_REVIEW;
  const isTaskAccepted = taskStatus === TASK_STATUS.ACCEPTED;

  // Show Task ID for any claimed/in-progress/review/accepted task
  const shouldShowTaskId = isTaskActive || isTaskInReview || isTaskAccepted;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      className="task-detail-modal"
    >
      <>
        {/* Corner ribbon for accepted tasks only */}
        {isTaskAccepted && (
          <div className="modal-ribbon">
            <span>Marked as Accepted</span>
          </div>
        )}
        
        <div className="task-detail-modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <div className="modal-badges" style={{ alignItems: 'center' }}>
                <div className="task-breadcrumb">
                  <span className="breadcrumb-segment parent">{displayTask.category}</span>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-segment current">
                    {displayTask.subcategory || displayTask.subsubcategory}
                  </span>
                </div>
                {displayTask.difficulty && (
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                    <DifficultyRating difficulty={displayTask.difficulty} />
                  </div>
                )}
              </div>
              
              <h2>Your challenge</h2>
            </div>
            {/* Top right status badge */}
            {taskStatus === TASK_STATUS.IN_PROGRESS && (
              <Badge variant="info" style={{ flexShrink: 0 }}>
                In Progress
              </Badge>
            )}
            {isTaskInReview && (
              <Badge variant="warning" style={{ flexShrink: 0 }}>
                Waiting on Review
              </Badge>
            )}
          </div>
        </div>
        
        <div className="task-detail-modal-body">
          <p>{displayTask.description}</p>
          
          {/* Timeline info */}
          <div className="modal-timeline-info" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            {displayTask.selected_at && (
              <div>Claimed on {new Date(displayTask.selected_at).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}</div>
            )}
            {displayTask.started_at && (
              <div>Started on {new Date(displayTask.started_at).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}</div>
            )}
            {displayTask.submitted_for_review_at && (
              <div>Submitted for review on {new Date(displayTask.submitted_for_review_at).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}</div>
            )}
            {isTaskAccepted && displayTask.completed_at && (
              <div>🎉 You marked this as accepted on {new Date(displayTask.completed_at).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}</div>
            )}
          </div>
          
          {/* Task ID section - removed as moved to header */}
          
          {/* Note for tasks in review */}
          {isTaskInReview && (
            <Note title="Important" variant="info" className="modal-note">
              Only mark as accepted once confirmed on the Snorkel Expert platform.
            </Note>
          )}
        </div>

        <div className="task-detail-modal-footer">
          {/* Footer Info (Double Pay + Task ID) */}
          <div className="modal-footer-info">
            {(displayTask.is_special || displayTask.priority_tag || displayTask.is_highlighted) && (
              <Badge variant="accent">Double Pay</Badge>
            )}
            
            {shouldShowTaskId && displayTask.id && (
              <div 
                className={`footer-task-id ${copiedTaskId ? 'copied' : ''}`}
                onClick={handleCopyTaskId}
                role="button"
                title="Click to copy Task ID"
              >
                <code className="id-value">#{displayTask.id}</code>
                <span className="id-icon">
                  {copiedTaskId ? <FiCheck size={12} /> : <FiCopy size={12} />}
                </span>
                <span className="id-tooltip">{copiedTaskId ? 'Copied!' : 'Copy ID'}</span>
              </div>
            )}
          </div>
          
          {/* Abandon button - only show for active tasks (claimed or in_progress) */}
          {isTaskActive && (
            <Button 
              variant="danger" 
              onClick={handleAbandon}
              disabled={isActioning}
              className="modal-abandon-btn"
            >
              Abandon Task
            </Button>
          )}

          {/* Workflow action buttons based on current status */}
          {taskStatus === TASK_STATUS.CLAIMED && (
            <Button 
              variant="primary" 
              onClick={handleStartWorking}
              loading={isActioning}
            >
              Started working on this task
            </Button>
          )}
          
          {taskStatus === TASK_STATUS.IN_PROGRESS && (
            <Button 
              variant="primary" 
              onClick={handleSubmitForReview}
              loading={isActioning}
            >
              Submitted for review
            </Button>
          )}
          
          {isTaskInReview && (
            <Button 
              variant="primary" 
              onClick={handleAccept}
              loading={isActioning}
            >
              Mark as Accepted
            </Button>
          )}
          
          {/* Go back button for tasks in review */}
          {isTaskInReview && (
            <Button 
              variant="secondary" 
              onClick={handleReopen}
              loading={isActioning}
              disabled={!canClaimMore}
              title={!canClaimMore ? `You have ${MAX_ACTIVE_TASKS} active tasks. Submit or complete some first.` : ''}
            >
              Go back to working on it
            </Button>
          )}
          
          {/* Re-open button for accepted tasks */}
          {isTaskAccepted && (
            <Button 
              variant="secondary" 
              onClick={handleReopen}
              loading={isActioning}
              disabled={!canClaimMore}
              title={!canClaimMore ? `You have ${MAX_ACTIVE_TASKS} active tasks. Submit or complete some first.` : ''}
            >
              Re-open Task
            </Button>
          )}
        </div>
      </>
    </Modal>
  );
}

export default TaskWorkflowModal;
