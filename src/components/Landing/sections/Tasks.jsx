import React from 'react';
import { tasks } from '../../../data/tasks';

const Tasks = () => {
  return (
    <section className="landing-section full-width tasks-section">
      <h2 className="section-title">Examples of Real Engineering Problems</h2>
      <p className="section-subtitle">
        Think you can beat the models? Prove it and get paid.
      </p>
      <div className="tasks-container">
        <div className="tasks-grid-fade">
          {/* Duplicate tasks for infinite scroll effect */}
          {[...tasks, ...tasks].map((task, index) => (
            <div key={index} className="task-card" style={{ '--index': index }}>
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
                  &gt; git checkout -b task/{index + 101}<br/>
                  &gt; npm test
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="fade-overlay"></div>
      </div>
    </section>
  );
};

export default Tasks;