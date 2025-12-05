import { useNavigate } from 'react-router-dom';
import CompletionToggle from './Progress/CompletionToggle';
import './Videos.css';
import './Workbook.css';

const baseUrl = import.meta.env.BASE_URL;

function FeedbackSlides() {
  const navigate = useNavigate();

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Feedback Slides</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Feedback Slides</h1>
        <div className="workbook-intro">
          <p>
            Access feedback presentation slides to learn about common issues and best practices.
          </p>
        </div>
        
        <div className="workbook-resources">
          <div className="download-card">
            <div className="download-icon">📄</div>
            <h3>Feedback 10/31</h3>
            <p>Feedback slides from October 31st</p>
            <a 
              href={`${baseUrl}Feedback%2010_31.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="download-button"
            >
              View/Download PDF
            </a>
          </div>
          
          <div className="download-card">
            <div className="download-icon">📄</div>
            <h3>Feedback 11/3</h3>
            <p>Feedback slides from November 3rd</p>
            <a 
              href={`${baseUrl}Feedback%2011_3.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="download-button"
            >
              View/Download PDF
            </a>
          </div>
        </div>

        <div className="workbook-actions">
          <CompletionToggle itemId="resource-feedback" />
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FeedbackSlides;
