import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleCanvas from '../ParticleCanvas';

const Hero = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/login'); // Will need to update this to support signup flow
  };

  const handleWhatIsClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('what-is-terminalbench');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="landing-hero">
      <ParticleCanvas />
      
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to your new community of experts. 
        </h1>
        
        <p className="hero-subtitle">
          Build challenging and <b>real</b> engineering tasks, beat frontier LLMS, advance the state of agentic coding and <b>get paid for your expertise.</b>
        </p>
        
        <div className="hero-ctas">
          <button onClick={handleJoin} className="cta-button cta-primary">
            Login to my portal
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
          <a href="#what-is-terminalbench" onClick={handleWhatIsClick} className="cta-link">
            What is TerminalBench?
          </a>
          <div style={{ marginTop: '0.5rem' }}>
            <a href="#how-it-works" onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('how-it-works');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }} className="cta-link" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Learn how it works
            </a>
          </div>
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
