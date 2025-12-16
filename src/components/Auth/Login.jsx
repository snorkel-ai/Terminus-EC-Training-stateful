import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ParticleCanvas from '../Landing/ParticleCanvas';
import './Login.css';

function Login() {
  const { signInWithGitHub, signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [user, navigate]);

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      await signInWithGitHub();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      if (isSignUp) {
        const { user } = await signUpWithEmail(email, password);
        if (user) {
          setMessage('Check your email to confirm your account.');
          setIsSignUp(false); // Switch back to login mode
        }
      } else {
        await signInWithEmail(email, password);
        navigate('/portal');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="login-page">
      <ParticleCanvas />
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logos-container">
              <img 
                src="https://s46486.pcdn.co/wp-content/uploads/2023/05/snorkel_logo_header-1.svg" 
                alt="Snorkel" 
                className="snorkel-logo"
              />
            </div>
            <h1>{isSignUp ? 'Create Account' : 'Welcome to TerminalBench'}</h1>
          </div>

          <div className="login-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {!showEmailLogin ? (
              <>
                <button
                  onClick={handleGitHubSignIn}
                  disabled={loading}
                  className="github-button"
                >
                  <svg
                    className="github-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {loading ? 'Signing in...' : 'Login with GitHub'}
                </button>

                <div className="regular-login-section">
                  <button className="text-button" onClick={() => setShowEmailLogin(true)}>
                    I don't have a GitHub account
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEmailAuth} className="email-login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="form-input"
                  />
                </div>

                {!isSignUp && (
                  <div className="forgot-password-link">
                    <Link to="/forgot-password">Forgot your password?</Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>

                <div className="auth-mode-toggle">
                  <span className="toggle-text">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                  <button type="button" className="text-button inline" onClick={toggleMode}>
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </div>

                <div className="regular-login-section">
                  <button 
                    type="button"
                    className="text-button" 
                    onClick={() => {
                      setShowEmailLogin(false);
                      setIsSignUp(false);
                      setError(null);
                      setMessage(null);
                    }}
                  >
                    Back to GitHub login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
