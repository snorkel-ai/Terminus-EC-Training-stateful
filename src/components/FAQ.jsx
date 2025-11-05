import { useNavigate } from 'react-router-dom';
import CompletionToggle from './Progress/CompletionToggle';
import './Videos.css';

function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="videos-logo">FAQ</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Frequently Asked Questions</h1>
        <div className="videos-subtitle">
          <p style={{ fontSize: '1.5rem', color: '#64748b', marginTop: '3rem' }}>
            Coming Soon
          </p>
        </div>

        <div className="workbook-actions">
          <CompletionToggle itemId="resource-faq" />
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FAQ;
