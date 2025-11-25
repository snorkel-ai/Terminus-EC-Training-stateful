import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleCanvas from '../ParticleCanvas';

const CountUp = ({ end, duration = 2000, prefix = '', separator = ',' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      // Easing function: easeOutExpo
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      const currentCount = Math.floor(ease * end);
      setCount(currentCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  const formattedNumber = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={countRef}>
      {prefix}{formattedNumber}
    </span>
  );
};

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

  const logos = [1, 2, 3, 4, 5]; // Placeholders for 5 company logos

  return (
    <section className="landing-hero">
      <ParticleCanvas />
      
      <div className="hero-content">
        <h1 className="hero-title">
          Push the boundaries<br />
          of agentic development. 
        </h1>
        
        <p className="hero-subtitle">
          Solve <b>real</b> engineering tasks. Benchmark the next generation of AI and <b>get paid for your expertise.</b>
        </p>
        
        <div className="hero-ctas">
          <button onClick={handleJoin} className="cta-button cta-primary">
            Join TerminalBench
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
          <a href="#what-is-terminalbench" onClick={handleWhatIsClick} className="cta-link">
            What is TerminalBench?
          </a>
        </div>

        <div className="trusted-by">
          <p className="trusted-label">Trusted by engineering teams from:</p>
          <div className="trusted-logos">
            {logos.map((i) => (
              <div key={i} className="logo-placeholder"></div>
            ))}
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <p className="stat-value">
                <CountUp end={128450} prefix="$" duration={6000} />+
              </p>
              <p className="stat-label">paid out to developers completing real engineering tasks.</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">
                Join <span className="stat-highlight"><CountUp end={2173} /> contributors</span> pushing the boundaries of agentic AI.
              </p>
            </div>
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