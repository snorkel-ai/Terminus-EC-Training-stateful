import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
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

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch task details
      const { data: taskData, error: taskError } = await supabase
        .from('task_inspiration')
        .select('*')
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
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-error">
        <h2>Task not found</h2>
        <p>{error || "The requested task could not be loaded."}</p>
        <button onClick={() => navigate('/portal/tasks')}>Back to Gallery</button>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="task-detail-card">
        <div className="task-detail-header">
          <div className="task-meta-top">
            <span className="task-category">{task.category}</span>
            {task.subcategory && <span className="task-subcategory"> / {task.subcategory}</span>}
          </div>
          <h1>{task.subcategory || task.subsubcategory || 'Engineering Task'}</h1>
          
          <div className="task-meta-badges">
            {task.difficulty && (
              <span className={`meta-badge difficulty ${task.difficulty}`}>
                {task.difficulty.toUpperCase()}
              </span>
            )}
            {task.tags && task.tags.map(tag => (
              <span key={tag} className="meta-badge tag">{tag}</span>
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
            <button className="claim-btn claimed" disabled>
              ✓ Task Claimed
            </button>
          ) : (
            <button 
              className="claim-btn" 
              onClick={handleClaimTask}
              disabled={claiming}
            >
              {claiming ? 'Claiming...' : 'Claim This Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;


