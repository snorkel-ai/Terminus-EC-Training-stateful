import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, TaskCard, TaskDetailModal } from './ui';
import './TaskPreviewSection.css';

// Number of task cards to display
const DISPLAY_COUNT = 6;

const TaskPreviewSection = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
    setDisplayTasks(shuffled.slice(0, DISPLAY_COUNT));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  return (
    <section className="task-preview-section">
      <div className="task-preview-header">
        <h2>Get Inspired</h2>
        <p>Here are some of the 1000+ tasks you can pick from (or just explore what's possible)</p>
      </div>

      <div className="task-preview-grid">
        {loading ? (
          // Loading skeletons
          Array(DISPLAY_COUNT).fill(0).map((_, i) => (
            <div key={i} className="task-preview-card skeleton"></div>
          ))
        ) : (
          displayTasks.map((task, index) => (
            <div 
              key={index}
              className={`task-preview-card-wrapper ${isShuffling ? 'shuffling' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <TaskCard
                task={task}
                onClick={() => handleTaskClick(task)}
              />
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

      {/* Task Detail Modal - uses design system component */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default TaskPreviewSection;
