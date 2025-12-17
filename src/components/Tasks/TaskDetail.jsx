import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLoadingMessage } from '../../hooks/useLoadingMessage';
import { TASK_DETAIL_LOADING_MESSAGES } from '../../utils/loadingMessages';
import { Button, Badge, LoadingState } from '../ui';
import './TaskDetail.css';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [error, setError] = useState(null);
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(TASK_DETAIL_LOADING_MESSAGES, 2200);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch task details - only the columns we need to reduce egress
      const { data: taskData, error: taskError } = await supabase
        .from('task_inspiration')
        .select('id, category, subcategory, subsubcategory, title, description, difficulty, tags')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;
      setTask(taskData);

      // Check if already claimed by user
      if (user) {
        const { data: selectedData, error: selectedError } = await supabase
          .from('selected_tasks')
          .select('id')
          .eq('user_id', user.id)
          .eq('task_id', taskId)
          .maybeSingle();

        if (selectedError) console.error('Error checking selection:', selectedError);
        if (selectedData) setIsClaimed(true);
      }

    } catch (err) {
      console.error('Error loading task:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTask = async () => {
    if (!user) return;
    
    try {
      setClaiming(true);
      
      const { error } = await supabase
        .from('selected_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          setIsClaimed(true);
          alert('You have already claimed this task.');
        } else {
          throw error;
        }
      } else {
        setIsClaimed(true);
        // Optional: navigate to "My Tasks" or show success
        if (window.confirm('Task claimed successfully! Would you like to view your tasks?')) {
          navigate('/portal/my-tasks');
        }
      }
    } catch (err) {
      console.error('Error claiming task:', err);
      alert('Failed to claim task: ' + err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="task-detail-loading">
        <LoadingState size="lg" message={loadingMessage} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-error">
        <h2>Task not found</h2>
        <p>{error || "The requested task could not be loaded."}</p>
        <Button variant="secondary" onClick={() => navigate('/portal/tasks')}>Back to Gallery</Button>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <Button variant="ghost" size="sm" className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div className="task-detail-card">
        <div className="task-detail-header">
          <div className="task-meta-top">
            <span className="task-category">{task.category}</span>
            {task.subcategory && <span className="task-subcategory"> / {task.subcategory}</span>}
          </div>
          <h1>{task.subcategory || task.subsubcategory || 'Engineering Task'}</h1>
          
          <div className="task-meta-badges">
            {task.difficulty && (
              <Badge variant={task.difficulty} size="lg">
                {task.difficulty.toUpperCase()}
              </Badge>
            )}
            {task.tags && task.tags.map(tag => (
              <Badge key={tag} variant="tag" size="lg">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="task-detail-body">
          <section className="detail-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </section>

          {/* Placeholder for more details if we had them in the schema, e.g. requirements, acceptance criteria */}
        </div>

        <div className="task-detail-actions">
          {isClaimed ? (
            <Button variant="primary" size="lg" disabled className="claim-btn claimed">
              ✓ Task Claimed
            </Button>
          ) : (
            <Button 
              variant="primary"
              size="lg"
              className="claim-btn"
              onClick={handleClaimTask}
              loading={claiming}
            >
              Claim This Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;


