import React from 'react';

const Tasks = () => {
  const tasks = [
    {
      title: 'Debug Race Condition',
      difficulty: 'hard',
      language: 'Go',
      description: 'Identify and fix a race condition in a concurrent queue implementation.',
      reward: '$150'
    },
    {
      title: 'Implement API Endpoint',
      difficulty: 'medium',
      language: 'Python',
      description: 'Create a new REST endpoint with rate limiting and caching support.',
      reward: '$80'
    },
    {
      title: 'Refactor Component',
      difficulty: 'easy',
      language: 'React',
      description: 'Convert a class-based component to functional using hooks and optimize re-renders.',
      reward: '$40'
    }
  ];

  return (
    <section className="landing-section">
      <h2 className="section-title">Real Engineering Tasks</h2>
      <div className="tasks-grid">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <div className="task-header">
              <span className="task-lang">{task.language}</span>
              <span className={`difficulty ${task.difficulty}`}>
                {task.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="task-body">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="code-snippet">
                &gt; git checkout -b fix/race-condition<br/>
                &gt; go test ./pkg/queue/...
              </div>
              <div style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                Reward: {task.reward}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tasks;

