import React from 'react';

const Benefits = () => {
  const benefits = [
    {
      icon: '⚡️',
      title: 'Real Impact',
      description: 'Your work directly benchmarks and improves the capabilities of next-gen AI models.'
    },
    {
      icon: '💰',
      title: 'Competitive Pay',
      description: 'Earn competitive rates for high-quality engineering work. No bidding wars.'
    },
    {
      icon: '🧠',
      title: 'Hard Problems',
      description: 'No CSS centering or button shifting. Tackle complex algorithmic and system design challenges.'
    },
    {
      icon: '🌍',
      title: 'Flexible Work',
      description: 'Work from anywhere, anytime. Choose tasks that fit your schedule and interests.'
    }
  ];

  return (
    <section id="benefits" className="landing-section">
      <h2 className="section-title">Why Join TerminalBench?</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;

