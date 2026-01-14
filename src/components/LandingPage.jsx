import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useAuth } from '../contexts/AuthContext';
import MyTasksSection from './MyTasksSection';
import IncentivesSection from './IncentivesSection';
import { OnboardingResources } from './ui';
import './LandingPage.css';
import './Content.css';

function LandingPage() {
  const { user, profile } = useAuth();
  const posthog = usePostHog();

  // Track landing page view for funnel analysis
  useEffect(() => {
    if (posthog) {
      posthog.capture('landing_page_viewed', {
        has_profile: !!profile,
        has_github_username: !!profile?.github_username,
      });
    }
  }, [posthog]);
  
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

        <MyTasksSection />

        <IncentivesSection />

        <OnboardingResources />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
