import { useAuth } from '../contexts/AuthContext';
import slackLogo from '../assets/slack.webp';
import TaskPreviewSection from './TaskPreviewSection';
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
          <p className="welcome-cta">Ready for your next challenge?</p>
        </section>

        <TaskPreviewSection />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
