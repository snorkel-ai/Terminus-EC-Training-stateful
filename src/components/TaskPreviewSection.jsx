import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, TaskCard, TaskDetailModal } from './ui';
import './TaskPreviewSection.css';

// Number of task cards to display
const DISPLAY_COUNT = 6;

// Generate random flight paths for cards
const generateFlightPath = (index) => {
  const directions = [
    { x: -150, y: -200, rotate: -25 },  // top-left
    { x: 0, y: -250, rotate: 5 },        // top
    { x: 150, y: -200, rotate: 25 },     // top-right
    { x: -200, y: 0, rotate: -15 },      // left
    { x: 200, y: 0, rotate: 15 },        // right
    { x: -150, y: 200, rotate: -20 },    // bottom-left
    { x: 0, y: 250, rotate: -5 },        // bottom
    { x: 150, y: 200, rotate: 20 },      // bottom-right
  ];
  return directions[index % directions.length];
};

const TaskPreviewSection = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle' | 'exiting' | 'entering'
  const [selectedTask, setSelectedTask] = useState(null);
  const shuffleKeyRef = useRef(0);

  // Generate stable random flight paths for current shuffle
  const flightPaths = useMemo(() => {
    return displayTasks.map((_, index) => generateFlightPath(index));
  }, [shuffleKeyRef.current]);

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
      // Phase 1: Cards fly out
      setAnimationPhase('exiting');
      
      // Phase 2: Swap cards and fly in
      setTimeout(() => {
        shuffleKeyRef.current += 1;
        performShuffle(pool);
        setAnimationPhase('entering');
        
        // Phase 3: Back to idle
        setTimeout(() => {
          setAnimationPhase('idle');
        }, 800);
      }, 700);
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

  const getCardStyle = (index) => {
    const path = flightPaths[index] || generateFlightPath(index);
    const delay = index * 80;
    
    if (animationPhase === 'exiting') {
      return {
        '--flight-x': `${path.x}%`,
        '--flight-y': `${path.y}px`,
        '--flight-rotate': `${path.rotate}deg`,
        '--animation-delay': `${delay}ms`,
      };
    }
    if (animationPhase === 'entering') {
      return {
        '--flight-x': `${-path.x}%`,
        '--flight-y': `${-path.y}px`,
        '--flight-rotate': `${-path.rotate}deg`,
        '--animation-delay': `${delay}ms`,
      };
    }
    return {};
  };

  return (
    <section className="task-preview-section">
      <div className="task-preview-header">
        <h2>Get Inspired</h2>
        <p>Here are some of the 1000+ tasks you can pick from (or just explore what's possible)</p>
      </div>

      {/* Portal area with extra space for flying cards */}
      <div className="task-portal-area">
        {/* Decorative portal glow effect */}
        <div className={`portal-glow ${animationPhase !== 'idle' ? 'active' : ''}`} />
        
        <div className={`task-preview-grid ${animationPhase !== 'idle' ? 'shuffling' : ''}`}>
          {loading ? (
            // Loading skeletons
            Array(DISPLAY_COUNT).fill(0).map((_, i) => (
              <div key={i} className="task-preview-card skeleton"></div>
            ))
          ) : (
            displayTasks.map((task, index) => (
              <div 
                key={`${shuffleKeyRef.current}-${index}`}
                className={`task-preview-card-wrapper ${animationPhase}`}
                style={getCardStyle(index)}
              >
                <TaskCard
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="task-preview-footer">
        <Button 
          variant="primary"
          size="lg"
          onClick={() => navigate('/portal/tasks')}
        >
          Browse tasks →
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
