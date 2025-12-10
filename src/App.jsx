import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import PublicLanding from './components/Landing/PublicLanding';
import Header from './components/Layout/Header';
import LandingPage from './components/LandingPage'; // This is now the Portal Dashboard
import MissionPage from './components/Mission/MissionPage';
import GuidelineSection from './components/GuidelineSection';
import Videos from './components/Videos';
import Workbook from './components/Workbook';
import OracleTraining from './components/OracleTraining';
import OnboardingMaterials from './components/OnboardingMaterials';
import ExpertPlatformOnboarding from './components/ExpertPlatformOnboarding';
import GitHubOnboarding from './components/GitHubOnboarding';
import ExpertPlatformWalkthrough from './components/ExpertPlatformWalkthrough';
import GitHubSubmissionWalkthrough from './components/GitHubSubmissionWalkthrough';
import FeedbackSlides from './components/FeedbackSlides';
import FAQ from './components/FAQ';
import Glossary from './components/Glossary';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfilePage from './components/Profile/ProfilePage';
import TasksView from './components/Tasks/TasksView';
import { DocsLayout } from './components/Docs';
import MySelectedTasks from './components/Tasks/MySelectedTasks';
import TaskDetail from './components/Tasks/TaskDetail';
import OnboardingModal from './components/Onboarding/OnboardingModal';
import { trainingSections } from './data/trainingData';

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
                      <Route path="/overview" element={<MissionPage />} />
                      <Route path="/tasks" element={<TasksView />} />
                      <Route path="/task/:taskId" element={<TaskDetail />} />
                      <Route path="/my-tasks" element={<MySelectedTasks />} />
                      <Route path="/videos" element={<Videos />} />
                      <Route path="/workbook" element={<Workbook />} />
                      <Route path="/oracle" element={<OracleTraining />} />
                      <Route path="/onboarding" element={<OnboardingMaterials />} />
                      <Route path="/expert-platform-onboarding" element={<ExpertPlatformOnboarding />} />
                      <Route path="/github-onboarding" element={<GitHubOnboarding />} />
                      <Route path="/expert-platform-walkthrough" element={<ExpertPlatformWalkthrough />} />
                      <Route path="/github-submission-walkthrough" element={<GitHubSubmissionWalkthrough />} />
                      <Route path="/feedback" element={<FeedbackSlides />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/docs/*" element={<DocsLayout />} />
                      
                      {/* Redirects from old routes to new docs pages */}
                      <Route path="/docs-platform-onboarding" element={<Navigate to="/portal/docs/onboarding/platform-onboarding" replace />} />
                      <Route path="/docs-github-onboarding" element={<Navigate to="/portal/docs/onboarding/github-onboarding" replace />} />
                      <Route path="/docs-platform-submission" element={<Navigate to="/portal/docs/submitting-tasks/platform-submission" replace />} />
                      <Route path="/docs-github-submission" element={<Navigate to="/portal/docs/submitting-tasks/github-submission" replace />} />
                      <Route path="/docs-ci-training" element={<Navigate to="/portal/docs/testing-and-validation/ci-feedback-training" replace />} />
                      <Route path="/docs-oracle-training" element={<Navigate to="/portal/docs/testing-and-validation/oracle-training" replace />} />
                      <Route path="/docs-faq" element={<Navigate to="/portal/docs/reference/faq" replace />} />
                      <Route path="/docs-glossary" element={<Navigate to="/portal/docs/reference/glossary" replace />} />
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
