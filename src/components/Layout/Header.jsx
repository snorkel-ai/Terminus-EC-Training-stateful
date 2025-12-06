import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { Logo, Navbar, NavLink } from '../ui';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const quickLinksMenuRef = useRef(null);

  if (!profile) return null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickLinksMenuRef.current && !quickLinksMenuRef.current.contains(event.target)) {
        setIsQuickLinksOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/portal' || location.pathname === '/portal/';
    }
    return location.pathname.startsWith(`/portal${path}`);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <Logo onClick={() => navigate('/portal')} />
        </div>
        
        <div className="header-right">
          <Navbar className="header-nav">
            <NavLink 
              to="/portal" 
              active={isActive('/')}
            >
              Home
            </NavLink>
            <NavLink 
              to="/portal/overview" 
              active={isActive('/overview')}
            >
              Our mission
            </NavLink>
            <NavLink 
              to="/portal/tasks" 
              active={isActive('/tasks')}
            >
              Task gallery
            </NavLink>
            <NavLink 
              to="/portal/docs" 
              active={isActive('/docs')}
            >
              Docs
            </NavLink>

            <div className="nav-dropdown-container" ref={quickLinksMenuRef}>
            <NavLink 
                as="button"
                className="dropdown-trigger"
                onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
              >
                Quick links
                <svg 
                  className={`dropdown-arrow ${isQuickLinksOpen ? 'open' : ''}`} 
                  width="10" 
                  height="6" 
                  viewBox="0 0 10 6" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
              <div className={`nav-dropdown-menu ${isQuickLinksOpen ? 'open' : ''}`}>
                <a 
                  href="https://snorkel.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setIsQuickLinksOpen(false)}
                >
                  Snorkel Expert Platform
                </a>
                <a 
                  href="https://snorkel-team.enterprise.slack.com/archives/C09MNJL1203" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setIsQuickLinksOpen(false)}
                >
                  Slack community
                </a>
                <a 
                  href="https://github.com/snorkel-ai/snorkel-tb-tasks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setIsQuickLinksOpen(false)}
                >
                  GitHub Repo
                </a>
                <Link 
                  to="/portal/docs/reference/glossary" 
                  className="dropdown-item"
                  onClick={() => setIsQuickLinksOpen(false)}
                >
                  Glossary
                </Link>
                <Link 
                  to="/portal/docs/reference/faq" 
                  className="dropdown-item"
                  onClick={() => setIsQuickLinksOpen(false)}
                >
                  FAQ
                </Link>
              </div>
            </div>

            <div className="nav-divider"></div>
            <NavLink 
              to="/portal/docs/reference/faq" 
              active={isActive('/docs/reference/faq')}
            >
              Help
            </NavLink>
          </Navbar>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
