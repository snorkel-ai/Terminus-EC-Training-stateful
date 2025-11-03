import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import GuidelineSection from './components/GuidelineSection';
import Videos from './components/Videos';
import Workbook from './components/Workbook';
import OracleTraining from './components/OracleTraining';
import { trainingSections } from './data/trainingData';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Check if currentView is a guideline section
  const guidelineSection = trainingSections.find(section => section.id === currentView);

  return (
    <div className="app">
      {currentView === 'home' && <LandingPage onNavigate={handleNavigate} />}
      {guidelineSection && <GuidelineSection section={guidelineSection} onNavigate={handleNavigate} />}
      {currentView === 'videos' && <Videos onNavigate={handleNavigate} />}
      {currentView === 'workbook' && <Workbook onNavigate={handleNavigate} />}
      {currentView === 'oracle' && <OracleTraining onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
