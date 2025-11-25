import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMySelectedTasks } from '../../hooks/useTasks';
import './ProfilePage.css';
import { FaGithub, FaLinkedin, FaSlack, FaEnvelope, FaCheck } from 'react-icons/fa';

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
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { selectedTasks, loading: tasksLoading } = useMySelectedTasks();
  
  const [activeTab, setActiveTab] = useState('profile');
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
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Placeholder for actual deletion logic
        alert('Please contact support (support@term.inus) to permanently delete your account data.');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
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

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          My Submitted Tasks
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
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
                  <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </section>

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
                  <div className="danger-text">
                    <p>Delete Account</p>
                    <small>Permanently remove your account and all associated data.</small>
                  </div>
                  <button onClick={handleDeleteAccount} className="btn-danger">
                    Delete Account
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      ) : (
        <div className="submitted-tasks-placeholder">
          <span className="placeholder-icon">📝</span>
          <div className="placeholder-text">
            <h3>My Submitted Tasks</h3>
            <p>A list of your accepted tasks will appear here soon.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
