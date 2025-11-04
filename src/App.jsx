import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import GuidelineSection from './components/GuidelineSection';
import Videos from './components/Videos';
import Workbook from './components/Workbook';
import OracleTraining from './components/OracleTraining';
import OnboardingMaterials from './components/OnboardingMaterials';
import FeedbackSlides from './components/FeedbackSlides';
import FAQ from './components/FAQ';
import Glossary from './components/Glossary';
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
      {currentView === 'onboarding' && <OnboardingMaterials onNavigate={handleNavigate} />}
      {currentView === 'feedback' && <FeedbackSlides onNavigate={handleNavigate} />}
      {currentView === 'faq' && <FAQ onNavigate={handleNavigate} />}
      {currentView === 'glossary' && <Glossary onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
