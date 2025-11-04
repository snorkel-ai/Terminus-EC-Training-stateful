import './LandingPage.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <header className="header">
        <nav className="nav">
          <div className="logo">Terminus Training Hub</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1 className="hero-title">Terminus Training Hub</h1>
          <p className="hero-subtitle">Slack for all project-related questions: <strong>#ec-terminus-submission</strong></p>
        </section>

        <section className="overview-section">
          <h3>Project Goal</h3>
          <p>
            This project aims to develop a high-quality dataset in the style of Terminal-Bench. 
            Terminal-Bench is a suite of multi-step agentic tasks executed in a Command-Line Interface (CLI) 
            environment, designed to benchmark the performance of models. You will design these tasks and 
            include the necessary components to be compatible with the Terminus framework.
          </p>

          <h3>Your Role as a Coding Expert</h3>
          <p>
            Your role is to develop a task, solution, and associated tests to verify the solution. These 
            should be quite difficult, targeting an accuracy of below 80% for GPT-5 or Sonnet 4.5.
          </p>
          
          <p><strong>Task Difficulty Classifications:</strong></p>
          <ul>
            <li><strong>Hard</strong> - accuracy &lt; 40% for GPT-5 or Sonnet 4.5</li>
            <li><strong>Medium</strong> - accuracy &lt; 60% for either GPT-5 or Sonnet 4.5</li>
            <li><strong>Easy</strong> - accuracy &lt; 80% for either GPT-5 or Sonnet 4.5</li>
          </ul>

          <p>
            You will create the task locally, validate that it meets all project criteria, and then package 
            it as part of your submissions. Each submission undergoes independent review by another qualified 
            coding expert with experience in the corresponding practice area to ensure accuracy and completeness.
          </p>
        </section>

        <section className="resources-section">
          <h2 className="section-title">Training Resources</h2>
          <div className="resource-buttons">
            <button className="resource-button" onClick={() => onNavigate('videos')}>
              <span className="button-text">Task Walkthrough Videos</span>
              <span className="button-description">Walks through the process of creating a task, running it, and creating a solution and tests</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('workbook')}>
              <span className="button-text">CI Feedback Training</span>
              <span className="button-description">Covers how to effectively utilize feedback from CI checks to iterate on submissions</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('oracle')}>
              <span className="button-text">Oracle Training</span>
              <span className="button-description">Covers how to run the Oracle Agent and debug any issues</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('onboarding')}>
              <span className="button-text">Onboarding Materials</span>
              <span className="button-description">Access the onboarding presentation slides and video</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('feedback')}>
              <span className="button-text">Feedback Slides</span>
              <span className="button-description">View feedback presentation slides with common issues and best practices</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('faq')}>
              <span className="button-text">FAQ</span>
              <span className="button-description">Frequently asked questions about the project</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('glossary')}>
              <span className="button-text">Glossary</span>
              <span className="button-description">Definitions and explanations of key terms</span>
            </button>
          </div>
        </section>

        <section className="guidelines-section">
          <h2 className="section-title">EC Guidelines</h2>
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
            <button className="guideline-card" onClick={() => onNavigate('rates')}>
              <div className="card-icon">💰</div>
              <h3>Rate Schedule</h3>
              <p>View compensation information</p>
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;

