import React from 'react';

const WhatIsTerminalBench = () => {
  return (
    <section id="what-is-terminalbench" className="landing-section what-is-section">
      <h2 className="section-title">What is TerminalBench?</h2>
      <div className="what-is-content">
        <p className="lead-text">
          TerminalBench is a platform where developers complete real engineering tasks to benchmark and improve AI coding agents. Companies and research teams submit real problems, developers solve them, and human results are compared against agent performance to advance the next generation of AI-assisted software development.
        </p>
        <p className="lead-text">
          TerminalBench was created by <b>Stanford University</b> and the <b>Laude Institute</b>, and has quickly become a leading benchmark for evaluating AI coding agents in command-line environments. Since launch, it has earned over 1,000 GitHub stars and attracted contributions from developers worldwide. This platform is a <b>Snorkel AI initiative</b> to contribute to and expand the benchmark—not an official partnership.
        </p>
        <p className="highlight-text">
          You get paid for high-quality engineering work, and your contributions directly improve the future of agentic development.
        </p>
        
        <div className="research-card-wrapper">
          <div className="research-divider"></div>
          <a 
            href="https://snorkel.ai/blog/terminal-bench-2-0-raising-the-bar-for-ai-agent-evaluation/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="research-card"
          >
            <div className="research-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="research-content">
              <span className="research-label">Deep Dive</span>
              <span className="research-question">Terminal-Bench 2.0: Raising the bar for AI agent evaluation</span>
              <span className="research-cta">
                Read about Snorkel's contribution to Terminal-Bench 2.0 
                <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatIsTerminalBench;
