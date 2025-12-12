import React from 'react';
import './Logo.css';

export const Logo = ({ className = '', ...props }) => {
  return (
    <div className={`ui-logo-lockup ${className}`} {...props}>
      <img 
        src="https://s46486.pcdn.co/wp-content/uploads/2023/05/snorkel_logo_header-1.svg" 
        alt="Snorkel" 
        className="ui-snorkel-logo-img"
      />
    </div>
  );
};

export default Logo;









