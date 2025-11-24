import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const { getCompletionPercentage, loading } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile) return null;

  const percentage = loading ? 0 : getCompletionPercentage();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Terminus Training Hub</h1>
          <nav className="header-tabs">
            <button 
              className={`header-tab ${isActive('/') ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button 
              className={`header-tab ${isActive('/tasks') ? 'active' : ''}`}
              onClick={() => navigate('/tasks')}
            >
              Tasks
            </button>
            <button 
              className={`header-tab ${isActive('/my-tasks') ? 'active' : ''}`}
              onClick={() => navigate('/my-tasks')}
            >
              My Selected Tasks
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="header-progress">
            <span className="header-progress-text">{percentage}% Complete</span>
            <div className="header-progress-bar">
              <div 
                className="header-progress-fill" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;

