import React from 'react';
import { LogoSeparator } from './Divider';
import './Logo.css';

export const Logo = ({ className = '', showSnorkel = true, ...props }) => {
  return (
    <div className={`ui-logo-lockup ${className}`} {...props}>
      {/* Tbench Logo Part */}
      <div className="ui-tbench-logo">
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
        <span className="ui-logo-text">terminal-bench</span>
      </div>

      {showSnorkel && (
        <>
          <LogoSeparator />
          
          {/* Snorkel Logo Part */}
          <img 
            src="https://s46486.pcdn.co/wp-content/uploads/2023/05/snorkel_logo_header-1.svg" 
            alt="Snorkel" 
            className="ui-snorkel-logo-img"
          />
        </>
      )}
    </div>
  );
};

export default Logo;





