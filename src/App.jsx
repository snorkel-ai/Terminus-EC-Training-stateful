import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import AuthCallback from './components/Auth/AuthCallback';
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
import ExpertPlatformWalkthrough from './components/ExpertPlatformWalkthrough';
import FeedbackSlides from './components/FeedbackSlides';
import FAQ from './components/FAQ';
import Glossary from './components/Glossary';
import LocalTestingInfo from './components/LocalTestingInfo';
import { trainingSections } from './data/trainingData';

// Import backend components
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfilePage from './components/Profile/ProfilePage';
import TasksView from './components/Tasks/TasksView';
import { DocsLayout } from './components/Docs';
import MySelectedTasks from './components/Tasks/MySelectedTasks';
import TaskDetail from './components/Tasks/TaskDetail';
import OnboardingModal from './components/Onboarding/OnboardingModal';
import { AnnouncementBanner } from './components/ui';
import PromoBanner from './components/ui/PromoBanner';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProgressProvider>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Portal Routes */}
            <Route 
              path="/portal/*" 
              element={
                <ProtectedRoute>
                  <div className="app">
                    <OnboardingModal />
                    <Header />
                    <PromoBanner>
                      <AnnouncementBanner 
                        variant="subtle"
                        title="Please do not reach out to reviewers directly; "
                      >
                        messaging them will not speed up your review.
                      </AnnouncementBanner>
                    </PromoBanner>
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
                      <Route path="/environment-setup" element={<Navigate to="/portal/docs/getting-started/quick-start" replace />} />
                      <Route path="/local-testing" element={<LocalTestingInfo />} />
                      <Route path="/expert-platform-onboarding" element={<ExpertPlatformOnboarding />} />
                      <Route path="/expert-platform-walkthrough" element={<Navigate to="/portal/docs/submitting-tasks/platform-submission" replace />} />
                      <Route path="/feedback" element={<FeedbackSlides />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/docs/*" element={<DocsLayout />} />
                      
                      {/* Redirects from old routes to new docs pages */}
                      <Route path="/docs-platform-onboarding" element={<Navigate to="/portal/docs/onboarding/platform-onboarding" replace />} />
                      <Route path="/docs-platform-submission" element={<Navigate to="/portal/docs/submitting-tasks/platform-submission" replace />} />
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
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
