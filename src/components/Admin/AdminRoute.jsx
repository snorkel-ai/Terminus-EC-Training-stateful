import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoadingMessage } from '../../hooks/useLoadingMessage';
import { AUTH_LOADING_MESSAGES } from '../../utils/loadingMessages';
import { LoadingState } from '../ui';

function AdminRoute({ children }) {
  const { profile, loading } = useAuth();
  
  // Fun rotating loading message
  const loadingMessage = useLoadingMessage(AUTH_LOADING_MESSAGES, 2200);

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

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;

