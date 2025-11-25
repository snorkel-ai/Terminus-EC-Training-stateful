import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './UserMenu.css';

function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Check admin status from session metadata (Supabase pattern)
  const isAdmin = user?.user_metadata?.is_admin || false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!profile) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className={`user-menu-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {profile.github_avatar_url ? (
          <img 
            src={profile.github_avatar_url} 
            alt={profile.github_username} 
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {profile.github_username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="user-name">{profile.github_username || 'User'}</span>
        <svg 
          className={`user-menu-chevron ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M4.427 6.573l3.396 3.396 3.396-3.396a.75.75 0 111.06 1.06l-3.926 3.927a.75.75 0 01-1.06 0L3.366 7.633a.75.75 0 011.06-1.06z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {isAdmin && (
            <button
              className="user-menu-item"
              onClick={() => {
                navigate('/portal/admin');
                setIsOpen(false);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                <path d="M8 4a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 018 4z"/>
              </svg>
              Admin Dashboard
            </button>
          )}
          <button
            className="user-menu-item user-menu-item-danger"
            onClick={handleSignOut}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h5a.5.5 0 000-1h-5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h5a.5.5 0 000-1h-5z"/>
              <path d="M11.854 8.354l2.5-2.5a.5.5 0 000-.708l-2.5-2.5a.5.5 0 10-.708.708L13.293 5.5H6.5a.5.5 0 000 1h6.793l-2.147 2.146a.5.5 0 00.708.708z"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
