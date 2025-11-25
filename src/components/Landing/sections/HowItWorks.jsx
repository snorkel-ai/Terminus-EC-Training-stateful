import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Select a Task',
      description: 'Browse our queue of real-world engineering problems. Choose tasks that match your expertise - from debugging to feature implementation.'
    },
    {
      number: '02',
      title: 'Solve & Submit',
      description: 'Work in your own environment. Solve the problem using standard tools and submit your solution for verification.'
    },
    {
      number: '03',
      title: 'Get Paid',
      description: 'Once your solution passes our verification pipeline, you get paid. Build your reputation and unlock higher-tier tasks.'
    }
  ];

  return (
    <section id="how-it-works" className="landing-section">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

