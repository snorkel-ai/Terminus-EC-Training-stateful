import { useNavigate } from 'react-router-dom';
import './Videos.css';
import './Content.css';

function EnvironmentSetup() {
  const navigate = useNavigate();
  
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Environment Setup</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Environment Setup</h1>
        <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          <p style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#475569' }}>
            Set up your development environment to get started with the Terminus EC project.
          </p>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EnvironmentSetup;

