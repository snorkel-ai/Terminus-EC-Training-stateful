import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleCanvas from '../ParticleCanvas';

const Hero = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/login'); // Will need to update this to support signup flow
  };

  const handleLearnMore = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="landing-hero">
      <ParticleCanvas />
      
      <div className="hero-content">
        <h1 className="hero-title">
          Get paid to push the boundaries<br />
          of agentic AI. 
        </h1>
        
        <p className="hero-subtitle">
          Solve real engineering tasks. Benchmark the next generation of AI. Get paid for your expertise.
        </p>
        
        <div className="hero-ctas">
          <button onClick={handleJoin} className="cta-button cta-primary">
            Join TerminalBench
          </button>
          <button onClick={handleLearnMore} className="cta-button cta-secondary">
            Learn more about TerminalBench
          </button>
        </div>
      </div>

      <div className="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

