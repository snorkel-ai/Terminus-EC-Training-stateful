import { useState } from 'react';
import './CodeBlock.css';

export function CodeBlock({ 
  children,
  copyable = true,
  onCopy,
  className = '',
  ...props 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`ui-code-block ${className}`} {...props}>
      <code className="ui-code-content">{children}</code>
      {copyable && (
        <button 
          className={`ui-code-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy'}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export function CommandBox({ command, className = '', ...props }) {
  return (
    <CodeBlock className={`ui-command-box ${className}`} {...props}>
      {command}
    </CodeBlock>
  );
}

export default CodeBlock;











