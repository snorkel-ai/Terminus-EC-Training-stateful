import React from 'react';
import { tasks } from '../../../data/tasks';
import { TaskCard } from '../../ui';

const Tasks = () => {
  // Map static tasks to TaskCard format - show 12 for perspective grid (4 columns x 3 rows)
  const mappedTasks = tasks.slice(0, 12).map((task, index) => ({
    id: index,
    subcategory: task.title,
    description: task.description,
    difficulty: task.difficulty,
    category: task.language
  }));

  return (
    <section className="landing-section full-width tasks-section">
      <h2 className="section-title">Examples of Real Engineering Problems</h2>
      <p className="section-subtitle">
        Think you can beat the models? Prove it and get paid.
      </p>
      <div className="tasks-perspective-container">
        <div className="tasks-perspective-grid">
          {mappedTasks.map((task, index) => (
            <div key={index} className="task-card-wrapper" style={{ '--index': index }}>
              <TaskCard task={task} />
            </div>
          ))}
        </div>
        <div className="tasks-fade-overlay" />
      </div>
    </section>
  );
};

export default Tasks;