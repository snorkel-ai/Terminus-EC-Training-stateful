import { useNavigate } from 'react-router-dom';
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
        <div className="videos-logo">Office Hours Videos and Slides</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Office Hours Videos and Slides</h1>
        <div className="workbook-intro">
          <p>
            Access Office Hours videos and feedback presentation slides to learn about common issues and best practices.
          </p>
        </div>
        
        <div className="workbook-resources">
          <div className="video-card">
            <h3 className="video-card-title">Office Hours 11/12</h3>
            <div className="video-wrapper">
              <video
                controls
                className="video-iframe"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              >
                <source src="/Terminus-EC-Training/video1344882306.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
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
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FeedbackSlides;

