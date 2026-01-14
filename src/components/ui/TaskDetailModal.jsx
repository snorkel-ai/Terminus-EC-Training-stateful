import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { useMySelectedTasks, MAX_ACTIVE_TASKS } from '../../hooks/useTasks';
import { supabase } from '../../lib/supabase';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { DifficultyRating } from './TaskCard';
import './TaskDetailModal.css';

/**
 * TaskDetailModal - Reusable modal for viewing task details and claiming tasks
 * 
 * @param {Object} task - The task to display
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal closes
 * @param {Array} contextTasks - Optional array of tasks for navigation (prev/next)
 * @param {function} onNavigate - Optional callback when navigating to another task
 * @param {boolean} showNavigation - Whether to show prev/next navigation arrows
 */
export function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onTaskUpdate,
  contextTasks = [],
  onNavigate,
  showNavigation = false 
}) {
  const navigate = useNavigate();
  const posthog = usePostHog();
  // Use useMySelectedTasks for all task operations - avoids loading all 1600+ tasks
  const { selectTask, unselectTask, activeTaskCount, canClaimMore } = useMySelectedTasks();
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const confettiContainerRef = useRef(null);
  
  // Lazy-load description when modal opens (to reduce initial task list egress)
  const [description, setDescription] = useState(task?.description || null);
  const [loadingDescription, setLoadingDescription] = useState(false);
  
  // Fetch description on demand when modal opens
  useEffect(() => {
    if (!isOpen || !task?.id) return;
    
    // If task already has description (from cache or other source), use it
    if (task.description) {
      setDescription(task.description);
      return;
    }
    
    // Fetch description (and title if needed) from database
    const fetchDescription = async () => {
      setLoadingDescription(true);
      try {
        const { data, error } = await supabase
          .from('task_inspiration')
          .select('description, title')
          .eq('id', task.id)
          .single();
        
        if (error) throw error;
        setDescription(data?.description || 'No description available.');
        // Update task title in parent if it was missing
        if (data?.title && !task.title) {
          task.title = data.title;
        }
      } catch (err) {
        console.error('Error fetching task description:', err);
        setDescription('Failed to load description.');
      } finally {
        setLoadingDescription(false);
      }
    };
    
    fetchDescription();
  }, [isOpen, task?.id, task?.description]);
  
  // Reset description when task changes
  useEffect(() => {
    setDescription(task?.description || null);
  }, [task?.id]);

  // Track when task card is opened
  useEffect(() => {
    if (isOpen && task && posthog) {
      posthog.capture('task_card_viewed', {
        task_id: task.id,
        task_category: task.category,
        task_subcategory: task.subcategory,
        task_difficulty: task.difficulty,
        is_special: task.is_special || task.priority_tag || task.is_highlighted,
      });
    }
  }, [isOpen, task?.id, posthog]);

  // Reset success state when task changes or modal closes
  useEffect(() => {
    if (!isOpen || !task) {
      setShowClaimSuccess(false);
    }
  }, [isOpen, task?.id]);

  // Generate confetti on success
  useEffect(() => {
    if (!showClaimSuccess || !confettiContainerRef.current) return;

    const container = confettiContainerRef.current;
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.setProperty('--x', `${Math.random() * 100 - 50}vw`);
      confetti.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${1 + Math.random() * 1}s`;
      container.appendChild(confetti);
    }

    const timeout = setTimeout(() => {
      container.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showClaimSuccess]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !showNavigation || showClaimSuccess) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handleNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        handleNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, task, contextTasks, showClaimSuccess, showNavigation]);

  const handleClose = () => {
    setShowClaimSuccess(false);
    onClose?.();
  };

  const handleClaimTask = async () => {
    if (!task || isSelecting) return;

    setIsSelecting(true);
    try {
      // Pass task metadata for analytics tracking
      await selectTask(task.id, {
        category: task.category,
        subcategory: task.subcategory,
      });
      setShowClaimSuccess(true);
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error claiming task:', error);
      alert(error.message || 'Failed to claim task. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  const handleReleaseTask = async () => {
    if (!task) return;

    if (window.confirm('Are you sure you want to release this task?')) {
      try {
        await unselectTask(task.id);
        onTaskUpdate?.();
        handleClose();
      } catch (error) {
        console.error('Error releasing task:', error);
      }
    }
  };

  const handleNavigate = (direction) => {
    if (!task || contextTasks.length === 0) return;

    const currentIndex = contextTasks.findIndex(t => t.id === task.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex < contextTasks.length) {
        onNavigate?.(contextTasks[nextIndex]);
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex >= 0) {
        onNavigate?.(contextTasks[nextIndex]);
      }
    }
  };

  // Navigation state
  const currentIndex = task && contextTasks.length > 0
    ? contextTasks.findIndex(t => t.id === task.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < contextTasks.length - 1;

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      className="task-detail-modal"
    >
      {showClaimSuccess ? (
        // Success state after claiming
        <div className="task-claim-success" ref={confettiContainerRef}>
          <div className="success-icon-wrapper">
            <div className="success-icon">✓</div>
          </div>
          
          <h2>Task Claimed!</h2>
          <p>This task has been added to your list.</p>

          <div className="success-actions-stack">
            <Button variant="primary" onClick={handleClose} style={{ width: '100%' }}>
              Continue Browsing
            </Button>
            <Button variant="secondary" onClick={() => { handleClose(); navigate('/portal/my-tasks'); }} style={{ width: '100%' }}>
              Go to My Tasks
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleReleaseTask} 
              style={{ color: '#dc2626', width: '100%' }}
            >
              Give task back
            </Button>
          </div>
        </div>
      ) : (
        // Task detail view
        <>
          <div className="task-detail-modal-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="modal-badges" style={{ alignItems: 'center' }}>
                  <div className="task-breadcrumb">
                    <span className="breadcrumb-segment parent">{task.category}</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-segment current">
                      {task.subcategory || task.subsubcategory}
                    </span>
                  </div>

                  {task.difficulty && (
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                      <DifficultyRating difficulty={task.difficulty} />
                    </div>
                  )}
                </div>
                <h2>{task.title || 'Your challenge'}</h2>
              </div>

              {showNavigation && contextTasks.length > 1 && (
                <div className="modal-navigation" style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="modal-nav-btn"
                    onClick={() => handleNavigate('prev')}
                    disabled={!hasPrev}
                    title="Previous Task (Left Arrow)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button 
                    className="modal-nav-btn"
                    onClick={() => handleNavigate('next')}
                    disabled={!hasNext}
                    title="Next Task (Right Arrow)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="task-detail-modal-body">
            {loadingDescription ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Loading description...</p>
            ) : (
              <p>{description || 'No description available.'}</p>
            )}
          </div>

          <div className="task-detail-modal-footer">
            {/* Info row: badges and claim limit */}
            <div className="modal-footer-info">
              {(task.is_special || task.priority_tag || task.is_highlighted) && (
                <Badge variant="accent">Double Pay</Badge>
              )}
              <span className="active-task-count">
                Your Active Tasks: <strong style={{ color: canClaimMore ? 'var(--text-primary)' : 'var(--color-warning)' }}>
                  {activeTaskCount}/{MAX_ACTIVE_TASKS}
                </strong>
              </span>
            </div>
            
            {/* Button row */}
            <div className="footer-buttons">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                disabled={isSelecting}
                className="modal-cancel-btn"
              >
                Cancel
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  handleClose();
                  navigate('/portal/tasks');
                }}
                disabled={isSelecting}
              >
                Browse Tasks
              </Button>
              <Button 
                variant="primary" 
                onClick={handleClaimTask}
                loading={isSelecting}
                disabled={!canClaimMore}
                title={!canClaimMore ? `You can only have ${MAX_ACTIVE_TASKS} active tasks. Submit tasks for review to free up slots.` : ''}
              >
                {canClaimMore ? 'Claim Task' : 'Limit Reached'}
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default TaskDetailModal;

