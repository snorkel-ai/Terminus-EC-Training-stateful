import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './PublicHeader.css';

const PublicHeader = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="public-header">
      <div className="public-header-content">
        <div className="public-logo-lockup" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {/* Tbench Logo Part */}
          <div className="tbench-logo">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-terminal"
            >
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" x2="20" y1="19" y2="19"></line>
            </svg>
            <span className="logo-text font-mono">terminal-bench</span>
          </div>

          <span className="logo-separator">×</span>
          
          {/* Snorkel Logo Part */}
          <img 
            src="https://s46486.pcdn.co/wp-content/uploads/2023/05/snorkel_logo_header-1.svg" 
            alt="Snorkel" 
            className="snorkel-logo-img"
          />
        </div>
        
        <nav className="public-nav">
          <button onClick={() => scrollToSection('what-is-terminalbench')} className="nav-item">
            What is TerminalBench?
          </button>
          <button onClick={() => scrollToSection('benefits')} className="nav-item">
            Why join
          </button>
          <button onClick={() => navigate('/login')} className="nav-item login-btn">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
