import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, StepIndicator, Input } from '../ui';
import slackLogo from '../../assets/slack.webp';
import './OnboardingModal.css';

const OnboardingModal = () => {
  const { profile, completeOnboarding, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [githubUsername, setGithubUsername] = useState(profile?.github_username || '');
  const [isSaving, setIsSaving] = useState(false);

  // If profile isn't loaded or onboarding is already complete, don't render
  if (!profile || profile.onboarding_completed) return null;

  const handleNext = async () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !githubUsername.trim()) return;
      
      setIsSaving(true);
      try {
        const { error } = await updateProfile({ 
          first_name: firstName, 
          last_name: lastName,
          github_username: githubUsername
        });
        if (error) throw error;
        setStep(prev => prev + 1);
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Could show an error toast here
      } finally {
        setIsSaving(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setIsClosing(true);
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsClosing(false);
    }
  };

  const steps = [
    // Step 0: Welcome
    {
      content: (
        <div className="onboarding-step-content">
          <div className="onboarding-logos">
            <img 
              src="https://s46486.pcdn.co/wp-content/uploads/2023/05/snorkel_logo_header-1.svg" 
              alt="Snorkel" 
              className="snorkel-logo-onboarding"
            />
          </div>
          
          <h1 className="onboarding-title" style={{ marginBottom: '8px' }}>
            Welcome to TerminalBench.
          </h1>
          <p style={{ 
            fontSize: '36px', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            marginBottom: '32px',
            lineHeight: '1.2',
            opacity: 0.9
          }}>
            We’re really glad you’re here.
          </p>
          <p className="onboarding-subtitle">
            You've made the right choice to join the community of experts pushing the boundaries of agentic coding through coding challenges.
          </p>
        </div>
      )
    },
    // Step 1: Your Details
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>Outsmart the machines.</h2>
          <p className="onboarding-description">
          Help push AI to its limits by creating real engineering challenges that today’s best models still fail. 
          Every accepted task advances agentic development, and earns you a payout.
          </p>
          
          <h3 className="onboarding-section-title">
            Your details:
          </h3>

          <div style={{ marginTop: '32px', textAlign: 'left', maxWidth: '400px', margin: '32px auto 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Input
                label="First Name"
                placeholder="e.g. Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
              />
              <Input
                label="Last Name"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            
            <Input
              label="GitHub Username"
              placeholder="e.g. janedoe"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              helperText="We use this to verify your contributions and link to your GitHub profile."
            />
            
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
              We use these details to match your profile with our internal systems and process payouts.
            </p>
          </div>
        </div>
      )
    },
    // Step 2: Resources
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>
            <span role="img" aria-label="celebration" style={{ color: '#FFD700' }}>🎉</span> You’re all set.
          </h2>
          <p className="onboarding-description">
            You’re now part of a global community pushing the boundaries of agentic AI. Let’s get you plugged-in and ready to make an impact.
          </p>

          <h3 className="onboarding-section-title" style={{ marginTop: '40px', marginBottom: '24px' }}>
            What’s next?
          </h3>

          <div className="next-steps-list" style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
            <div className="next-step-card" style={{ cursor: 'default', maxWidth: '400px', textAlign: 'center', alignItems: 'center', flex: 1 }}>
              <div className="next-step-icon" style={{ overflow: 'hidden', padding: '0', backgroundColor: 'transparent', width: '64px', height: '64px', marginBottom: '16px' }}>
                <img 
                  src={slackLogo}
                  alt="Slack" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="next-step-content" style={{ marginBottom: '24px' }}>
                <h4 className="next-step-title" style={{ fontSize: '24px', marginBottom: '12px' }}>Community</h4>
                <span className="next-step-subtitle" style={{ fontSize: '16px' }}>
                  Connect with other TerminalBench contributors and chat with the team.
                </span>
              </div>
              <Button 
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://snorkel-team.enterprise.slack.com/archives/C09MNJL1203', '_blank');
                }}
              >
                Join
              </Button>
            </div>

            <div className="next-step-card" style={{ cursor: 'default', maxWidth: '400px', textAlign: 'center', alignItems: 'center', flex: 1 }}>
              <div className="next-step-icon" style={{ overflow: 'hidden', padding: '0', backgroundColor: 'transparent', width: '64px', height: '64px', marginBottom: '16px' }}>
                <img 
                  src={slackLogo}
                  alt="Slack" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="next-step-content" style={{ marginBottom: '24px' }}>
                <h4 className="next-step-title" style={{ fontSize: '24px', marginBottom: '12px' }}>Announcements</h4>
                <span className="next-step-subtitle" style={{ fontSize: '16px' }}>
                  The single source of truth for important announcements, updates, etc.
                </span>
              </div>
              <Button 
                variant="secondary"
                size="lg"
                style={{ width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://snorkel-team.enterprise.slack.com/archives/C0A1WM7EPK4', '_blank');
                }}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="onboarding-modal-overlay">
      <div className="onboarding-modal-content">
        {/* Dynamic Step Content */}
        <div className="onboarding-step-container" key={step}>
          {steps[step].content}
        </div>

        {/* Navigation Footer */}
        <div className="onboarding-nav">
          <StepIndicator steps={steps.length} currentStep={step} />

          <div className="nav-buttons">
            {step > 0 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            
            {step < steps.length - 1 ? (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleNext}
                disabled={step === 1 && (!firstName.trim() || !lastName.trim() || !githubUsername.trim())}
                loading={step === 1 && isSaving}
              >
                {step === 0 ? 'Start Onboarding' : 'Next Step'}
              </Button>
            ) : (
              <Button 
                variant="primary"
                size="lg"
                onClick={handleComplete}
                loading={isClosing}
              >
                Start Building
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
