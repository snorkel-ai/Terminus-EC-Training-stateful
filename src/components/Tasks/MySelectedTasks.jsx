import { useMySelectedTasks } from '../../hooks/useTasks';
import { Button, LoadingState } from '../ui';
import TaskTile from './TaskTile';
import './Tasks.css';

function MySelectedTasks() {
  const { selectedTasks, loading, error, unselectTask } = useMySelectedTasks();

  if (loading) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Selected Tasks</h1>
          <p>Tasks you have claimed</p>
        </div>
        <div className="tasks-loading">
          <LoadingState size="lg" message="Loading your selected tasks..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-view my-tasks-view">
        <div className="tasks-header">
          <h1>My Selected Tasks</h1>
          <p>Tasks you have claimed</p>
        </div>
        <div className="tasks-error">
          <p>Error loading your tasks: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-view my-tasks-view">
      <div className="tasks-header">
        <h1>My Selected Tasks</h1>
        <p>You have selected {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}</p>
      </div>

      {selectedTasks.length === 0 ? (
        <div className="tasks-empty">
          <div className="empty-state">
            <h2>No tasks selected yet</h2>
            <p>Browse the task library and select tasks to work on.</p>
            <Button variant="primary" onClick={() => window.location.href = '/tasks'}>
              Browse Tasks
            </Button>
          </div>
        </div>
      ) : (
        <div className="tasks-grid">
          {selectedTasks.map(task => (
            <TaskTile
              key={task.id}
              task={task}
              isSelected={true}
              isMine={true}
              onSelect={() => {}}
              onUnselect={unselectTask}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MySelectedTasks;
