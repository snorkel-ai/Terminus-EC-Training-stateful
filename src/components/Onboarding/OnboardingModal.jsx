import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OnboardingModal.css';

const ALL_SPECIALTIES = [
  "Machine Learning", "Data Science", "Cyber Security", "Full Stack Web", 
  "System Design", "Cloud Infrastructure", "Algorithms", "Database Optimization",
  "Mobile Development", "Distributed Systems", "Frontend Architecture", "Backend Development",
  "Reverse Engineering", "Penetration Testing", "NLP", "Computer Vision",
  "Embedded Systems", "Blockchain", "Game Development", "AR/VR",
  "Operating Systems", "Compilers", "Cryptography", "Bioinformatics",
  "Robotics", "Quantum Computing", "IoT", "Edge Computing"
];

const OnboardingModal = () => {
  const { profile, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // If profile isn't loaded or onboarding is already complete, don't render
  if (!profile || profile.onboarding_completed) return null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const filtered = ALL_SPECIALTIES.filter(s => 
        s.toLowerCase().includes(value.toLowerCase()) && 
        !specialties.includes(s)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSpecialty = (specialty) => {
    if (specialties.length >= 10) return; // Limit to 10
    
    if (specialty && !specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeSpecialty = (specialty) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSpecialty(inputValue.trim());
      }
    }
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setIsClosing(true);
    try {
      await completeOnboarding(specialties);
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
            We’re building the definitive benchmark for AI coding agents — and your work directly shapes how AI learns to solve real engineering problems. Every task you create helps advance the frontier of agentic development.
          </p>
          
          <h3 className="onboarding-section-title">
            What you’ll contribute to:
          </h3>

          <div className="purpose-grid">
            <div className="purpose-card">
              <span className="purpose-icon">🔨</span>
              <h3>Create Tasks</h3>
              <p>Design challenges that require real reasoning and multi-step execution.</p>
            </div>
            <div className="purpose-card">
              <span className="purpose-icon">🤖</span>
              <h3>Push the Models</h3>
              <p>Craft scenarios that expose model weaknesses and drive progress.</p>
            </div>
          </div>
        </div>
      )
    },
    // Step 2: Your Expertise
    {
      content: (
        <div className="onboarding-step-content">
          <h2 className="onboarding-title" style={{ fontSize: '42px' }}>Your expertise is gold</h2>
          <p className="onboarding-description">
          TerminalBench spans a wide range of real engineering domains, from distributed systems and debugging nightmares to security exploits and ML infrastructure. Whether you’re deep in compilers or building production-scale architectures, there’s space here for your expertise to meaningfully shape the future of agentic AI.
          </p>
          <p className="onboarding-description" style={{ fontSize: '16px', marginTop: '-20px', opacity: 0.8 }}>
            <strong>Have a challenge worth solving?</strong> You can also propose tasks and contribute to the growing benchmark that pushes today’s best models to their limits.
          </p>
          
          <h3 className="onboarding-section-title" style={{ marginBottom: '16px', marginTop: '24px' }}>
            Explore challenges in specialized fields including:
          </h3>

          <div className="disciplines-marquee-container">
            <div className="disciplines-marquee-track">
              {[
                "Machine Learning", "Data Science", "Cyber Security", "Full Stack Web", 
                "System Design", "Cloud Infrastructure", "Algorithms", "Database Optimization",
                "Mobile Development", "Distributed Systems", "Frontend Architecture", "Backend Development"
              ].map((item, i) => (
                 <div key={`d1-${i}`} className="discipline-pill">{item}</div>
              ))}
              {[
                "Machine Learning", "Data Science", "Cyber Security", "Full Stack Web", 
                "System Design", "Cloud Infrastructure", "Algorithms", "Database Optimization",
                "Mobile Development", "Distributed Systems", "Frontend Architecture", "Backend Development"
              ].map((item, i) => (
                 <div key={`d2-${i}`} className="discipline-pill">{item}</div>
              ))}
            </div>
            
            <div className="disciplines-marquee-track reverse">
              {[
                "Reverse Engineering", "Penetration Testing", "NLP", "Computer Vision",
                "Embedded Systems", "Blockchain", "Game Development", "AR/VR",
                "Operating Systems", "Compilers", "Cryptography", "Bioinformatics",
                "Robotics", "Quantum Computing", "IoT", "Edge Computing"
              ].map((item, i) => (
                 <div key={`d3-${i}`} className="discipline-pill">{item}</div>
              ))}
              {[
                "Reverse Engineering", "Penetration Testing", "NLP", "Computer Vision",
                "Embedded Systems", "Blockchain", "Game Development", "AR/VR",
                "Operating Systems", "Compilers", "Cryptography", "Bioinformatics",
                "Robotics", "Quantum Computing", "IoT", "Edge Computing"
              ].map((item, i) => (
                 <div key={`d4-${i}`} className="discipline-pill">{item}</div>
              ))}
            </div>
          </div>

          <div className="onboarding-divider"></div>

          <h3 className="onboarding-section-title" style={{ marginBottom: '16px', marginTop: '24px' }}>
            Tell us what you’re best at
          </h3>

          <div className="specialties-input-container" style={{ marginBottom: '32px', position: 'relative' }}>
            <div className="specialties-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {specialties.map((specialty, index) => (
                <span key={index} className="specialty-tag" style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {specialty}
                  <button 
                    onClick={() => removeSpecialty(specialty)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, fontSize: '16px', display: 'flex', alignItems: 'center' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <input 
              type="text" 
              className="specialties-input"
              placeholder={specialties.length >= 10 ? "Limit reached (10 items)" : "Type to search or add your own..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={specialties.length >= 10}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: specialties.length >= 10 ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '16px',
                opacity: specialties.length >= 10 ? 0.7 : 1,
                cursor: specialties.length >= 10 ? 'not-allowed' : 'text'
              }}
            />
            {specialties.length >= 10 && (
              <p style={{
                marginTop: '8px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                animation: 'fadeIn 0.3s ease'
              }}>
                We see you, rockstar! 🎸 That's plenty of expertise for now.
              </p>
            )}
            
            {suggestions.length > 0 && (
              <div className="specialties-suggestions" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    onClick={() => addSpecialty(suggestion)}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-primary)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    },
    // Step 3: Resources
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
