import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      padding: '4rem 2rem', 
      marginTop: '4rem',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to start?</h3>
          <button 
            onClick={() => navigate('/login')}
            className="cta-button cta-primary"
          >
            Apply to Join
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Discord</a>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} TerminalBench. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

