import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, StepIndicator } from '../ui';
import slackLogo from '../../assets/slack.webp';
import './OnboardingModal.css';

const OnboardingModal = () => {
  const { profile, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // If profile isn't loaded or onboarding is already complete, don't render
  if (!profile || profile.onboarding_completed) return null;

  const handleNext = () => {
    setStep(prev => prev + 1);
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
            <div className="tbench-logo-onboarding">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" x2="20" y1="19" y2="19"></line>
              </svg>
              <span>terminal-bench</span>
            </div>
            <span className="logo-separator">×</span>
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
    // Step 1: Purpose
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>Outsmart the machines.</h2>
          <p className="onboarding-description">
          Help push AI to its limits by creating real engineering challenges that today’s best models still fail. 
          Every accepted task advances agentic development, and earns you a payout.
          </p>
          
          <h3 className="onboarding-section-title">
            Your goals:
          </h3>

          <div className="purpose-grid">
            <div className="purpose-card">
              <span className="purpose-icon">🔨</span>
              <h3>Build problems that stump frontier agents.</h3>
              <p>Real reasoning. Multi-step execution. No toy problems..</p>
            </div>
            <div className="purpose-card">
              <span className="purpose-icon">💰</span>
              <h3>Earn payouts</h3>
              <p>Get paid for every task that gets accepted.</p>
            </div>
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

          <div className="next-steps-list" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div className="next-step-card" style={{ cursor: 'default', maxWidth: '480px', textAlign: 'center', alignItems: 'center' }}>
              <div className="next-step-icon" style={{ overflow: 'hidden', padding: '0', backgroundColor: 'transparent', width: '64px', height: '64px', marginBottom: '16px' }}>
                <img 
                  src={slackLogo}
                  alt="Slack" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="next-step-content" style={{ marginBottom: '24px' }}>
                <h4 className="next-step-title" style={{ fontSize: '24px', marginBottom: '12px' }}>Join the Community</h4>
                <span className="next-step-subtitle" style={{ fontSize: '16px' }}>
                  Connect with other TerminalBench contributors, Snorkelers, get help with tasks, and stay updated on the latest announcements.
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
                Join Slack Channel
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
        {/* Skip button - Top Right */}
        {step === 0 && (
          <Button variant="ghost" size="sm" className="btn-skip-top" onClick={handleComplete}>
            Skip Onboarding
          </Button>
        )}

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
              <Button variant="primary" size="lg" onClick={handleNext}>
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
