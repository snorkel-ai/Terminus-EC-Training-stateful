import { useNavigate } from 'react-router-dom';
import CompletionToggle from './Progress/CompletionToggle';
import './Videos.css';

const baseUrl = import.meta.env.BASE_URL;

function ExpertPlatformOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/portal')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Expert Platform Onboarding Materials</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Expert Platform Onboarding Materials</h1>
        <div className="workbook-intro">
          <p>
            Access the onboarding presentation slides and watch the onboarding video to get started with the Terminus EC project on the Snorkel Expert Platform.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          maxWidth: '800px', 
          margin: '0 auto',
          marginTop: '2rem'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: '12px', 
            padding: '2rem', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>
              Expert Platform Onboarding Materials
            </h3>
            
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <a 
                href={`${baseUrl}Terminus EC Onboarding - Platform.pdf`} 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  color: '#1e40af',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                }}
              >
                View/Download Onboarding Slides
              </a>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>
                Onboarding Video
              </h4>
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
                  <source src={`${baseUrl}platform_onboarding_11-25-2025.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0' }}>
          <CompletionToggle itemId="resource-expert-platform-onboarding" />
        </div>
      </main>
    </div>
  );
}

export default ExpertPlatformOnboarding;

