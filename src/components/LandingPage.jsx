import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TaskPreviewSection from './TaskPreviewSection';
import { Alert, OnboardingResources } from './ui';
import './LandingPage.css';
import './Content.css';

function LandingPage() {
  const { user, profile } = useAuth();
  
  const displayName = profile?.first_name || profile?.github_username || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="landing-page">
      <main className="main-content">
        <section className="welcome-strip">
          <div className="welcome-content">
            <h1 className="welcome-title">Hello, {displayName} <span className="wave">👋</span></h1>
            <p className="welcome-subtitle">Welcome to the community advancing agentic development.</p>
          </div>
          </section>

        <Alert variant="warning" className="announcement-banner">
          <strong>PLEASE DO NOT REACH OUT TO REVIEWERS DIRECTLY.</strong>
          <div style={{ marginTop: '0.5rem' }}>
            Reviews will be performed ASAP and messaging them will not increase the speed at which your submission is reviewed.
          </div>
        </Alert>

        <OnboardingResources />

        <section className="inspiration-section">
           <TaskPreviewSection />
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
