import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../../lib/supabase';
import { Button, Modal, StepIndicator } from '../ui'; 
import './PromoManager.css';
import './PromoWizard.css'; 
import '../IncentivesSection.css';
import '../ui/PromoBanner.css'; // Ensure we have banner styles

function PromoManager() {
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rewardMultiplier, setRewardMultiplier] = useState(1.0);
  const [variant, setVariant] = useState('accent');
  const [useSchedule, setUseSchedule] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  // Drag and Drop State
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPromos(), fetchCategories()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromos = async () => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('is_active', { ascending: false })
      .order('display_order', { ascending: true });

    if (error) throw error;
    setPromos(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('task_inspiration')
      .select('category')
      .order('category');

    if (error) throw error;

    const uniqueCategories = [...new Set(data.map(item => item.category))];
    setCategories(uniqueCategories);
  };

  // --- Helper Functions ---

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Always';
    return new Date(dateString).toLocaleString();
  };

  const formatBoost = (multiplier) => {
    const boost = Math.round((multiplier - 1) * 100);
    return `+${boost}%`;
  };

  const utcToPstInput = (utcString) => {
    if (!utcString) return '';
    const date = new Date(utcString);
    const pstDate = new Date(date.getTime() - (8 * 60 * 60 * 1000));
    return pstDate.toISOString().slice(0, 16);
  };

  const pstInputToUtc = (localString) => {
    if (!localString) return null;
    return localString + ':00-08:00';
  };

  const formatCompactDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const getPromoStatus = (promo) => {
    const now = new Date();
    
    if (!promo.is_active) {
      return { status: 'inactive', label: 'Inactive' };
    }
    
    if (promo.ends_at && new Date(promo.ends_at) < now) {
      return { status: 'expired', label: 'Expired' };
    }
    
    if (promo.starts_at && new Date(promo.starts_at) > now) {
      return { status: 'scheduled', label: 'Scheduled' };
    }
    
    return { status: 'active', label: 'Active' };
  };

  // --- Actions ---

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setEditingId(promo.id);
    setTitle(promo.title);
    setMessage(promo.message || '');
    setLongDescription(promo.long_description || '');
    setSelectedCategories(promo.categories || []);
    setRewardMultiplier(promo.reward_multiplier || 1.0);
    setVariant(promo.variant || 'accent');
    
    if (promo.starts_at || promo.ends_at) {
      setUseSchedule(true);
      setStartsAt(utcToPstInput(promo.starts_at));
      setEndsAt(utcToPstInput(promo.ends_at));
    } else {
      setUseSchedule(false);
      setStartsAt('');
      setEndsAt('');
    }

    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setLongDescription('');
    setSelectedCategories([]);
    setRewardMultiplier(1.0);
    setVariant('accent');
    setUseSchedule(false);
    setStartsAt('');
    setEndsAt('');
  };

  const handleSave = async () => {
    if (!title) {
      alert('Please provide a title.');
      return;
    }

    try {
      setSaving(true);
      
      const payload = {
        title,
        message,
        long_description: longDescription || null,
        categories: selectedCategories,
        reward_multiplier: parseFloat(rewardMultiplier),
        variant,
        starts_at: useSchedule ? pstInputToUtc(startsAt) : null,
        ends_at: useSchedule ? pstInputToUtc(endsAt) : null,
        display_order: editingId ? undefined : promos.length // New promos go to end
      };

      let error;
      
      if (editingId) {
        const { error: updateError } = await supabase
          .from('promotions')
          .update(payload)
          .eq('id', editingId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('promotions')
          .insert({
            ...payload,
            is_active: true
          });
        error = insertError;
      }

      if (error) throw error;

      setIsModalOpen(false);
      resetForm();
      await fetchPromos();

    } catch (error) {
      console.error('Error saving promo:', error);
      alert('Failed to save promo: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchPromos();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPromos();
    } catch (error) {
      console.error('Error deleting promo:', error);
      alert('Failed to delete promo');
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    setDragOverId(null);
    
    if (draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    // Reorder locally first for immediate feedback
    const draggedIndex = promos.findIndex(p => p.id === draggedId);
    const targetIndex = promos.findIndex(p => p.id === targetId);
    
    const newPromos = [...promos];
    const [draggedItem] = newPromos.splice(draggedIndex, 1);
    newPromos.splice(targetIndex, 0, draggedItem);
    
    setPromos(newPromos);
    setDraggedId(null);

    // Update display_order in database
    try {
      const updates = newPromos.map((promo, index) => ({
        id: promo.id,
        display_order: index
      }));

      for (const update of updates) {
        await supabase
          .from('promotions')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      // Refetch to get correct order on error
      await fetchPromos();
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // --- Steps Logic ---

  const steps = [
    { title: 'Basics' },
    { title: 'Details' },
    { title: 'Targeting' },
    { title: 'Review' }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !title) {
      alert("Please enter a title");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading) return <div>Loading promotions...</div>;

  return (
    <div className="promo-manager">
      <div className="promo-manager-header">
        <div>
          <h2>Promotions Manager</h2>
          <p>Create and manage promotional banners and category boosts.</p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          + Create Promotion
        </Button>
      </div>

      <div className="promo-list-section">
        <div className="promos-grid">
          {promos.length === 0 ? (
            <p className="text-secondary">No promotions found.</p>
          ) : (
            promos.map(promo => (
              <div 
                key={promo.id} 
                className={`promo-card ${!promo.is_active ? 'inactive' : ''} ${draggedId === promo.id ? 'dragging' : ''} ${dragOverId === promo.id ? 'drag-over' : ''} variant-${promo.variant || 'accent'}`}
                draggable
                onDragStart={(e) => handleDragStart(e, promo.id)}
                onDragOver={(e) => handleDragOver(e, promo.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, promo.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="promo-card-header">
                  <div className="promo-card-title">
                    <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
                    <h4>{promo.title}</h4>
                    {(() => {
                      const { status, label } = getPromoStatus(promo);
                      return (
                        <span className={`promo-status-badge ${status}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="promo-actions">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openEditModal(promo)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant={promo.is_active ? "secondary" : "primary"}
                      onClick={() => handleToggleActive(promo.id, promo.is_active)}
                    >
                      {promo.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(promo.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {promo.message && <p className="promo-card-message">{promo.message}</p>}
                
                <div className="promo-details">
                    <div className="detail-item">
                    <span className="detail-label">Boost</span>
                    <span>
                      {promo.reward_multiplier > 1 
                        ? `+${Math.round((promo.reward_multiplier - 1) * 100)}%` 
                        : 'None'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Categories</span>
                    <div className="category-tags">
                      {promo.categories.length === 0 ? (
                          <span className="category-tag">Banner Only</span>
                      ) : promo.categories.map(cat => (
                        <span key={cat} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Schedule</span>
                    <span>
                      {(promo.starts_at || promo.ends_at) ? (
                        `${formatDate(promo.starts_at)} - ${formatDate(promo.ends_at)}`
                      ) : 'Manual Only'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Wizard Modal - Split Layout */}
      {isModalOpen && (
        <div className="onboarding-modal-overlay">
          <div className="onboarding-modal-content promo-wizard-modal">
            {/* Step Indicator */}
            <div style={{marginBottom: '40px'}}>
              <StepIndicator steps={steps} currentStep={currentStep} />
            </div>

            <div className="promo-wizard-container">
              
              {/* Split Layout: Left Form, Right Preview */}
              <div className="wizard-split-layout">
                
                {/* LEFT PANEL: FORM INPUTS */}
                <div className="wizard-left-panel">
                  
                  {currentStep === 1 && (
                    <div className="wizard-step">
                      <div className="promo-step-header">
                        <h2 className="promo-step-title">Basics</h2>
                        <p className="promo-step-description">Set up the core information for your promotion card.</p>
                      </div>
                      
                      <div className="wizard-form-group">
                        <label className="wizard-label">Promotion Title</label>
                        <input 
                          className="wizard-input"
                          type="text" 
                          value={title} 
                          onChange={e => setTitle(e.target.value)} 
                          placeholder="e.g., Holiday Bonus Week"
                          autoFocus
                        />
                      </div>
                      <div className="wizard-form-group">
                        <label className="wizard-label">Short Description</label>
                        <textarea 
                          className="wizard-textarea"
                          value={message} 
                          onChange={e => setMessage(e.target.value)}
                          placeholder="Brief summary shown on the card (max 150 chars)..."
                          rows={3}
                        />
                      </div>
                      <div className="wizard-form-group">
                        <label className="wizard-label">Color Variant</label>
                        <div className="variant-selector">
                          {['accent', 'warning', 'success', 'info'].map(v => (
                            <div
                              key={v}
                              className={`variant-option ${variant === v ? 'selected' : ''}`}
                              onClick={() => setVariant(v)}
                            >
                              <div className={`mini-banner ${v}`}>
                                <span>💸</span>
                                <span className="mini-banner-title">
                                  {title || 'Your Promo Title'} — {message || 'Short description here...'}
                                </span>
                                <span className="check-indicator">✓</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="wizard-step">
                      <div className="promo-step-header">
                        <h2 className="promo-step-title">Detailed Content</h2>
                        <p className="promo-step-description">Write the full announcement using Markdown.</p>
                      </div>
                      
                      <div className="markdown-editor-container">
                        <textarea 
                          className="wizard-textarea"
                          value={longDescription} 
                          onChange={e => setLongDescription(e.target.value)}
                          placeholder="# Full Details
                          
Write your announcement here. You can use:
- Bullet points
- **Bold text**
- [Links](https://...)"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="wizard-step">
                      <div className="promo-step-header">
                        <h2 className="promo-step-title">Targeting</h2>
                        <p className="promo-step-description">Define who sees this and when.</p>
                      </div>

                      <div className="wizard-form-group">
                        <label className="wizard-label">Reward Multiplier</label>
                        <div className="multiplier-input-wrapper">
                          <input 
                            className="wizard-input"
                            type="number" 
                            step="0.01"
                            min="1.0"
                            value={rewardMultiplier} 
                            onChange={e => setRewardMultiplier(e.target.value)}
                          />
                          <span className="multiplier-preview">
                            {parseFloat(rewardMultiplier) > 1 
                              ? `${formatBoost(parseFloat(rewardMultiplier))} Boost` 
                              : 'No Boost'}
                          </span>
                        </div>
                      </div>

                      <div className="wizard-form-group">
                        <label className="wizard-label">Schedule (PST)</label>
                        <div className="checkbox-label" style={{marginBottom: '16px'}}>
                          <input 
                            type="checkbox"
                            checked={useSchedule}
                            onChange={e => setUseSchedule(e.target.checked)}
                          />
                          Enable Date Schedule
                        </div>
                        
                        {useSchedule && (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div>
                              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)'}}>Start Date</label>
                              <input 
                                className="wizard-input"
                                type="datetime-local" 
                                value={startsAt}
                                onChange={e => setStartsAt(e.target.value)}
                              />
                            </div>
                            <div>
                              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)'}}>End Date</label>
                              <input 
                                className="wizard-input"
                                type="datetime-local" 
                                value={endsAt}
                                onChange={e => setEndsAt(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="wizard-form-group">
                        <label className="wizard-label">Categories</label>
                        <div className="checkbox-group" style={{maxHeight: '200px'}}>
                          <label className="checkbox-label highlight">
                            <input 
                              type="checkbox"
                              checked={selectedCategories.includes('ALL')}
                              onChange={() => {
                                if (selectedCategories.includes('ALL')) {
                                  setSelectedCategories([]);
                                } else {
                                  setSelectedCategories(['ALL']);
                                }
                              }}
                            />
                            Apply to ALL Categories
                          </label>
                          {categories.map(cat => (
                            <label key={cat} className="checkbox-label">
                              <input 
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => handleCategoryToggle(cat)}
                                disabled={selectedCategories.includes('ALL')}
                              />
                              {cat}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="wizard-step">
                      <div className="promo-step-header">
                        <h2 className="promo-step-title">Review</h2>
                        <p className="promo-step-description">Confirm details before launching.</p>
                      </div>

                      <div className="review-summary">
                        <div className="review-item">
                          <strong>Title:</strong> {title}
                        </div>
                        <div className="review-item">
                          <strong>Target Audience:</strong> {selectedCategories.includes('ALL') ? 'All Categories' : selectedCategories.length === 0 ? 'Global Announcement' : `${selectedCategories.length} Categories`}
                        </div>
                        <div className="review-item">
                          <strong>Reward Boost:</strong> {parseFloat(rewardMultiplier) > 1 ? `${formatBoost(parseFloat(rewardMultiplier))}` : 'None'}
                        </div>
                        <div className="review-item">
                          <strong>Schedule:</strong> {useSchedule ? `${startsAt} to ${endsAt} (PST)` : 'Manual Activation'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT PANEL: LIVE PREVIEW */}
                <div className="wizard-right-panel">
                  <div className="preview-label">
                    {currentStep === 2 ? 'Live Modal Preview' : 'Live Card Preview'}
                  </div>
                  <div className="card-preview-wrapper" style={{width: currentStep === 2 ? '100%' : undefined}}>
                    {currentStep === 2 ? (
                      /* Inline Modal Preview to prevent scroll reset */
                      <div className="fake-modal-preview">
                        <div className="fake-modal-header">
                          <h3>{title || 'Promo Title'}</h3>
                          <span className="fake-modal-close">✕</span>
                        </div>
                        <div className="fake-modal-body">
                          {longDescription ? (
                            <div className="markdown-content">
                              <ReactMarkdown>{longDescription}</ReactMarkdown>
                            </div>
                          ) : (
                            <div className="empty-preview">
                              <div className="empty-preview-icon">📝</div>
                              <p>Start typing to see preview</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Inline Card Preview */
                      <div className="incentive-card" style={{width: '100%'}}>
                        <div className="incentive-card-content">
                          <div className="incentive-top-row">
                            {parseFloat(rewardMultiplier) > 1 && (
                              <span className="incentive-badge">
                                {formatBoost(parseFloat(rewardMultiplier))} Boost
                              </span>
                            )}
                            {endsAt && useSchedule && (
                              <span className="incentive-date">
                                Ends {formatCompactDate(pstInputToUtc(endsAt))}
                              </span>
                            )}
                          </div>
                          <h3 className="incentive-title">{title || 'Promo Title'}</h3>
                          {message && <p className="incentive-description">{message}</p>}
                          {longDescription && (
                            <button className="incentive-read-more" type="button">Read more →</button>
                          )}
                          {currentStep === 3 && !selectedCategories.includes('ALL') && selectedCategories.length > 0 && (
                            <div className="incentive-footer" style={{marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)'}}>
                              <div className="incentive-categories-wrapper">
                                <span className="incentive-label">Applies to:</span>
                                <div className="incentive-categories-list">
                                  {selectedCategories.slice(0, 3).map(cat => (
                                    <span key={cat} className="category-pill">{cat}</span>
                                  ))}
                                  {selectedCategories.length > 3 && (
                                    <span className="category-pill more">+{selectedCategories.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="incentive-bg-icon">
                          {variant === 'warning' ? '🔥' : variant === 'success' ? '💰' : '🚀'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Navigation Footer */}
              <div className="onboarding-nav">
                <Button 
                  variant="ghost" 
                  onClick={currentStep === 1 ? () => setIsModalOpen(false) : handleBack}
                >
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <div className="nav-buttons">
                  {currentStep < 4 ? (
                    <Button variant="primary" onClick={handleNext} size="lg">
                      Next Step
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleSave} loading={saving} size="lg">
                      {editingId ? 'Update Promotion' : 'Launch Promotion 🚀'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromoManager;
