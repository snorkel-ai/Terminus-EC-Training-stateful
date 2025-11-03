import './LandingPage.css';

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <header className="header">
        <nav className="nav">
          <div className="logo">Terminus EC</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1 className="hero-title">Welcome to Terminus EC Training</h1>
        </section>

        <section className="resources-section">
          <h2 className="section-title">Training Resources</h2>
          <div className="resource-buttons">
            <button className="resource-button" onClick={() => onNavigate('videos')}>
              <span className="button-icon">🎥</span>
              <span className="button-text">Task Walkthrough Videos</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('workbook')}>
              <span className="button-icon">📝</span>
              <span className="button-text">CI Feedback Training</span>
            </button>
            <button className="resource-button" onClick={() => onNavigate('oracle')}>
              <span className="button-icon">🎯</span>
              <span className="button-text">Oracle Training</span>
            </button>
          </div>
        </section>

        <section className="guidelines-section">
          <h2 className="section-title">EC Guidelines</h2>
          <div className="guidelines-grid">
            <button className="guideline-card" onClick={() => onNavigate('overview')}>
              <div className="card-icon">📋</div>
              <h3>Project Overview</h3>
              <p>Learn about the project goals and your role</p>
            </button>
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
            <button className="guideline-card" onClick={() => onNavigate('ci-quality')}>
              <div className="card-icon">🔍</div>
              <h3>CI + Quality Control</h3>
              <p>Understand testing and validation</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('rates')}>
              <div className="card-icon">💰</div>
              <h3>Rate Schedule</h3>
              <p>View compensation information</p>
            </button>
            <button className="guideline-card" onClick={() => onNavigate('review')}>
              <div className="card-icon">👀</div>
              <h3>Review Guidelines</h3>
              <p>Learn about the review process</p>
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

