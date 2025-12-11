import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Spinner } from '../ui';
import { VideoEmbed, LoomEmbed } from './VideoEmbed';
import PdfDownload from './PdfDownload';
import './DocsContent.css';

// Code block component with copy functionality
const CodeBlock = ({ inline, className, children }) => {
  // Detect inline code: 
  // - explicitly marked inline
  // - OR no language class AND no newlines in content (single-line code without language = inline)
  const content = String(children);
  const hasNewlines = content.includes('\n');
  const hasLanguage = className?.startsWith('language-');
  const isInline = inline === true || (!hasLanguage && !hasNewlines);
  
  if (isInline) {
    return <code className="docs-inline-code">{children}</code>;
  }
  
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-code-wrapper">
      <div className="docs-code-header">
        <span className="docs-code-lang">{language}</span>
        <button 
          className={`docs-code-copy-btn ${copied ? 'copied' : ''}`} 
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="docs-code-block">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

function DocsContent({ content, loading, title, prevDoc, nextDoc, onPaginationClick }) {
  if (loading) {
    return (
      <div className="docs-content-loading">
        <Spinner size="lg" />
        <p>Loading documentation...</p>
      </div>
    );
  }

  return (
    <article className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom media components
          // When rehypeRaw processes custom HTML elements, attributes are in node.properties
          'video-embed': ({ node }) => (
            <VideoEmbed 
              src={node?.properties?.src} 
              title={node?.properties?.title} 
            />
          ),
          'video-loom': ({ node }) => (
            <LoomEmbed 
              id={node?.properties?.id} 
              title={node?.properties?.title} 
            />
          ),
          'pdf-download': ({ node }) => (
            <PdfDownload 
              src={node?.properties?.src} 
              title={node?.properties?.title} 
            />
          ),
          // Headings
          h1: ({ children }) => <h1 className="docs-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="docs-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="docs-h3">{children}</h3>,
          h4: ({ children }) => <h4 className="docs-h4">{children}</h4>,
          
          // Paragraphs
          p: ({ children }) => <p className="docs-p">{children}</p>,
          
          // Code blocks
          code: CodeBlock,
          
          // Images
          img: ({ src, alt }) => (
            <figure className="docs-figure">
              <img src={src} alt={alt} className="docs-image" loading="lazy" />
              {alt && <figcaption className="docs-figcaption">{alt}</figcaption>}
            </figure>
          ),
          
          // Links
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            if (isExternal) {
              return (
                <a href={href} className="docs-link" target="_blank" rel="noopener noreferrer">
                  {children}
                  <svg className="docs-external-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              );
            }
            return <Link to={href} className="docs-link">{children}</Link>;
          },
          
          // Blockquotes (callouts)
          blockquote: ({ children }) => (
            <blockquote className="docs-callout">{children}</blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="docs-table-wrapper">
              <table className="docs-table">{children}</table>
            </div>
          ),
          
          // Lists
          ul: ({ children }) => <ul className="docs-ul">{children}</ul>,
          ol: ({ children }) => <ol className="docs-ol">{children}</ol>,
          li: ({ children }) => <li className="docs-li">{children}</li>,
          
          // Horizontal rule
          hr: () => <hr className="docs-hr" />,
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Navigation footer */}
      <nav className="docs-pagination">
        {prevDoc ? (
          <Link 
            to={`/portal/docs/${prevDoc.slug}`} 
            className="docs-pagination-link docs-pagination-prev"
            onClick={onPaginationClick}
          >
            <span className="docs-pagination-label">Previous</span>
            <span className="docs-pagination-title">
              <span className="docs-pagination-icon">{prevDoc.icon}</span>
              {prevDoc.title}
            </span>
          </Link>
        ) : <div />}
        
        {nextDoc ? (
          <Link 
            to={`/portal/docs/${nextDoc.slug}`} 
            className="docs-pagination-link docs-pagination-next"
            onClick={onPaginationClick}
          >
            <span className="docs-pagination-label">Next</span>
            <span className="docs-pagination-title">
              {nextDoc.title}
              <span className="docs-pagination-icon">{nextDoc.icon}</span>
            </span>
          </Link>
        ) : <div />}
      </nav>
    </article>
  );
}

export default DocsContent;
