import React from 'react';
import ParticleCanvas from '../Landing/ParticleCanvas';
import './MissionPage.css';

const MissionPage = () => {
  return (
    <div className="mission-page">
      <div className="mission-background">
        <ParticleCanvas />
      </div>
      
      <div className="mission-content-container">
        <div className="mission-content">
          <h1 className="mission-title">Our Mission</h1>
          
          <h2 className="mission-subtitle">
            Advancing the science of agentic AI through real engineering tasks
          </h2>
          
          <div className="mission-section">
            <p className="mission-text">
              Progress in agentic AI depends on more than next-token prediction.
            </p>
            <p className="mission-text">
              To evaluate and improve these systems, we need benchmarks that reflect the true complexity of real-world software engineering, including multistep reasoning, troubleshooting, environment manipulation, and recovery from failure.
            </p>
            <p className="mission-text highlight">
              TerminalBench was created to meet that need.
            </p>
            <p className="mission-text">
              TerminalBench, created by Stanford University and Laude Institute, provides a rigorous, end-to-end evaluation of how AI agents perform in realistic command-line environments. This platform is a Snorkel AI initiative to contribute to and expand the benchmark. Each task reveals specific model limitations, including gaps in reasoning, planning, execution, or robustness, that cannot be detected through synthetic datasets or code-completion benchmarks.
            </p>
          </div>

          <div className="mission-section contributions">
            <p className="mission-text">
              By designing tasks that expose failure modes in frontier models, you help generate the empirical signal needed to:
            </p>
            <ul className="mission-list">
              <li>Identify systematic weaknesses in agentic behavior</li>
              <li>Guide model and policy improvements</li>
              <li>Establish transparent, reproducible evaluation standards for the field</li>
              <li>Accelerate research toward reliable, general-purpose coding agents</li>
            </ul>
          </div>

          <div className="mission-section closing">
            <p className="mission-text strong">
              This is not crowdsourced labeling, it is applied research, grounded in real engineering practice.
            </p>
            <p className="mission-text">
              TerminalBench advances only as far as its community of experts pushes it.
            </p>
            <p className="mission-text">
              Every accepted task becomes part of a shared scientific instrument used across academia and industry.
            </p>
            <p className="mission-text welcome-message">
              On behalf of the Snorkel team, welcome and thank you for helping build the foundation of next-generation agentic AI evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
