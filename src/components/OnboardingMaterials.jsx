import './Videos.css';
import './Workbook.css';

function OnboardingMaterials({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Onboarding Video and Slides</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Onboarding Video and Slides</h1>
        <div className="workbook-intro">
          <p>
            Access the onboarding presentation slides and watch the onboarding video to get started with the Terminus EC project.
          </p>
        </div>
        
        <div className="workbook-resources">
          <div className="download-card">
            <div className="download-icon">📄</div>
            <h3>Onboarding Slides</h3>
            <p>Download or view the onboarding presentation slides</p>
            <a 
              href="/Terminus-EC-Training/Terminus%20EC%20Onboarding.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="download-button"
            >
              View/Download PDF
            </a>
          </div>
          
          <div className="video-card">
            <h3 className="video-card-title">Onboarding Video</h3>
            <div className="video-wrapper">
              <video
                controls
                preload="metadata"
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
                <source src="/Terminus-EC-Training/Onboarding_11-14-2025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default OnboardingMaterials;

