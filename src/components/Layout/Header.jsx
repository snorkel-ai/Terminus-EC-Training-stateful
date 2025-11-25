import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
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
          <div className="logo-lockup" onClick={() => navigate('/portal')}>
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
        </div>
        
        <div className="header-right">
          <nav className="header-nav">
            <Link 
              to="/portal" 
              className={`header-nav-item ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/portal/overview" 
              className={`header-nav-item ${isActive('/overview') ? 'active' : ''}`}
            >
              Our mission
            </Link>
            <Link 
              to="/portal/tasks" 
              className={`header-nav-item ${isActive('/tasks') ? 'active' : ''}`}
            >
              Task gallery
            </Link>
            <div className="nav-dropdown-container">
              <button className={`header-nav-item dropdown-trigger ${isActive('/onboarding') ? 'active' : ''}`}>
                Resources
                <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
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

            <a 
              href="https://snorkel.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="header-nav-item"
            >
              Submitter portal
            </a>
            <Link 
              to="/portal/faq" 
              className={`header-nav-item ${isActive('/faq') ? 'active' : ''}`}
            >
              Help
            </Link>
          </nav>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
