import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './TaskPreviewSection.css';

const TaskPreviewSection = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Fetch a pool of tasks to shuffle from
      const { data, error } = await supabase
        .from('task_inspiration')
        .select('*')
        .limit(100);

      if (error) throw error;

      if (data) {
        setTasks(data);
        shuffleTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleTasks = (pool = tasks) => {
    if (!pool.length) return;
    
    setIsShuffling(true);
    
    // Wait for exit animation
    setTimeout(() => {
      // Fisher-Yates shuffle
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Select first 6
      setDisplayTasks(shuffled.slice(0, 6));
      setIsShuffling(false);
    }, 300);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/portal/task/${taskId}`);
  };

  return (
    <section className="task-preview-section">
      <div className="task-preview-header">
        <h2>These are a few of the tasks that await you...</h2>
        <p>Here are some tasks you can pick from (or just explore what's possible)</p>
      </div>

      <div className="task-controls">
        <button 
          className={`shuffle-btn ${isShuffling ? 'shuffling' : ''}`} 
          onClick={() => shuffleTasks()}
          disabled={isShuffling || loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l14.2-12.6c.8-1.1 2-1.7 3.3-1.7H22"/>
            <path d="M2 6h1.4c1.3 0 2.5.6 3.3 1.7l14.2 12.6c.8 1.1 2 1.7 3.3 1.7H22"/>
          </svg>
          Shuffle Tasks
        </button>
      </div>

      <div className="task-preview-grid">
        {loading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="task-preview-card skeleton"></div>
          ))
        ) : (
          displayTasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`task-preview-card ${isShuffling ? 'exit' : 'enter'}`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-preview-card-header">
                <span className="category-badge">{task.category}</span>
              </div>
              
              <div className="task-preview-divider"></div>
              
              <div className="task-preview-body">
                <h3>{task.subcategory || task.subsubcategory || 'Engineering Task'}</h3>
                <p>{task.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="task-preview-footer">
        <button 
          className="browse-gallery-btn"
          onClick={() => navigate('/portal/tasks')}
        >
          Browse Task Gallery →
        </button>
      </div>
    </section>
  );
};

export default TaskPreviewSection;
