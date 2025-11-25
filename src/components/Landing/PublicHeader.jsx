import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo, Navbar, NavLink } from '../ui';
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
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        
        <Navbar className="public-nav">
          <NavLink as="button" onClick={() => scrollToSection('what-is-terminalbench')}>
            What is TerminalBench?
          </NavLink>
          <NavLink as="button" onClick={() => scrollToSection('benefits')}>
            Why join
          </NavLink>
          <NavLink 
            as="button" 
            onClick={() => navigate('/login')} 
            variant="button"
          >
            Login
          </NavLink>
        </Navbar>
      </div>
    </header>
  );
};

export default PublicHeader;
