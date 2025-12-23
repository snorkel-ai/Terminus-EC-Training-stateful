import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePromotions } from '../hooks/usePromotions';
import { useAuth } from '../contexts/AuthContext';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from './ui';
import './IncentivesSection.css';

function IncentivesSection() {
  const { profile } = useAuth();
  const { promotions, loading } = usePromotions();
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Don't show incentives if user doesn't have the flag
  if (!profile?.can_see_incentives) {
    return null;
  }

  // Only show active promos that aren't disabled for card display
  const activePromos = promotions.filter(p => p.is_active && !p.disable_card);

  if (loading || activePromos.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatBoost = (multiplier) => {
    const boost = Math.round((multiplier - 1) * 100);
    return `+${boost}%`;
  };

  return (
    <section className="incentives-section">
      <div className="incentives-header">
        <h2>Active Incentives</h2>
      </div>

      <div className="incentives-grid">
        {activePromos.map(promo => {
          const isGlobal = promo.categories.includes('ALL');
          const isBannerOnly = promo.categories.length === 0;
          const hasLongDescription = !!promo.long_description;

          return (
            <div key={promo.id} className="incentive-card">
              <div className="incentive-card-content">
                <div className="incentive-top-row">
                  {promo.reward_multiplier > 1 && (
                    <span className="incentive-badge">
                      {formatBoost(promo.reward_multiplier)} Boost
                    </span>
                  )}
                  {promo.ends_at && (
                    <span className="incentive-date">
                      Ends {formatDate(promo.ends_at)}
                    </span>
                  )}
                </div>

                <h3 className="incentive-title">{promo.title}</h3>
                
                {(promo.message || hasLongDescription) && (
                  <div className="incentive-description-wrapper">
                    {promo.message && (
                      <p className="incentive-description">{promo.message}</p>
                    )}
                    {hasLongDescription && (
                      <button 
                        className="incentive-read-more"
                        onClick={() => setSelectedPromo(promo)}
                      >
                        Read more →
                      </button>
                    )}
                  </div>
                )}

                {/* Only show footer for specific category promos (not global, not banner-only) */}
                {!isGlobal && !isBannerOnly && (
                  <div className="incentive-footer">
                    <div className="incentive-categories-wrapper">
                      <span className="incentive-label">Applies to:</span>
                      <div className="incentive-categories-list">
                        {promo.categories.slice(0, 3).map(cat => (
                          <span key={cat} className="category-pill">
                            {cat}
                          </span>
                        ))}
                        {promo.categories.length > 3 && (
                          <span className="category-pill more">+{promo.categories.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Decorative background icon */}
              <div className="incentive-bg-icon">
                {promo.variant === 'warning' ? '🔥' : promo.variant === 'success' ? '💰' : '🚀'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedPromo && (
        <Modal isOpen={!!selectedPromo} onClose={() => setSelectedPromo(null)} size="lg">
          <ModalHeader onClose={() => setSelectedPromo(null)}>
            <div className="incentive-modal-header">
              {selectedPromo.reward_multiplier > 1 && (
                <span className="incentive-badge">
                  {formatBoost(selectedPromo.reward_multiplier)} Boost
                </span>
              )}
              <h2>{selectedPromo.title}</h2>
              {selectedPromo.ends_at && (
                <p className="incentive-modal-date">Ends {formatDate(selectedPromo.ends_at)}</p>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="incentive-modal-content">
              {selectedPromo.long_description && (
                <div className="incentive-full-message markdown-content">
                  <ReactMarkdown>{selectedPromo.long_description}</ReactMarkdown>
                </div>
              )}
              
              {/* Show categories if applicable */}
              {selectedPromo.categories.length > 0 && !selectedPromo.categories.includes('ALL') && (
                <div className="incentive-modal-categories">
                  <span className="incentive-label">Applies to:</span>
                  <div className="incentive-categories-list">
                    {selectedPromo.categories.map(cat => (
                      <span key={cat} className="category-pill">{cat}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedPromo.categories.includes('ALL') && (
                <div className="incentive-modal-categories">
                  <span className="category-pill global">All categories</span>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedPromo(null)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </section>
  );
}

export default IncentivesSection;
