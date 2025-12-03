import { Button, CodeBlock } from '../ui';
import { useTaskTimer } from '../../hooks/useTaskTimer';
import './TaskClaimSuccess.css';

const SUBMITTER_PORTAL_URL = 'https://submitter.terminus.com'; // External platform URL

export function TaskClaimSuccess({ task, onClose, onRelease }) {
  const { timeLeft, formatTime } = useTaskTimer(task.selected_at);
  const hasCommitted = !!task.first_commit_at;

  const cliCommand = `terminus task start ${task.id}`;

  // Show committed state view
  if (hasCommitted) {
    return (
      <div className="task-claim-success">
        <h2 style={{ marginBottom: '0.5rem' }}>Task In Progress</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Continue working on your task and submit when ready.</p>

        <a 
          href={SUBMITTER_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="submitter-portal-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}
        >
          Open Submitter Portal
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>

        <div className="success-actions" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          {onRelease && (
            <Button 
              variant="ghost" 
              onClick={onRelease} 
              style={{ color: '#dc2626', flex: 1 }}
            >
              Abandon task
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  // Show pre-commit state (original view with timer)
  return (
    <div className="task-claim-success">
      <div className="success-icon-wrapper">
        <div className="success-icon">✓</div>
      </div>
      
      <h2>Task Claimed!</h2>
      <p>You have 48 hours to make your first commit before this task is released back to the community.</p>

      <div className="timer-display">
        <span className="timer-label">Time Remaining</span>
        <div className="timer-value">{formatTime(timeLeft)}</div>
      </div>

      <div className="cli-instruction">
        <p>Run this command in your terminal to start:</p>
        <CodeBlock className="lg">{cliCommand}</CodeBlock>
      </div>

      <div className="success-actions" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', marginTop: '2rem' }}>
        {onRelease && (
          <Button 
            variant="ghost" 
            onClick={onRelease} 
            style={{ color: '#dc2626', flex: 1 }}
          >
            Give task back
          </Button>
        )}
        <Button variant="primary" onClick={onClose} style={{ flex: 1 }}>
          Got it, let's go!
        </Button>
      </div>
    </div>
  );
}

