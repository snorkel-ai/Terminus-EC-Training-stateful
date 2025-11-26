import { useState } from 'react';
import './Guidelines.css';
import Sidebar from './Sidebar';
import Content from './Content';
import { trainingSections } from '../data/trainingData';

function Guidelines({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('overview');

  const currentSection = trainingSections.find(section => section.id === activeSection);

  return (
    <div className="guidelines">
      <header className="guidelines-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="guidelines-logo">Project Guidelines</div>
      </header>
      
      <div className="guidelines-layout">
        <Sidebar 
          sections={trainingSections} 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="guidelines-main">
          <Content section={currentSection} />
        </main>
      </div>

      <footer className="guidelines-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Guidelines;

