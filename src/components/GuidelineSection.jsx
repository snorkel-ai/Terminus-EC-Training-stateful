import { useNavigate } from 'react-router-dom';
import './GuidelineSection.css';
import Content from './Content';

function GuidelineSection({ section }) {
  const navigate = useNavigate();
  
  if (!section) return null;

  return (
    <div className="guideline-section-page">
      <header className="guideline-section-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="section-logo">{section.title}</div>
      </header>
      
      <main className="guideline-section-main">
        <Content section={section} />
      </main>

      <footer className="guideline-section-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default GuidelineSection;

