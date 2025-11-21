import './LandingPage.css';
import './Content.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <header className="header">
        <nav className="nav">
          <div className="logo">Terminus Training Hub</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><button onClick={() => onNavigate('glossary')} style={{ background: 'none', border: 'none', color: '#4b5563', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>Glossary</button></li>
            <li><button onClick={() => onNavigate('faq')} style={{ background: 'none', border: 'none', color: '#4b5563', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>FAQ</button></li>
          </ul>
        </nav>
      </header>

      <div className="announcement-banner">
        <p className="announcement-text">PLEASE DO NOT REACH OUT TO REVIEWERS DIRECTLY.<br />Reviews will be performed ASAP and messaging them will not increase the speed at which your submission is reviewed.</p>
      </div>


      <main className="main-content">
        <section className="overview-section">
          <h2 className="section-title">Project Overview</h2>
          <p>
            This project aims to develop a high-quality dataset in the style of Terminal-Bench. 
            Terminal-Bench is a suite of multi-step agentic tasks executed in a Command-Line Interface (CLI) 
            environment, designed to benchmark the performance of models. Your role is to develop a task, solution, and associated tests to verify the solution. These 
            should be quite difficult, targeting an accuracy of below 80% for GPT-5 or Sonnet 4.5.
          </p>
          
          <table>
            <thead>
              <tr>
                <th>Difficulty Level</th>
                <th>Hard</th>
                <th>Medium</th>
                <th>Easy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Accuracy Threshold</strong></td>
                <td>&lt; 40%</td>
                <td>&lt; 60%</td>
                <td>&lt; 80%</td>
              </tr>
            </tbody>
          </table>

          <p>
            You will create the task locally, validate that it meets all project criteria, and then package 
            it as part of your submissions. Each submission undergoes independent review by another qualified 
            coding expert with experience in the corresponding practice area to ensure accuracy and completeness.
          </p>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p className="hero-subtitle">Slack for all project-related questions: <strong>#ec-terminus-submission</strong></p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://docs.google.com/spreadsheets/d/1TQdHPhEb8PrtSOH1PC71120jhBuXQVQWVugqgz3IbY0/edit?gid=364067552#gid=364067552&range=A30" 
                target="_blank" 
                rel="noopener noreferrer"
                className="overview-link"
              >
                📋 Task Idea Sheet
              </a>
              <a 
                href="https://github.com/snorkel-ai/snorkel-tb-tasks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="overview-link"
              >
                🔗 GitHub Repo
              </a>
            </div>
          </div>
        </section>

        <div style={{ borderTop: '2px solid #e2e8f0', marginTop: '3rem', paddingTop: '2rem' }}>
          <section className="resources-section">
            <h2 className="section-title">Training Resources</h2>
          <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'left', display: 'inline-block', color: '#475569', lineHeight: '1.6' }}>
              <strong>We recommend completing the training resources in the following order:</strong>
              <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li>Begin with the onboarding materials to get oriented with the project</li>
                <li>Set up your development environment</li>
                <li>Proceed through the task walkthrough videos to understand the development process</li>
                <li>Complete the OracleAgent training to learn how to validate your solutions</li>
                <li>Complete the CI Feedback training to learn how to iterate on submissions</li>
                <li>Review the local testing information to set up agent testing</li>
              </ol>
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
            <p style={{ margin: '0', textAlign: 'center', display: 'inline-block' }}>
              Additionally, you may find the Office Hours Videos and Slides and Common Errors pages<br />
              helpful for understanding common mistakes and best practices to avoid.
            </p>
          </div>
          <div className="resource-buttons">
            <button className="resource-button" onClick={() => onNavigate('onboarding')}>
              <span className="button-text">Onboarding Video and Slides</span>
              <span className="button-description">Access the onboarding presentation slides and video</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('environment-setup')}>
              <span className="button-text">Environment Setup</span>
              <span className="button-description">Set up your development environment for the project</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('videos')}>
              <span className="button-text">Task Walkthrough Videos</span>
              <span className="button-description">Walks through the process of creating a task, running it, and creating a solution and tests</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('oracle')}>
              <span className="button-text">OracleAgent Video and Notebook</span>
              <span className="button-description">Covers how to run the Oracle Agent and debug any issues</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('workbook')}>
              <span className="button-text">CI Feedback Video and Notebook</span>
              <span className="button-description">Covers how to effectively utilize feedback from CI checks to iterate on submissions</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('local-testing')}>
              <span className="button-text">Local Testing Info</span>
              <span className="button-description">Instructions for testing tasks locally with real agents</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('feedback')}>
              <span className="button-text">Office Hours Videos and Slides</span>
              <span className="button-description">View Office Hours videos and feedback presentation slides with common issues and best practices</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('common-errors')}>
              <span className="button-text">Common Errors</span>
              <span className="button-description">Learn about common mistakes and how to avoid them</span>
            </button>
          </div>
          </section>

          <div style={{ borderTop: '2px solid #e2e8f0', marginTop: '3rem', paddingTop: '2rem' }}>
            <section className="guidelines-section">
              <h2 className="section-title">Project Guidelines</h2>
          <div className="guidelines-grid">
            <button className="guideline-card" onClick={() => onNavigate('components')}>
              <div className="card-icon">🧩</div>
              <h3>Task Components</h3>
              <p>Understand submission requirements</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('taxonomy')}>
              <div className="card-icon">🏷️</div>
              <h3>Task Type Taxonomy</h3>
              <p>Explore task categories and types</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('workflow')}>
              <div className="card-icon">⚙️</div>
              <h3>Setup + Workflow</h3>
              <p>Get started with the development process</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('requirements')}>
              <div className="card-icon">✅</div>
              <h3>Task Requirements</h3>
              <p>Review design requirements and checklist</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('examples')}>
              <div className="card-icon">💡</div>
              <h3>Example Tasks</h3>
              <p>View sample tasks and implementations</p>
            </button>
          </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;

