import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Checklist.css';

const Checklist = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Derived state for "Set up your profile"
  const hasBio = !!profile?.bio;
  const hasSkills = profile?.specialties && profile.specialties.length > 0;
  const hasGithub = !!profile?.github_username;
  const hasLinkedin = !!profile?.linkedin_url;
  const isProfileSetup = hasBio && hasSkills && hasGithub && hasLinkedin;

  const items = [
    {
      id: 'welcome',
      label: 'Complete welcome onboarding',
      isCompleted: profile?.onboarding_completed,
      action: () => {}, // No action, handled by initial flow
      cta: 'Completed',
      disabled: true
    },
    {
      id: 'profile',
      label: 'Set up your profile',
      sublabel: '(Add bio, skills, socials, etc.)',
      isCompleted: isProfileSetup,
      action: () => navigate('/portal/profile'),
      cta: 'Update Profile'
    },
    {
      id: 'slack',
      label: 'Join the Slack community',
      sublabel: '(Get support & announcements)',
      isCompleted: profile?.slack_joined,
      action: async () => {
        window.open('https://snorkel-team.enterprise.slack.com/archives/C09MNJL1203', '_blank');
        await updateProfile({ slack_joined: true });
      },
      cta: 'Join Slack'
    },
    {
      id: 'payments',
      label: 'Set up payments',
      sublabel: '(Required to get paid)',
      isCompleted: profile?.payments_setup,
      action: async () => {
        const confirmed = window.confirm("Have you set up your payment details in HireArt?");
        if (confirmed) {
          await updateProfile({ payments_setup: true });
        } else {
           navigate('/portal/guideline-rates');
        }
      },
      cta: 'Setup Payments'
    },
    {
      id: 'devenv',
      label: 'Set up your dev environment',
      sublabel: '(Tools, CLI, example tasks)',
      isCompleted: profile?.dev_env_setup,
      action: async () => {
        navigate('/portal/guideline-workflow');
        const confirmed = window.confirm("Have you completed the environment setup?");
        if (confirmed) {
           await updateProfile({ dev_env_setup: true });
        }
      },
      cta: 'View Guide'
    }
  ];

  const completedCount = items.filter(i => i.isCompleted).length;
  const remainingCount = items.length - completedCount;
  
  if (completedCount === items.length) {
     return null;
  }

  const titleText = `You have ${remainingCount} task${remainingCount === 1 ? '' : 's'} outstanding before you can get started`;

  return (
    <div className={`checklist-container ${!isExpanded ? 'collapsed' : ''}`}>
      <div className="checklist-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="checklist-icon">
          {/* Clipboard/Checklist Icon similar to the Book icon style */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M9 14l2 2 4-4"></path>
          </svg>
        </div>
        
        <div className="checklist-header-content">
          <span className="checklist-label-small">GET STARTED</span>
          <h3 className="checklist-title">{titleText}</h3>
        </div>

        <div className="checklist-header-action">
          <svg 
            className={`chevron-icon ${isExpanded ? 'expanded' : ''}`} 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="checklist-content-wrapper">
            <div className="checklist-items">
                {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`checklist-item ${item.isCompleted ? 'completed' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="checklist-checkbox"></div>
                    <div className="checklist-text">
                    <div className="checklist-label">{item.label}</div>
                    {item.sublabel && <div className="checklist-sublabel">{item.sublabel}</div>}
                    </div>
                    <div className="checklist-item-action">
                    {!item.isCompleted && !item.disabled && (
                        <button className="checklist-btn" onClick={(e) => { e.stopPropagation(); item.action(); }}>
                        {item.cta}
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
