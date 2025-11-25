import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Checklist.css';

const Checklist = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
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
      sublabel: '(Add bio, skills, GitHub, LinkedIn)',
      isCompleted: isProfileSetup,
      action: () => setIsProfileModalOpen(true),
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
        // Placeholder for payment setup - maybe link to an external system or just a confirmation
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
        // We don't auto-complete this one, maybe user has to mark it done manually?
        // Or we show a "Mark as Done" button in the row if they visited?
        // For now, let's toggle it.
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
  const progressText = remainingCount === 0 
    ? 'All completed' 
    : `${remainingCount} step${remainingCount === 1 ? '' : 's'} remaining`;

  if (completedCount === items.length && !isExpanded) {
    return null;
  }

  return (
    <div className={`checklist-container ${!isExpanded ? 'collapsed' : ''}`}>
      <div className="checklist-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <h3>Onboarding Checklist</h3>
          <div className="progress-summary">
             {progressText}
          </div>
        </div>
        <div className="header-right">
           <button className="toggle-btn">
             {isExpanded ? 'Hide' : 'Show'}
           </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="checklist-content-wrapper">
            <div className="checklist-items">
                {items.map((item) => (
                <div key={item.id} className={`checklist-item ${item.isCompleted ? 'completed' : ''}`}>
                    <div className="checklist-checkbox"></div>
                    <div className="checklist-text">
                    <div className="checklist-label">{item.label}</div>
                    {item.sublabel && <div className="checklist-sublabel">{item.sublabel}</div>}
                    </div>
                    <div className="checklist-action">
                    {!item.isCompleted && !item.disabled && (
                        <button className="checklist-btn" onClick={item.action}>
                        {item.cta}
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>
      )}

      {/* Simple Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal 
          profile={profile} 
          updateProfile={updateProfile} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}
    </div>
  );
};

const ProfileModal = ({ profile, updateProfile, onClose }) => {
  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    linkedin_url: profile?.linkedin_url || '',
    github_username: profile?.github_username || '',
    specialties: profile?.specialties || []
  });
  const [loading, setLoading] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecialtyAdd = (e) => {
    if (e.key === 'Enter' && specialtyInput.trim()) {
      e.preventDefault();
      if (!formData.specialties.includes(specialtyInput.trim())) {
        setFormData(prev => ({
          ...prev,
          specialties: [...prev.specialties, specialtyInput.trim()]
        }));
      }
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (s) => {
    setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(item => item !== s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Update Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input 
              type="url" 
              name="linkedin_url" 
              value={formData.linkedin_url} 
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="form-group">
            <label>GitHub Username</label>
            <input 
              type="text" 
              name="github_username" 
              value={formData.github_username} 
              onChange={handleChange}
              disabled // Usually comes from auth
            />
          </div>
          <div className="form-group">
            <label>Skills (Press Enter to add)</label>
            <div className="tags-input">
                {formData.specialties.map(s => (
                    <span key={s} className="tag">
                        {s} <button type="button" onClick={() => removeSpecialty(s)}>×</button>
                    </span>
                ))}
                <input 
                    type="text" 
                    value={specialtyInput}
                    onChange={e => setSpecialtyInput(e.target.value)}
                    onKeyDown={handleSpecialtyAdd}
                    placeholder="Add a skill..."
                />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checklist;

