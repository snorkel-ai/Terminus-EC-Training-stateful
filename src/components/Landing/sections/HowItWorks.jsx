import React, { useState } from 'react';

const HowItWorks = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'Pick or Define a Task',
      description: 'Browse our queue of real-world engineering problems. Choose tasks that match your expertise, from debugging to feature implementation.',
      hasLink: true
    },
    {
      number: '02',
      title: 'Build & Submit',
      description: 'Work in your own IDE, preferred environment. Use standard tools to code your solution, then push for automated- and human verification.'
    },
    {
      number: '03',
      title: 'Get Paid',
      description: 'Once your solution passes verification, you get paid immediately. Build your reputation and keep building tasks.'
    }
  ];

  return (
    <section id="how-it-works" className="landing-section">
      <h2 className="section-title">How does TerminalBench work?</h2>
      <div className="timeline-container">
        {steps.map((step, index) => (
          <div key={index} className="timeline-step">
            <div className="timeline-content">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.hasLink && (
                <a 
                  className="learn-more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTaskModal(true);
                  }}
                >
                  Learn more about our tasks →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div 
        className={`modal-overlay ${showTaskModal ? 'active' : ''}`} 
        onClick={(e) => {
          if(e.target === e.currentTarget) setShowTaskModal(false);
        }}
      >
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowTaskModal(false)}>×</button>
          <h3 className="modal-title">Diverse Engineering Challenges</h3>
          <div className="modal-body">
            <p>
              Our platform hosts a massive variety of tasks designed to test and improve skills across the entire technology spectrum. From quick bug fixes to complex system architecture problems, there's something for every engineer.
            </p>
            <p>
              <b>Have a specific problem in mind?</b> You can also propose your own tasks and solutions to contribute to our growing library of engineering challenges.
            </p>
            <p>
              Explore challenges in specialized fields including:
            </p>
            <div className="modal-tags">
              <span className="modal-tag">Machine Learning</span>
              <span className="modal-tag">Data Science</span>
              <span className="modal-tag">Cyber Security</span>
              <span className="modal-tag">Full Stack Web</span>
              <span className="modal-tag">System Design</span>
              <span className="modal-tag">Cloud Infrastructure</span>
              <span className="modal-tag">Algorithms</span>
              <span className="modal-tag">Database Optimization</span>
              <span className="modal-more-text">And more...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;