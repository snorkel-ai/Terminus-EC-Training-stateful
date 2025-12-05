import { Link } from 'react-router-dom';
import './DocsSidebar.css';

function DocsSidebar({ sections, currentSlug, onSearchClick, isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="docs-sidebar-overlay" onClick={onClose} />}
      
      <aside className={`docs-sidebar ${isOpen ? 'docs-sidebar--open' : ''}`}>
        <div className="docs-sidebar-header">
          <Link to="/portal" className="docs-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Portal
          </Link>
          <h2 className="docs-sidebar-title">Documentation</h2>
        </div>

        <button className="docs-search-trigger" onClick={onSearchClick}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search docs...</span>
          <kbd>⌘K</kbd>
        </button>

        <nav className="docs-nav">
          {sections.map((section) => (
            <div key={section.title} className="docs-nav-section">
              <h3 className="docs-nav-section-title">{section.title}</h3>
              <ul className="docs-nav-list">
                {section.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/portal/docs/${item.slug}`}
                      className={`docs-nav-link ${currentSlug === item.slug ? 'docs-nav-link--active' : ''}`}
                      onClick={onClose}
                    >
                      <span className="docs-nav-icon">{item.icon}</span>
                      <span className="docs-nav-text">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default DocsSidebar;
