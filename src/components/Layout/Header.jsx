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
              to="/portal/onboarding" 
              className={`header-nav-item ${isActive('/onboarding') ? 'active' : ''}`}
            >
              Onboarding
            </Link>
            <Link 
              to="/portal/overview" 
              className={`header-nav-item ${isActive('/overview') ? 'active' : ''}`}
            >
              Documentation
            </Link>
            <Link 
              to="/portal/tasks" 
              className={`header-nav-item ${isActive('/tasks') ? 'active' : ''}`}
            >
              Tasks gallery
            </Link>
          </nav>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
