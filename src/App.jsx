import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthPage from './components/Auth/AuthPage';
import PublicLanding from './components/Landing/PublicLanding';
import Header from './components/Layout/Header';
import LandingPage from './components/LandingPage'; // This is now the Portal Dashboard
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
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLanding />} />
            <Route path="/login" element={<AuthPage />} />
            
            {/* Protected Portal Routes */}
            <Route 
              path="/portal/*" 
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
                      
                      <Route path="*" element={<Navigate to="/portal" replace />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
