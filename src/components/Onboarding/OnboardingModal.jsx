import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
            Join the initiative to push the boundaries of AI capabilities through complex coding challenges.
          </p>
        </div>
      )
    },
    // Step 1: Purpose
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>Our Mission</h2>
          <p className="onboarding-description">
            We are building the definitive benchmark for AI coding agents. Your contribution helps measure and improve how artificial intelligence handles real-world software development tasks.
          </p>
          
          <div className="purpose-grid">
            <div className="purpose-card">
              <span className="purpose-icon">🔨</span>
              <h3>Create Tasks</h3>
              <p>Design challenges that require reasoning, not just autocomplete.</p>
            </div>
            <div className="purpose-card">
              <span className="purpose-icon">🤖</span>
              <h3>Beat the Models</h3>
              <p>Craft scenarios that stump current SOTA models to drive progress.</p>
            </div>
          </div>
        </div>
      )
    },
    // Step 2: Resources
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>Get Equipped</h2>
          <p className="onboarding-description">
            Before you start, familiarize yourself with our tools and standards.
          </p>

          <div className="resources-layout">
            <div className="video-preview-list">
              <h4>Essential Watch List</h4>
              <div className="video-preview-item" onClick={() => window.open('/videos', '_blank')}>
                <div className="play-icon">▶</div>
                <div className="video-info">
                  <h4>Creating a Task</h4>
                  <span>The fundamentals of task design</span>
                </div>
              </div>
              <div className="video-preview-item" onClick={() => window.open('/videos', '_blank')}>
                <div className="play-icon">▶</div>
                <div className="video-info">
                  <h4>Running your task</h4>
                  <span>Testing and verification flow</span>
                </div>
              </div>
            </div>

            <div className="docs-card">
              <h4 style={{ marginBottom: '20px' }}>Quick Reference</h4>
              <a href="/guidelines" target="_blank" className="docs-link">
                Guidelines & Standards <span>→</span>
              </a>
              <a href="/faq" target="_blank" className="docs-link">
                Common Questions <span>→</span>
              </a>
              <a href="/glossary" target="_blank" className="docs-link">
                Glossary <span>→</span>
              </a>
            </div>
          </div>
        </div>
      )
    },
    // Step 3: Ready
    {
      content: (
        <div className="onboarding-step-content" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '32px' }}>🚀</div>
          <h2 className="onboarding-title" style={{ fontSize: '48px', textAlign: 'center' }}>
            Ready to Launch?
          </h2>
          <p className="onboarding-description" style={{ margin: '0 auto 40px', textAlign: 'center' }}>
            You're now part of the team. Let's start building the future of AI evaluation.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="onboarding-modal-overlay">
      <div className="onboarding-modal-content">
        {/* Skip button - Top Right */}
        {step === 0 && (
          <button className="btn-skip-top" onClick={handleComplete}>
            Skip Onboarding
          </button>
        )}

        {/* Dynamic Step Content */}
        <div className="onboarding-step-container" key={step}>
          {steps[step].content}
        </div>

        {/* Navigation Footer */}
        <div className="onboarding-nav">
          <div className="step-indicators">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`step-dot ${index === step ? 'active' : ''} ${index < step ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="nav-buttons">
            {step > 0 && (
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            
            {step < steps.length - 1 ? (
              <button className="btn-primary" onClick={handleNext}>
                {step === 0 ? 'Start Onboarding' : 'Next Step'}
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleComplete}
                disabled={isClosing}
              >
                {isClosing ? 'Setting up...' : "Let's Get Started"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
