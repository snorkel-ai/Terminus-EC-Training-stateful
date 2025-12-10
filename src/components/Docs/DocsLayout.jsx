import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import DocsSidebar from './DocsSidebar';
import DocsContent from './DocsContent';
import DocsSearch from './DocsSearch';
import { docsConfig, getDocContent, getAllDocs } from '../../docs';
import './DocsLayout.css';

function DocsLayout() {
  const { '*': wildcardSlug } = useParams();
  const slug = wildcardSlug || 'getting-started/welcome';
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigationSourceRef = useRef('direct'); // Track how user arrived: 'direct', 'sidebar', 'search', 'pagination'

  // Load markdown content
  useEffect(() => {
    setLoading(true);
    getDocContent(slug)
      .then((docContent) => {
        setContent(docContent);
        // Track successful doc view
        if (posthog) {
          const allDocs = getAllDocs();
          const doc = allDocs.find(d => d.slug === slug);
          posthog.capture('doc_viewed', {
            doc_slug: slug,
            doc_title: doc?.title || slug,
            doc_section: doc?.section || 'unknown',
            navigation_source: navigationSourceRef.current,
          });
        }
        // Reset navigation source for next navigation
        navigationSourceRef.current = 'direct';
      })
      .catch(() => setContent('# Page Not Found\n\nThis documentation page doesn\'t exist yet.\n\n[← Back to Welcome](/portal/docs/getting-started/welcome)'))
      .finally(() => setLoading(false));
  }, [slug, posthog]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchOpen('keyboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track search modal opening
  const handleSearchOpen = (trigger = 'button') => {
    setSearchOpen(true);
    if (posthog) {
      posthog.capture('docs_search_opened', {
        trigger, // 'keyboard' or 'button'
        current_doc_slug: slug,
      });
    }
  };

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [slug]);

  // Find current doc info
  const allDocs = getAllDocs();
  const currentDoc = allDocs.find(item => item.slug === slug);
  const currentIndex = allDocs.findIndex(item => item.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="docs-layout">
      {/* Mobile menu button */}
      <button 
        className="docs-mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {sidebarOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      <DocsSidebar 
        sections={docsConfig.sections}
        currentSlug={slug}
        onSearchClick={() => handleSearchOpen('button')}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavClick={() => { navigationSourceRef.current = 'sidebar'; }}
      />
      
      <main className="docs-main">
        <DocsContent 
          content={content} 
          loading={loading}
          title={currentDoc?.title}
          prevDoc={prevDoc}
          nextDoc={nextDoc}
          onPaginationClick={() => { navigationSourceRef.current = 'pagination'; }}
        />
      </main>

      <DocsSearch 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(docSlug, searchQuery) => {
          navigationSourceRef.current = 'search';
          if (posthog) {
            posthog.capture('docs_search_result_clicked', {
              search_query: searchQuery,
              selected_doc_slug: docSlug,
              current_doc_slug: slug,
            });
          }
          navigate(`/portal/docs/${docSlug}`);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}

export default DocsLayout;
