import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocsSidebar from './DocsSidebar';
import DocsContent from './DocsContent';
import DocsSearch from './DocsSearch';
import { docsConfig, getDocContent, getAllDocs } from '../../docs';
import './DocsLayout.css';

function DocsLayout() {
  const { slug = 'welcome' } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load markdown content
  useEffect(() => {
    setLoading(true);
    getDocContent(slug)
      .then(setContent)
      .catch(() => setContent('# Page Not Found\n\nThis documentation page doesn\'t exist yet.\n\n[← Back to Welcome](/portal/docs/welcome)'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        onSearchClick={() => setSearchOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="docs-main">
        <DocsContent 
          content={content} 
          loading={loading}
          title={currentDoc?.title}
          prevDoc={prevDoc}
          nextDoc={nextDoc}
        />
      </main>

      <DocsSearch 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(docSlug) => {
          navigate(`/portal/docs/${docSlug}`);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}

export default DocsLayout;
