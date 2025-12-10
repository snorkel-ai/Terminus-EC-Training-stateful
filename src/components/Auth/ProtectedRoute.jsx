import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoadingMessage } from '../../hooks/useLoadingMessage';
import { AUTH_LOADING_MESSAGES } from '../../utils/loadingMessages';
import { LoadingState } from '../ui';

function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(AUTH_LOADING_MESSAGES, 2200);

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <LoadingState size="lg" message={loadingMessage} />
      </div>
    );
  }

  // SECURITY: Require both user AND profile to access
  // This prevents access if auth works but profile fetch fails
  if (!user || !profile) {
    console.log('ProtectedRoute: Redirecting to login - user or profile missing');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

