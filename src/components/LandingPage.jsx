import { useNavigate } from 'react-router-dom';
import { FiBook, FiVideo, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import TaskPreviewSection from './TaskPreviewSection';
import { Card, ActionLink } from './ui';
import './LandingPage.css';

function LandingPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const displayName = profile?.first_name || profile?.github_username || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const resources = [
    { 
      icon: FiBook, 
      label: 'Getting Started - Snorkel Expert Platform', 
      description: 'Essential guides to setup your environment and get you working on your first task.',
      path: '/portal/expert-platform-onboarding',
      linkText: 'Read guide'
    },
    { 
      icon: FiBook, 
      label: 'Getting Started - GitHub Repo', 
      description: 'Essential guides to setup your environment and get you working on your first task.',
      path: '/portal/github-onboarding',
      linkText: 'Read guide'
    },
    { 
      icon: FiVideo, 
      label: 'Expert Platform Submission Walkthrough', 
      description: 'Step-by-step guide for submitting tasks on the Snorkel Expert Platform.',
      path: '/portal/expert-platform-walkthrough',
      linkText: 'View walkthrough'
    },
    { 
      icon: FiVideo, 
      label: 'GitHub Submission Walkthrough', 
      description: 'Step-by-step guide for submitting tasks via GitHub pull requests.',
      path: '/portal/github-submission-walkthrough',
      linkText: 'View walkthrough'
    },
  ];

  return (
    <div className="landing-page">
      <main className="main-content">
        <section className="welcome-strip">
          <div className="welcome-content">
            <h1 className="welcome-title">Hello, {displayName} <span className="wave">👋</span></h1>
            <p className="welcome-subtitle">Welcome to the community advancing agentic development.</p>
          </div>
        </section>

        <section className="get-started-section">
          <h2 className="section-header">Get Started</h2>
          <div className="resources-grid">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card 
                  key={index} 
                  variant="minimal"
                  padding="lg"
                  hoverable
                  className="resource-card"
                  onClick={() => navigate(resource.path)}
                >
                  <div className="resource-icon-wrapper">
                    <Icon className="resource-icon" />
                  </div>
                  <div className="resource-content">
                    <h3 className="resource-title">{resource.label}</h3>
                    <p className="resource-description">{resource.description}</p>
                  </div>
                  <div className="resource-action">
                    <ActionLink>{resource.linkText}</ActionLink>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

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
