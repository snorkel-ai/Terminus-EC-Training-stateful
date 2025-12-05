import './PdfDownload.css';

/**
 * A download button/card for PDF files and other downloadables.
 * 
 * Usage in markdown:
 * <pdf-download src="/path/to/file.pdf" title="Download Slides" />
 */

function PdfDownload({ src, title }) {
  const fileName = src.split('/').pop();
  const isNotebook = fileName.endsWith('.ipynb');
  const isZip = fileName.endsWith('.zip');
  
  const icon = isNotebook ? '📓' : isZip ? '📦' : '📄';
  const label = isNotebook ? 'Jupyter Notebook' : isZip ? 'ZIP Archive' : 'PDF Document';
  
  return (
    <div className="pdf-download">
      <div className="pdf-download-icon">{icon}</div>
      <div className="pdf-download-info">
        <span className="pdf-download-title">{title || fileName}</span>
        <span className="pdf-download-type">{label}</span>
      </div>
      <a 
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="pdf-download-button"
        download={isNotebook || isZip ? fileName : undefined}
      >
        {isNotebook || isZip ? 'Download' : 'View / Download'}
      </a>
    </div>
  );
}

export default PdfDownload;
