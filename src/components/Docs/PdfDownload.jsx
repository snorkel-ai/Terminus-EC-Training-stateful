import { usePostHog } from 'posthog-js/react';
import './PdfDownload.css';

/**
 * A download button/card for PDF files and other downloadables.
 * 
 * Usage in markdown:
 * <pdf-download src="/path/to/file.pdf" title="Download Slides" />
 */

function PdfDownload({ src, title }) {
  const posthog = usePostHog();
  
  // Handle absolute paths by prepending the base URL
  const basePath = import.meta.env.BASE_URL || '/';
  const fileSrc = src?.startsWith('/') && !src?.startsWith(basePath) 
    ? `${basePath.replace(/\/$/, '')}${src}` 
    : src;
  
  const fileName = src.split('/').pop();
  const isNotebook = fileName.endsWith('.ipynb');
  const isZip = fileName.endsWith('.zip');
  const isSkeleton = fileName.includes('template-task') || fileName.includes('skeleton');
  
  const icon = isNotebook ? '📓' : isZip ? '📦' : '📄';
  const label = isNotebook ? 'Jupyter Notebook' : isZip ? 'ZIP Archive' : 'PDF Document';

  const handleDownloadClick = () => {
    if (posthog) {
      // Use specific event for skeleton, generic for other downloads
      const eventName = isSkeleton ? 'skeleton_downloaded' : 'docs_file_downloaded';
      posthog.capture(eventName, {
        file_name: fileName,
        file_title: title || fileName,
        file_type: label,
        source: 'docs',
      });
    }
  };
  
  return (
    <div className="pdf-download">
      <div className="pdf-download-icon">{icon}</div>
      <div className="pdf-download-info">
        <span className="pdf-download-title">{title || fileName}</span>
        <span className="pdf-download-type">{label}</span>
      </div>
      <a 
        href={fileSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="pdf-download-button"
        download={isNotebook || isZip ? fileName : undefined}
        onClick={handleDownloadClick}
      >
        {isNotebook || isZip ? 'Download' : 'View / Download'}
      </a>
    </div>
  );
}

export default PdfDownload;
