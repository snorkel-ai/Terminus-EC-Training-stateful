import { useState, useEffect, useRef } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import { useAuth } from '../../contexts/AuthContext';
import './PromoBanner.css';

export default function PromoBanner({ children }) {
  const { profile } = useAuth();
  const { promotions, loading } = usePromotions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Filter out dismissed promos and promos that are card-only (disable_banner)
  const activePromos = promotions.filter(p => 
    !dismissedIds.includes(p.id) && !p.disable_banner
  );

  useEffect(() => {
    if (activePromos.length <= 1) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsTransitioning(true);
      
      // After fade out, change content and fade in
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % activePromos.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000); // 8 seconds rotation

    return () => clearInterval(interval);
  }, [activePromos.length]);

  const handleDismiss = (id) => {
    localStorage.setItem(`dismissed_promo_${id}`, 'true');
    setDismissedIds(prev => [...prev, id]);
    setCurrentIndex(0); // Reset index to avoid bounds issues
  };

  // Don't show banner if user can't see incentives
  if (!profile?.can_see_incentives) {
    return <>{children}</>;
  }

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
        {/* Background Circles */}
        <div className="promo-bg-circle" />
        <div className="promo-bg-circle" />
        {/* Raining Money Icons - only show if enabled for this promo */}
        {currentPromo.show_rain_animation !== false && (
          <>
            <span className="promo-rain promo-rain-1">💵</span>
            <span className="promo-rain promo-rain-2">💰</span>
            <span className="promo-rain promo-rain-3">💸</span>
            <span className="promo-rain promo-rain-4">🤑</span>
            <span className="promo-rain promo-rain-5">💵</span>
            <span className="promo-rain promo-rain-6">💰</span>
            <span className="promo-rain promo-rain-7">💸</span>
            <span className="promo-rain promo-rain-8">💵</span>
            <span className="promo-rain promo-rain-9">🤑</span>
            <span className="promo-rain promo-rain-10">💰</span>
            <span className="promo-rain promo-rain-11">💵</span>
            <span className="promo-rain promo-rain-12">💸</span>
          </>
        )}
      </div>
      
      {/* Progress Bar for multiple promos */}
      {activePromos.length > 1 && (
        <div key={currentPromo.id + '_progress'} className="promo-progress-bar promo-progress-animate" />
      )}
      
      <div className={`promo-banner-content ${isTransitioning ? 'promo-fade-out' : 'promo-fade-in'}`}>
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
