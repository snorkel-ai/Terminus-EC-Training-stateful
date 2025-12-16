import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './AuthCallback.css';

/**
 * AuthCallback handles redirects from Supabase auth flows (password reset, email confirmation, etc.)
 * It parses error/success states from URL hash and redirects appropriately.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Parse the URL hash for errors or tokens
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');
      const type = hashParams.get('type');

      // Check for errors in the hash
      if (errorCode) {
        const decodedDescription = errorDescription 
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : 'An error occurred';
        
        setError({
          code: errorCode,
          description: decodedDescription,
        });
        setProcessing(false);
        return;
      }

      // Check for access_token (successful auth)
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        // Let Supabase handle the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError({
            code: 'session_error',
            description: sessionError.message,
          });
          setProcessing(false);
          return;
        }

        // Check if this is a password recovery flow
        if (type === 'recovery' || session) {
          // Redirect to reset password page
          navigate('/reset-password', { replace: true });
          return;
        }

        // Default: redirect to portal
        navigate('/portal', { replace: true });
        return;
      }

      // No error and no token - check if we have a session already
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/portal', { replace: true });
      } else {
        // No session and no tokens - redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [location, navigate]);

  const getErrorMessage = () => {
    if (!error) return '';
    
    switch (error.code) {
      case 'otp_expired':
        return 'This password reset link has expired. Please request a new one.';
      case 'access_denied':
        return 'Access was denied. The link may be invalid or expired.';
      default:
        return error.description || 'An unexpected error occurred.';
    }
  };

  if (processing) {
    return (
      <div className="auth-callback-page">
        <div className="auth-callback-container">
          <div className="auth-callback-card">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-callback-page">
        <div className="auth-callback-container">
          <div className="auth-callback-card">
            <div className="error-state">
              <div className="error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2>Link Expired or Invalid</h2>
              <p className="error-description">{getErrorMessage()}</p>
              <div className="error-actions">
                <button 
                  onClick={() => navigate('/forgot-password')}
                  className="primary-button"
                >
                  Request New Link
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="secondary-button"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;

