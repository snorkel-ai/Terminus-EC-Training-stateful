import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePostHog } from 'posthog-js/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { Logo, Navbar, NavLink } from '../ui';
import './Header.css';

function Header() {
  const { profile } = useAuth();
  const posthog = usePostHog();
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const quickLinksMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  if (!profile) return null;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickLinksMenuRef.current && !quickLinksMenuRef.current.contains(event.target)) {
        setIsQuickLinksOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/portal' || location.pathname === '/portal/';
    }
    return location.pathname.startsWith(`/portal${path}`);
  };

  const handleTaskGalleryClick = () => {
    if (posthog) {
      posthog.capture('browse_tasks_clicked', {
        source: 'header_nav'
      });
    }
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
              onClick={handleTaskGalleryClick}
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
                  href="/Terminus-EC-Training-stateful/template-task.zip"
                  download="template-task.zip"
                  className="dropdown-item"
                  onClick={() => {
                    if (posthog) {
                      posthog.capture('skeleton_downloaded', {
                        source: 'header_quick_links',
                        file_title: 'Task Skeleton'
                      });
                    }
                    setIsQuickLinksOpen(false);
                  }}
                >
                  Download Task Skeleton
                </a>
                <a 
                  href="https://experts.snorkel-ai.com/" 
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

          {/* Mobile hamburger button */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <UserMenu />
        </div>
      </div>

      {/* Mobile Navigation Menu - Portaled to body to avoid z-index/clipping issues */}
      {createPortal(
        <>
          <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
          <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mobile-nav-links">
              <Link to="/portal" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/portal/overview" className={`mobile-nav-link ${isActive('/overview') ? 'active' : ''}`}>
                Our mission
              </Link>
              <Link to="/portal/tasks" className={`mobile-nav-link ${isActive('/tasks') ? 'active' : ''}`} onClick={handleTaskGalleryClick}>
                Task gallery
              </Link>
              <Link to="/portal/my-tasks" className={`mobile-nav-link ${isActive('/my-tasks') ? 'active' : ''}`}>
                My tasks
              </Link>
              <Link to="/portal/docs" className={`mobile-nav-link ${isActive('/docs') ? 'active' : ''}`}>
                Docs
              </Link>
              <Link to="/portal/docs/reference/faq" className={`mobile-nav-link ${isActive('/docs/reference/faq') ? 'active' : ''}`}>
                Help & FAQ
              </Link>
            </div>

            <div className="mobile-nav-section">
              <span className="mobile-nav-section-title">Quick Links</span>
              <a 
                href="/Terminus-EC-Training-stateful/template-task.zip"
                download="template-task.zip"
                className="mobile-nav-link"
                onClick={() => {
                  if (posthog) {
                    posthog.capture('skeleton_downloaded', {
                      source: 'mobile_quick_links',
                      file_title: 'Task Skeleton'
                    });
                  }
                }}
              >
                Download Task Skeleton
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
              <a 
                href="https://experts.snorkel-ai.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-nav-link external"
              >
                Snorkel Expert Platform
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              <a 
                href="https://snorkel-team.enterprise.slack.com/archives/C09MNJL1203" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-nav-link external"
              >
                Slack community
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              <a 
                href="https://github.com/snorkel-ai/snorkel-tb-tasks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-nav-link external"
              >
                GitHub Repo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              <Link to="/portal/docs/reference/glossary" className="mobile-nav-link">
                Glossary
              </Link>
            </div>
          </nav>
        </>,
        document.body
      )}
    </header>
  );
}

export default Header;
