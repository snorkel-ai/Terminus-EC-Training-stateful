import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { FiArrowRight, FiCheck, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, Button } from './index';
import './OnboardingResources.css';

const baseUrl = import.meta.env.BASE_URL;

// Map resource IDs to progress_items IDs in Supabase
const PROGRESS_ID_MAP = {
  'onboarding-platform': 'onboarding-tile-platform',
  'task-skeleton': 'onboarding-tile-skeleton',
  'submission-platform': 'onboarding-tile-submission-platform',
  'great-tasks': 'onboarding-tile-great-tasks',
  'video-walkthroughs': 'onboarding-tile-videos',
};

const OnboardingResources = () => {
  const { isCompleted, toggleCompletion } = useProgress();
  const { success } = useToast();
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [closingCards, setClosingCards] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const resources = [
    { 
      id: 'onboarding-platform',
      label: 'Platform Onboarding', 
      description: 'New to Snorkel? Watch the onboarding video and download the slides to get familiar with the Expert Platform interface.',
      path: '/portal/docs/onboarding/platform-onboarding',
      image: `${baseUrl}images/onboarding_platform.png`,
    },
    { 
      id: 'task-skeleton',
      label: 'Download Task Skeleton', 
      description: 'Get the starter files you need to build your task, including the directory structure and required configuration files.',
      path: `${baseUrl}template-task.zip`,
      image: `${baseUrl}images/onboardiing_download_skeleton.png`,
      isDownload: true,
    },
    { 
      id: 'submission-platform',
      label: 'Platform Submissions', 
      description: 'Ready to submit? Follow our walkthrough to package your task, upload it to the platform, and track your submission through review.',
      path: '/portal/docs/submitting-tasks/platform-submission',
      image: `${baseUrl}images/onboarding_submit_task2.png`,
    },
    { 
      id: 'great-tasks',
      label: 'What Makes Great TerminalBench Tasks', 
      description: 'Discover the key ingredients that make tasks challenging, realistic, and valuable for training AI agents. Learn patterns to follow and pitfalls to avoid.',
      path: '/portal/docs/understanding-tasks/what-makes-a-good-task',
      image: `${baseUrl}images/onboarding_great_tb_task.png`,
    },
    { 
      id: 'video-walkthroughs',
      label: 'Video Walkthroughs', 
      description: 'Watch step-by-step videos showing how to create tasks, write solutions, and run tests. Perfect for visual learners.',
      path: '/portal/docs/creating-tasks/videos/creating-task',
      image: `${baseUrl}images/onboarding_videos.png`,
    },
  ];

  // Check completion status from Supabase via ProgressContext
  const getCompletedCards = () => {
    return resources
      .filter(r => isCompleted(PROGRESS_ID_MAP[r.id]))
      .map(r => r.id);
  };

  const completedCards = getCompletedCards();
  const visibleResources = resources.filter(r => !completedCards.includes(r.id) && !closingCards.includes(r.id));
  
  // If all completed, we can return null to hide the section
  if (completedCards.length === resources.length) {
    return null;
  }

  const handleMarkAllComplete = async () => {
    if (isMarkingAll) return;
    setIsMarkingAll(true);
    
    try {
      const incompleteResources = resources
        .filter(r => !isCompleted(PROGRESS_ID_MAP[r.id]));
      const incompleteIds = incompleteResources.map(r => r.id);

      // Track each step completion for funnel accuracy
      if (posthog && incompleteResources.length > 0) {
        incompleteResources.forEach(resource => {
          posthog.capture('onboarding_step_completed', {
            resource_id: resource.id,
            resource_label: resource.label,
            source: 'mark_all_complete',
          });
        });
        
        // Also fire a summary event
        posthog.capture('onboarding_all_completed', {
          resources_completed: incompleteResources.map(r => r.id),
          count: incompleteResources.length,
        });
      }

      // Animate all cards closing
      setClosingCards(prev => [...prev, ...incompleteIds]);

      // Wait for animation then toggle all
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const promises = incompleteIds.map(id => 
        toggleCompletion(PROGRESS_ID_MAP[id])
      );
      
      await Promise.all(promises);
      success('All onboarding tasks marked as complete!');
    } catch (error) {
      console.error('Error marking all complete:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const markComplete = async (e, id) => {
    e.stopPropagation();
    const progressId = PROGRESS_ID_MAP[id];
    const resource = resources.find(r => r.id === id);
    
    // Track onboarding progress
    if (posthog && resource) {
      posthog.capture('onboarding_step_completed', {
        resource_id: id,
        resource_label: resource.label,
        source: 'individual_card',
      });
    }
    
    // Start closing animation
    setClosingCards(prev => [...prev, id]);
    
    // After animation completes, save to Supabase
    setTimeout(async () => {
      await toggleCompletion(progressId);
      setClosingCards(prev => prev.filter(cardId => cardId !== id));
      success('Progress saved!');
    }, 300);
  };

  const handleResourceClick = (resource) => {
    // Track resource view/download
    if (posthog) {
      posthog.capture(resource.isDownload ? 'skeleton_downloaded' : 'docs_viewed', {
        resource_id: resource.id,
        resource_label: resource.label,
      });
    }

    if (resource.isDownload) {
      const link = document.createElement('a');
      link.href = resource.path;
      link.download = resource.path.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      navigate(resource.path);
    }
  };

  return (
    <section className="get-started-section">
      <div className="section-header-row">
        <h2 className="section-header">Onboarding Starter Kit</h2>
        <Button 
          variant="ghost" 
          onClick={handleMarkAllComplete}
          disabled={isMarkingAll}
          className="mark-all-complete-btn"
        >
          Hide onboarding
        </Button>
      </div>
      <div className={`resources-grid cards-${visibleResources.length}`}>
        {visibleResources.map((resource) => (
          <Card 
            key={resource.id} 
            variant="minimal"
            hoverable
            className={`resource-card-rich ${closingCards.includes(resource.id) ? 'card-closing' : ''}`}
            onClick={() => handleResourceClick(resource)}
          >
            <div className="resource-preview">
              {resource.image ? (
                <img src={resource.image} alt={resource.label} className="resource-image" />
              ) : (
                <div className="image-placeholder">
                  <span className="preview-placeholder-text">{resource.isDownload ? 'Download Skeleton' : 'Card cover image here'}</span>
                </div>
              )}
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
                  handleResourceClick(resource);
                }}
              >
                {resource.isDownload ? (
                  <>Download <FiDownload /></>
                ) : (
                  <>Learn more <FiArrowRight /></>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default OnboardingResources;
