import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { Logo, Navbar, NavLink } from '../ui';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile) return null;

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
            <div className="nav-dropdown-container">
              <NavLink 
                as="button"
                className={`dropdown-trigger ${isActive('/onboarding') ? 'active' : ''}`}
              >
                Resources
                <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
              <div className="nav-dropdown-menu">
                <Link to="/portal/onboarding" className="dropdown-item">
                  Onboarding
                </Link>
                <Link to="/portal/videos" className="dropdown-item">
                  Videos
                </Link>
                <Link to="/portal/workbook" className="dropdown-item">
                  Workbook
                </Link>
                <Link to="/portal/oracle" className="dropdown-item">
                  Oracle Training
                </Link>
                <Link to="/portal/feedback" className="dropdown-item">
                  Feedback Slides
                </Link>
                <Link to="/portal/glossary" className="dropdown-item">
                  Glossary
                </Link>
              </div>
            </div>

            <div className="nav-divider"></div>

            <NavLink 
              href="https://snorkel.ai" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Submitter portal
            </NavLink>
            <NavLink 
              to="/portal/faq" 
              active={isActive('/faq')}
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
