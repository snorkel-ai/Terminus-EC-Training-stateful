import { useState, useEffect } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import './PromoBanner.css';

export default function PromoBanner({ children }) {
  const { promotions, loading } = usePromotions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState(() => {
    // Initial read from localStorage
    const dismissed = [];
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('dismissed_promo_')) {
              dismissed.push(key.replace('dismissed_promo_', ''));
          }
      }
    }
    return dismissed;
  });

  const activePromos = promotions.filter(p => !dismissedIds.includes(p.id));

  useEffect(() => {
    if (activePromos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activePromos.length);
    }, 8000); // 8 seconds rotation

    return () => clearInterval(interval);
  }, [activePromos.length]);

  const handleDismiss = (id) => {
    localStorage.setItem(`dismissed_promo_${id}`, 'true');
    setDismissedIds(prev => [...prev, id]);
    setCurrentIndex(0); // Reset index to avoid bounds issues
  };

  if (loading) return null;
  
  if (activePromos.length === 0) {
    return <>{children}</>;
  }

  const index = currentIndex % activePromos.length;
  const currentPromo = activePromos[index];
  const variant = currentPromo.variant || 'accent';

  return (
    <div className={`global-promo-banner promo-banner--${variant}`}>
      <div className="promo-bg-decoration">
        {/* Falling Particles */}
        <div className="promo-particle">💸</div>
        <div className="promo-particle">💲</div>
        <div className="promo-particle">💸</div>
        <div className="promo-particle">💰</div>
        <div className="promo-particle">💸</div>
        <div className="promo-particle">💲</div>
        <div className="promo-particle">💸</div>
        <div className="promo-particle">💰</div>
        {/* Background Circles */}
        <div className="promo-bg-circle" />
        <div className="promo-bg-circle" />
      </div>
      
      {/* Progress Bar for multiple promos */}
      {activePromos.length > 1 && (
        <div key={currentPromo.id + '_progress'} className="promo-progress-bar promo-progress-animate" />
      )}
      
      <div key={currentPromo.id} className="promo-banner-content promo-animate-enter">
        <div className="promo-text-content">
          <span className="promo-title">{currentPromo.title}</span>
          {currentPromo.message && (
            <span className="promo-message">{currentPromo.message}</span>
          )}
        </div>

        <button 
          className="promo-dismiss-btn"
          onClick={() => handleDismiss(currentPromo.id)}
          aria-label="Dismiss promotion"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
