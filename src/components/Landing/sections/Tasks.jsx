import React from 'react';
import { tasks } from '../../../data/tasks';
import { TaskCard } from '../../ui';

const Tasks = () => {
  // Map static tasks to TaskCard format
  const mappedTasks = tasks.slice(0, 3).map((task, index) => ({
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
      <div className="tasks-container static-grid">
        <div className="tasks-grid">
          {mappedTasks.map((task, index) => (
            <div key={index} className="task-card-wrapper" style={{ '--index': index }}>
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tasks;