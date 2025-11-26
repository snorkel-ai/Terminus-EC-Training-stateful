import { useState, useEffect } from 'react';
import { Button, Alert } from '../ui';
import './TaskClaimSuccess.css';

export function TaskClaimSuccess({ task, onClose }) {
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cliCommand = `terminus task start ${task.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
  };

  return (
    <div className="task-claim-success">
      <div className="success-icon-wrapper">
        <div className="success-icon">✓</div>
      </div>
      
      <h2>Task Claimed!</h2>
      <p>You have 48 hours to complete this task before it's released back to the community.</p>

      <div className="timer-display">
        <span className="timer-label">Time Remaining</span>
        <div className="timer-value">{formatTime(timeLeft)}</div>
      </div>

      <div className="cli-instruction">
        <p>Run this command in your terminal to start:</p>
        <div className="cli-command-box">
          <code>{cliCommand}</code>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </div>

      <div className="success-actions">
        <Button variant="primary" onClick={onClose} className="w-full">
          Got it, let's go!
        </Button>
      </div>
    </div>
  );
}

