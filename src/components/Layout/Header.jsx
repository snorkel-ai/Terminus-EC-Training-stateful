import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const { getCompletionPercentage, loading } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile) return null;

  const percentage = loading ? 0 : getCompletionPercentage();

  const isActive = (path) => location.pathname === `/portal${path === '/' ? '' : path}`;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Terminus Training Hub</h1>
          <nav className="header-tabs">
            <button 
              className={`header-tab ${isActive('/') ? 'active' : ''}`}
              onClick={() => navigate('/portal')}
            >
              Home
            </button>
            <button 
              className={`header-tab ${isActive('/tasks') ? 'active' : ''}`}
              onClick={() => navigate('/portal/tasks')}
            >
              Tasks
            </button>
            <button 
              className={`header-tab ${isActive('/my-tasks') ? 'active' : ''}`}
              onClick={() => navigate('/portal/my-tasks')}
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
          
          <button onClick={toggleTheme} className="theme-toggle" style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.2rem',
            padding: '0.5rem',
            marginRight: '1rem',
            color: 'var(--text-primary)'
          }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;

