import './Videos.css';
import './Content.css';

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
        <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Oracle Agent</h3>
            <p style={{ marginBottom: 0 }}>
              Agent that is run in created environment to check the solution implemented in the solution.sh file. 
              Checks that the solution runs correctly and without bugs, and tests the output of the solution against 
              the created pytests to ensure that the solution passes.
            </p>
          </div>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Glossary;

