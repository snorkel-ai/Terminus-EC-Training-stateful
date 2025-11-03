import './Videos.css';

function OracleTraining({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Oracle Training</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Oracle Training</h1>
        <div className="videos-subtitle">
          <p><strong>This video covers:</strong></p>
          <ol>
            <li>What the Oracle Agent is</li>
            <li>How to run it</li>
            <li>How to debug its output</li>
            <li>How to submit a debugged task</li>
          </ol>
        </div>
        
        <div className="videos-grid">
          <div className="video-card">
            <h3 className="video-card-title">Oracle Training Tutorial</h3>
            <div className="video-wrapper">
              <iframe
                src="https://www.loom.com/embed/72b70216a5314068823bc6ed0350e672?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                frameBorder="0"
                allowFullScreen
                className="video-iframe"
                title="Oracle Training Tutorial"
              ></iframe>
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

export default OracleTraining;

