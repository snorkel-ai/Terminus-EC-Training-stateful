import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthPage from './components/Auth/AuthPage';
import Login from './components/Auth/Login';
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
import LocalTestingInfo from './components/LocalTestingInfo';
import EnvironmentSetup from './components/EnvironmentSetup';
import { trainingSections } from './data/trainingData';

// Import backend components
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfilePage from './components/Profile/ProfilePage';
import TasksView from './components/Tasks/TasksView';
import MySelectedTasks from './components/Tasks/MySelectedTasks';
import TaskDetail from './components/Tasks/TaskDetail';
import OnboardingModal from './components/Onboarding/OnboardingModal';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLanding />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Portal Routes */}
            <Route 
              path="/portal/*" 
              element={
                <ProtectedRoute>
                  <div className="app">
                    <OnboardingModal />
                    <Header />
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/tasks" element={<TasksView />} />
                      <Route path="/task/:taskId" element={<TaskDetail />} />
                      <Route path="/my-tasks" element={<MySelectedTasks />} />
                      <Route path="/videos" element={<Videos />} />
                      <Route path="/workbook" element={<Workbook />} />
                      <Route path="/oracle" element={<OracleTraining />} />
                      <Route path="/onboarding" element={<OnboardingMaterials />} />
                      <Route path="/environment-setup" element={<EnvironmentSetup />} />
                      <Route path="/local-testing" element={<LocalTestingInfo />} />
                      <Route path="/feedback" element={<FeedbackSlides />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/profile" element={<ProfilePage />} />
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
