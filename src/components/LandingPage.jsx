import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiRotateCcw } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import TaskPreviewSection from './TaskPreviewSection';
import { Card, Button } from './ui';
import './LandingPage.css';

function LandingPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [completedCards, setCompletedCards] = useState([]);
  const [closingCards, setClosingCards] = useState([]);
  
  const displayName = profile?.first_name || profile?.github_username || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const resources = [
    { 
      id: 'onboarding-platform',
      label: 'Platform Onboarding', 
      description: 'New to Snorkel? Watch the onboarding video and download the slides to get familiar with the Expert Platform interface.',
      path: '/portal/expert-platform-onboarding',
    },
    { 
      id: 'onboarding-github',
      label: 'GitHub Onboarding', 
      description: 'Prefer working with Git? Set up your local environment, clone the repo, and configure your CLI tools for the GitHub workflow.',
      path: '/portal/github-onboarding',
    },
    { 
      id: 'submission-platform',
      label: 'Platform Submissions', 
      description: 'Ready to submit? Follow our walkthrough to package your task, upload it to the platform, and track your submission through review.',
      path: '/portal/expert-platform-walkthrough',
    },
    { 
      id: 'submission-github',
      label: 'GitHub Submissions', 
      description: 'Create a branch, push your task, and open a pull request. Learn how to navigate CI checks and iterate on reviewer feedback.',
      path: '/portal/github-submission-walkthrough',
    },
    { 
      id: 'great-tasks',
      label: 'What Makes Great TerminalBench Tasks', 
      description: 'Discover the key ingredients that make tasks challenging, realistic, and valuable for training AI agents. Learn patterns to follow and pitfalls to avoid.',
      path: '/portal/guidelines',
    },
  ];
  
  const visibleResources = resources.filter(r => !completedCards.includes(r.id));
  
  const markComplete = (e, id) => {
    e.stopPropagation();
    // Start closing animation
    setClosingCards(prev => [...prev, id]);
    // After animation completes, actually remove the card
    setTimeout(() => {
      setCompletedCards(prev => [...prev, id]);
      setClosingCards(prev => prev.filter(cardId => cardId !== id));
    }, 300);
  };
  
  const resetAll = () => {
    setCompletedCards([]);
    setClosingCards([]);
  };

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
          <div className="section-header-row">
            <h2 className="section-header">Get Started</h2>
            {completedCards.length > 0 && (
              <button className="reset-button" onClick={resetAll}>
                <FiRotateCcw /> Reset all
              </button>
            )}
          </div>
          <div className={`resources-grid cards-${visibleResources.length}`}>
            {visibleResources.map((resource) => (
              <Card 
                key={resource.id} 
                variant="minimal"
                hoverable
                className={`resource-card-rich ${closingCards.includes(resource.id) ? 'card-closing' : ''}`}
                onClick={() => navigate(resource.path)}
              >
                <div className="resource-preview">
                  <div className="image-placeholder">
                    <span className="preview-placeholder-text">Card cover image here</span>
                  </div>
                  <div className="preview-gradient"></div>
                </div>
                <div className="resource-body">
                  <h3 className="resource-title">{resource.label}</h3>
                  <p className="resource-description">{resource.description}</p>
                </div>
                <div className="resource-footer">
                  <button 
                    className="mark-complete-link"
                    onClick={(e) => markComplete(e, resource.id)}
                  >
                    <FiCheck /> Mark complete
                  </button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(resource.path);
                    }}
                  >
                    Learn more <FiArrowRight />
                  </Button>
                </div>
              </Card>
            ))}
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
