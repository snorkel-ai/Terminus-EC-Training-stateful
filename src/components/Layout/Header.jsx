import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import UserMenu from './UserMenu';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const { getCompletionPercentage, loading } = useProgress();

  if (!profile) return null;

  const percentage = loading ? 0 : getCompletionPercentage();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Terminus Training Hub</h1>
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

