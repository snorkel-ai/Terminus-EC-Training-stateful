import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { trainingSections } from './data/trainingData';

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  const currentSection = trainingSections.find(section => section.id === activeSection);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">Terminus EC Training</div>
      </header>
      
      <div className="app-layout">
        <Sidebar 
          sections={trainingSections} 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="app-main">
          <Content section={currentSection} />
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
