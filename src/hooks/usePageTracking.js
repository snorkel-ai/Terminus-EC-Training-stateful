import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * Silent page tracking hook that logs page visits to the database
 * Uses database function for efficient server-side processing
 */
export function usePageTracking() {
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Call database function - all logic runs server-side!
    const logVisit = async () => {
      try {
        await supabase.rpc('log_page_visit', {
          p_page_path: location.pathname,
          p_user_id: user.id
        });
      } catch (error) {
        // Silent fail - don't disrupt UX
        console.error('Tracking error:', error);
      }
    };
    
    // Small delay to avoid rapid-fire calls during navigation
    const timer = setTimeout(logVisit, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname, user]);
}

