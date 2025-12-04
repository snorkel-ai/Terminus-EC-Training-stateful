import { useEffect, useRef } from 'react';
import { Button } from '../ui';
import './TaskClaimSuccess.css';

export function TaskClaimSuccess({ task, onClose, onRelease, onGoToMyTasks }) {
  const containerRef = useRef(null);

  // Generate confetti on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create confetti pieces
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

    // Cleanup confetti after animation
    const timeout = setTimeout(() => {
      container.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="task-claim-success" ref={containerRef}>
      <div className="success-icon-wrapper">
        <div className="success-icon">✓</div>
      </div>
      
      <h2>Task Claimed!</h2>
      <p>This task has been added to your list.</p>

      <div className="success-actions-stack">
        <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>
          Show Task
        </Button>
        <Button variant="secondary" onClick={onGoToMyTasks} style={{ width: '100%' }}>
          Go to My Tasks
        </Button>
        {onRelease && (
          <Button 
            variant="ghost" 
            onClick={onRelease} 
            style={{ color: '#dc2626', width: '100%' }}
          >
            Give task back
          </Button>
        )}
      </div>
    </div>
  );
}

