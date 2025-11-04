import './Videos.css';

function Glossary({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Glossary</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Glossary</h1>
        <div className="videos-subtitle">
          <p style={{ fontSize: '1.5rem', color: '#64748b', marginTop: '3rem' }}>
            Coming Soon
          </p>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Glossary;

