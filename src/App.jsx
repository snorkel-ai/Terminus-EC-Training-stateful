import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import LandingPage from './components/LandingPage';
import GuidelineSection from './components/GuidelineSection';
import Videos from './components/Videos';
import Workbook from './components/Workbook';
import OracleTraining from './components/OracleTraining';
import OnboardingMaterials from './components/OnboardingMaterials';
import FeedbackSlides from './components/FeedbackSlides';
import FAQ from './components/FAQ';
import Glossary from './components/Glossary';
import AdminDashboard from './components/Admin/AdminDashboard';
import TasksView from './components/Tasks/TasksView';
import MySelectedTasks from './components/Tasks/MySelectedTasks';
import { trainingSections } from './data/trainingData';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
    <div className="app">
                  <Header />
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/tasks" element={<TasksView />} />
                    <Route path="/my-tasks" element={<MySelectedTasks />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/workbook" element={<Workbook />} />
                    <Route path="/oracle" element={<OracleTraining />} />
                    <Route path="/onboarding" element={<OnboardingMaterials />} />
                    <Route path="/feedback" element={<FeedbackSlides />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/glossary" element={<Glossary />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    
                    {/* Dynamic routes for guideline sections */}
                    {trainingSections.map(section => (
                      <Route 
                        key={section.id} 
                        path={`/${section.id}`} 
                        element={<GuidelineSection section={section} />} 
                      />
                    ))}
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
    </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
