import { useNavigate } from 'react-router-dom';
import { FiBook, FiVideo, FiHelpCircle, FiFileText } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import TaskPreviewSection from './TaskPreviewSection';
import { Card, Button } from './ui';
import './LandingPage.css';

function LandingPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const displayName = profile?.first_name || profile?.github_username || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const resources = [
    { 
      icon: FiBook, 
      label: 'Getting started guide', 
      description: 'Essential guides to get you started',
      path: '/portal/onboarding',
      buttonText: 'Read guide'
    },
    { 
      icon: FiVideo, 
      label: 'Walkthrough videos', 
      description: 'Step-by-step visual tutorials',
      path: '/portal/videos',
      buttonText: 'Watch videos'
    },
    { 
      icon: FiHelpCircle, 
      label: 'FAQ', 
      description: 'Common questions answered',
      path: '/portal/faq',
      buttonText: 'Find answers'
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
                  variant="flat"
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
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="resource-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(resource.path);
                      }}
                    >
                      {resource.buttonText}
                    </Button>
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
