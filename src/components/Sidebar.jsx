import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import './Sidebar.css';
import { trainingSections } from '../data/trainingData';

function Sidebar() {
  const navigate = useNavigate();
  const { isCompleted } = useProgress();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="home-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <h3 className="sidebar-title">Guidelines</h3>
        <div className="sidebar-list">
          {trainingSections.map((section) => (
            <button
              key={section.id}
              className="sidebar-item"
              onClick={() => navigate(`/${section.id}`)}
            >
              {isCompleted(section.id) && (
                <span className="sidebar-checkmark">✓</span>
              )}
              {section.title}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
