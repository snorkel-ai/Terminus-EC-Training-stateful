import { useAuth } from '../contexts/AuthContext';
import slackLogo from '../assets/slack.webp';
import Checklist from './Landing/Checklist';
import './LandingPage.css';

function LandingPage() {
  const { user, profile } = useAuth();
  
  const displayName = profile?.first_name || profile?.github_username || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="landing-page">
      <main className="main-content">
        <section className="welcome-strip">
          <h1 className="welcome-title">Hello, {displayName} <span className="wave">👋</span></h1>
          <p className="welcome-subtitle">Welcome to the community advancing agentic development.</p>
          <p className="welcome-cta">Let's get you ready to take on your next challenge</p>
          <a 
            href="https://snorkel-team.enterprise.slack.com/archives/C09MNJL1203" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="slack-button"
          >
            <img src={slackLogo} alt="Slack" className="slack-icon" />
            Open our Slack community
          </a>
        </section>

        <Checklist />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
