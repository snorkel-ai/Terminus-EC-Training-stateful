import { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { getAllDocs, getDocContent } from '../../docs';
import './DocsSearch.css';

function DocsSearch({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Build search index from all docs
  useEffect(() => {
    const buildIndex = async () => {
      const allDocs = getAllDocs();
      const indexed = await Promise.all(
        allDocs.map(async (doc) => {
          try {
            const content = await getDocContent(doc.slug);
            // Strip markdown syntax for cleaner search
            const plainContent = content
              .replace(/#{1,6}\s/g, '')
              .replace(/\*\*/g, '')
              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
              .replace(/`{1,3}[^`]*`{1,3}/g, '')
              .replace(/\n/g, ' ')
              .slice(0, 500); // Limit content length
            return { ...doc, content: plainContent };
          } catch {
            return { ...doc, content: doc.title };
          }
        })
      );
      setSearchIndex(indexed);
    };
    buildIndex();
  }, []);

  // Fuse.js instance
  const fuse = useMemo(() => {
    return new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'section', weight: 2 },
        { name: 'content', weight: 1 }
      ],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }, [searchIndex]);

  const results = query.length >= 2 
    ? fuse.search(query).slice(0, 8) 
    : [];

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex].item.slug);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect, results, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="docs-search-overlay" onClick={onClose}>
      <div className="docs-search-modal" onClick={e => e.stopPropagation()}>
        <div className="docs-search-header">
          <svg className="docs-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="docs-search-input"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="docs-search-esc">ESC</kbd>
        </div>
        
        <div className="docs-search-results">
          {query.length < 2 ? (
            <div className="docs-search-hint">
              <p>Type to search all documentation...</p>
              <div className="docs-search-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Select</span>
                <span><kbd>ESC</kbd> Close</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="docs-search-empty">
              <p>No results for "<strong>{query}</strong>"</p>
              <p className="docs-search-empty-hint">Try different keywords or check spelling</p>
            </div>
          ) : (
            <ul className="docs-search-list">
              {results.map(({ item }, index) => (
                <li key={item.slug}>
                  <button
                    className={`docs-search-result ${index === selectedIndex ? 'docs-search-result--selected' : ''}`}
                    onClick={() => onSelect(item.slug)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="docs-search-result-icon">{item.icon}</span>
                    <div className="docs-search-result-text">
                      <span className="docs-search-result-title">{item.title}</span>
                      <span className="docs-search-result-section">{item.section}</span>
                    </div>
                    <svg className="docs-search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocsSearch;
