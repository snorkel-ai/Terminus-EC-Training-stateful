import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ParticleCanvas from '../Landing/ParticleCanvas';
import './ResetPassword.css';

function ResetPassword() {
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Listen for the PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            setValidSession(true);
            setCheckingSession(false);
          }
        });

        // If we already have a session (user clicked the link), they can reset
        if (session) {
          setValidSession(true);
        }
        
        setCheckingSession(false);
        
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Session check error:', err);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      setSuccess(true);
      
      // Redirect to portal after 2 seconds
      setTimeout(() => {
        navigate('/portal');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (checkingSession) {
    return (
      <div className="reset-password-page">
        <ParticleCanvas />
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no valid session
  if (!validSession && !user) {
    return (
      <div className="reset-password-page">
        <ParticleCanvas />
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="invalid-link-state">
              <div className="error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2>Invalid or Expired Link</h2>
              <p>This password reset link is invalid or has expired.</p>
              <button 
                onClick={() => navigate('/forgot-password')}
                className="request-new-link-button"
              >
                Request a New Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <ParticleCanvas />
      
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>{success ? 'Password Updated!' : 'Set New Password'}</h1>
            <p className="reset-password-subtitle">
              {success 
                ? "Redirecting you to the portal..."
                : "Choose a strong password for your account"
              }
            </p>
          </div>

          <div className="reset-password-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <p className="success-text">
                  Your password has been successfully updated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="form-input"
                    autoFocus
                  />
                  <span className="input-hint">Must be at least 6 characters</span>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

