import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMySelectedTasks } from '../../hooks/useTasks';
import { Button } from '../ui';
import './ProfilePage.css';
import { FaGithub, FaLinkedin, FaSlack, FaEnvelope, FaCheck, FaLock } from 'react-icons/fa';

const ALL_SPECIALTIES = [
  "Machine Learning", "Data Science", "Cyber Security", "Full Stack Web", 
  "System Design", "Cloud Infrastructure", "Algorithms", "Database Optimization",
  "Mobile Development", "Distributed Systems", "Frontend Architecture", "Backend Development",
  "Reverse Engineering", "Penetration Testing", "NLP", "Computer Vision",
  "Embedded Systems", "Blockchain", "Game Development", "AR/VR",
  "Operating Systems", "Compilers", "Cryptography", "Bioinformatics",
  "Robotics", "Quantum Computing", "IoT", "Edge Computing"
];

const ProfilePage = () => {
  const { user, profile, updateProfile, signOut, deleteAccount, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { selectedTasks, loading: tasksLoading } = useMySelectedTasks();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    linkedin_url: '',
    github_username: '',
    website_url: '',
    specialties: []
  });
  
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Password change state
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  
  // Check if user authenticated via email (not OAuth)
  const isEmailAuth = user?.app_metadata?.provider === 'email';

  const [statusItems, setStatusItems] = useState({
    onboarding_completed: false,
    slack_joined: false,
    payments_setup: false,
    dev_env_setup: false
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        github_username: profile.github_username || '',
        website_url: profile.website_url || '',
        specialties: profile.specialties || []
      });

      setStatusItems({
        onboarding_completed: profile.onboarding_completed || false,
        slack_joined: profile.slack_joined || false,
        payments_setup: profile.payments_setup || false,
        dev_env_setup: profile.dev_env_setup || false
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecialtyInputChange = (e) => {
    const value = e.target.value;
    setSpecialtyInput(value);
    if (value.length > 0) {
      const filtered = ALL_SPECIALTIES.filter(s => 
        s.toLowerCase().includes(value.toLowerCase()) && 
        !formData.specialties.includes(s)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSpecialtyAdd = (e) => {
    if (e.key === 'Enter' && specialtyInput.trim()) {
      e.preventDefault();
      addSpecialty(specialtyInput.trim());
    }
  };

  const addSpecialty = (specialty) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setSpecialtyInput('');
      setSuggestions([]);
    }
  };

  const removeSpecialty = (s) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(item => item !== s)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    const { error } = await updateProfile(formData);
    
    setIsSaving(false);
    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return;
    }
    
    setIsDeleting(true);
    setMessage(null);
    
    try {
      const { error } = await deleteAccount();
      
      if (error) {
        throw error;
      }
      
      // Redirect to home page after successful deletion
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to delete account. Please try again or reach out to Snorkel.' 
      });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmation('');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmation('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await updatePassword(passwordData.newPassword);
      if (error) throw error;
      
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!profile) return <div className="loading">Loading profile...</div>;

  const fullName = `${formData.first_name} ${formData.last_name}`.trim() || profile.email?.split('@')[0];
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrapper">
          {profile.github_avatar_url ? (
            <img 
              src={profile.github_avatar_url} 
              alt="Profile" 
              className="profile-avatar" 
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {initials}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{fullName}</h1>
          <div className="profile-meta">
            <span className="meta-item">
              <FaEnvelope /> {profile.email}
            </span>
            {profile.github_username && (
              <span className="meta-item">
                <FaGithub /> {profile.github_username}
              </span>
            )}
            {formData.linkedin_url && (
              <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" className="meta-item">
                <FaLinkedin /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className={`toast-message ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.type === 'success' && <FaCheck style={{ color: '#4CAF50' }} />}
          {message.text}
        </div>
      )}

      <div className="profile-grid">
          <div className="profile-main">
            <section className="profile-card">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Jane"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub Username</label>
                    <input
                      type="text"
                      name="github_username"
                      value={formData.github_username}
                      onChange={handleChange}
                      placeholder="username"
                      disabled={user?.app_metadata?.provider === 'github'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Portfolio / Website</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Areas of expertise</label>
                  <div className="tags-input-container" style={{ position: 'relative' }}>
                    <div className="tags-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {formData.specialties.map(s => (
                        <span key={s} className="tag-pill">
                          {s} <button type="button" onClick={() => removeSpecialty(s)} className="tag-remove">×</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={handleSpecialtyInputChange}
                      onKeyDown={handleSpecialtyAdd}
                      placeholder="Type to search or add your own..."
                      className="tag-input-field"
                      style={{ width: '100%' }}
                    />
                    {suggestions.length > 0 && (
                      <div className="specialties-suggestions" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginTop: '4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        {suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            onClick={() => addSpecialty(suggestion)}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="primary" loading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </section>

            {/* Password Change Section - Only for email auth users */}
            {isEmailAuth && (
              <section className="profile-card password-section">
                <div 
                  className="password-header" 
                  onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <h2 style={{ margin: 0, border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaLock style={{ fontSize: '1rem' }} /> Change Password
                  </h2>
                  <span style={{ transform: isPasswordSectionOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </div>
                
                {isPasswordSectionOpen && (
                  <div className="password-content" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    {passwordMessage && (
                      <div className={`password-message ${passwordMessage.type}`} style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        backgroundColor: passwordMessage.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                        border: `1px solid ${passwordMessage.type === 'error' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
                        color: passwordMessage.type === 'error' ? '#ff4444' : '#4CAF50'
                      }}>
                        {passwordMessage.text}
                      </div>
                    )}
                    
                    <form onSubmit={handlePasswordChange}>
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          Must be at least 6 characters
                        </small>
                      </div>
                      
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="primary" loading={isChangingPassword}>
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </section>
            )}

            <section className="profile-card danger-zone">
              <div 
                className="danger-header" 
                onClick={() => setIsDangerZoneOpen(!isDangerZoneOpen)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Danger Zone</h2>
                <span style={{ transform: isDangerZoneOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </div>
              
              {isDangerZoneOpen && (
                <div className="danger-actions" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 68, 68, 0.25)' }}>
                  {!showDeleteConfirm ? (
                    <>
                      <div className="danger-text">
                        <p>Delete Account</p>
                        <small>Permanently remove your account and all associated data.</small>
                      </div>
                      <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                        Delete Account
                      </Button>
                    </>
                  ) : (
                    <div className="delete-confirm-flow" style={{ width: '100%' }}>
                      <div className="danger-warning" style={{ 
                        backgroundColor: 'rgba(255, 68, 68, 0.1)', 
                        border: '1px solid rgba(255, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--color-error)' }}>
                          This action is irreversible
                        </p>
                        <small style={{ color: 'var(--text-secondary)' }}>
                          Deleting your account will permanently remove all your data including your profile, 
                          progress, and selected tasks. This cannot be undone.
                        </small>
                      </div>
                      
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ marginBottom: '0.5rem', display: 'block' }}>
                          Type <strong>DELETE</strong> to confirm:
                        </label>
                        <input
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="DELETE"
                          style={{ 
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-primary)'
                          }}
                          disabled={isDeleting}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="secondary" 
                          onClick={handleCancelDelete}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                          loading={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;
