import './Sidebar.css';

function Sidebar({ sections, activeSection, onSectionChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Training Guide</h2>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

