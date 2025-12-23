import React from 'react';
import { IconImpact, IconPay, IconBrain, IconFlexible } from './BenefitIcons';

const Benefits = () => {
  const benefits = [
    {
      icon: <IconImpact />,
      title: 'Real Impact',
      description: 'Your work helps evaluate and push the boundaries of next-gen AI models.'
    },
    {
      icon: <IconPay />,
      title: 'Competitive Pay',
      description: 'Earn competitive rates for high-quality engineering work. No bidding wars.'
    },
    {
      icon: <IconBrain />,
      title: 'Hard Problems',
      description: 'No CSS centering or button shifting. Tackle complex algorithmic and system design challenges.'
    },
    {
      icon: <IconFlexible />,
      title: 'Flexible Work',
      description: 'Work from anywhere, anytime. Choose tasks that fit your schedule and interests.'
    }
  ];

  return (
    <section id="benefits" className="landing-section">
      <h2 className="section-title">You + TerminalBench</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-icon-wrapper">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;

