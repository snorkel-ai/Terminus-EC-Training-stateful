import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer style={{ 
      backgroundColor: '#ffffff', 
      padding: '6rem 2rem 4rem', 
      marginTop: '0',
      borderTop: '1px solid #f0f0f0',
      color: '#1d1d1f'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem'
      }}>
        {/* Top Section: 2 Columns */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          {/* Left Column: Hero Text */}
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '2rem',
              lineHeight: '1.1',
              color: '#1d1d1f',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span>Real work.</span>
              <span>Real payouts.</span>
              <span>Real impact.</span>
            </h3>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#86868b', 
              maxWidth: '480px'
            }}>
              The thing frontier agents are missing: <b>your expertise</b>.
            </p>
          </div>

          {/* Right Column: Apply Button */}
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="cta-button cta-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              Login to my portal
            </button>
          </div>
        </div>
        
        {/* Bottom Section: Links */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '2rem',
          gap: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            color: '#424245',
            fontSize: '0.9rem',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          </div>
          
          <p style={{ color: '#86868b', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Snorkel AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
