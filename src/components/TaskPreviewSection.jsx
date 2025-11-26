import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Badge, CornerBadge } from './ui';
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
        // Initial random selection without animation
        shuffleTasks(data, false);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleTasks = (pool = tasks, animate = true) => {
    if (!pool.length) return;
    
    if (animate) {
      setIsShuffling(true);
      
      // Wait for staggered exit animation (6 items * 100ms delay + 400ms duration = ~1000ms)
      setTimeout(() => {
        performShuffle(pool);
        setIsShuffling(false);
      }, 1000);
    } else {
      performShuffle(pool);
    }
  };

  const performShuffle = (pool) => {
    // Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Select first 6
    setDisplayTasks(shuffled.slice(0, 6));
  };

  const handleTaskClick = (taskId) => {
    navigate(`/portal/task/${taskId}`);
  };

  return (
    <section className="task-preview-section">
      <div className="task-preview-header">
        <h2>These are just a few of the 1000+ tasks that await you...</h2>
        <p>Here are some tasks you can pick from (or just explore what's possible)</p>
      </div>

      <div className="task-preview-grid">
        {loading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="task-preview-card skeleton"></div>
          ))
        ) : (
          // Use index as key to keep DOM elements stable for content swap animation
          displayTasks.map((task, index) => (
            <div 
              key={index} 
              className={`task-preview-card ${isShuffling ? 'shuffling' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-preview-card-inner">
                {task.is_special && (
                  <CornerBadge>2x</CornerBadge>
                )}
                <div className="task-preview-card-header">
                  <div className="header-badges">
                    <Badge variant="category">{task.category}</Badge>
                  </div>
                </div>
                
                <div className="task-preview-divider"></div>
                
                <div className="task-preview-body">
                  <div className="task-header-row">
                    <h3>{task.subcategory || task.subsubcategory || 'Engineering Task'}</h3>
                  </div>
                  <p>{task.description}</p>
                  
                  <div className="task-card-footer">
                    <Badge variant={task.difficulty?.toLowerCase() || 'medium'} size="sm">
                      {task.difficulty || 'Medium'}
                    </Badge>
                    <button 
                      className="learn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task.id);
                      }}
                    >
                      <span className="learn-text">Learn more</span> <span className="learn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="task-preview-footer">
        <Button 
          variant="primary"
          size="lg"
          onClick={() => navigate('/portal/tasks')}
        >
          Browse Task Gallery →
        </Button>
      </div>
    </section>
  );
};

export default TaskPreviewSection;
