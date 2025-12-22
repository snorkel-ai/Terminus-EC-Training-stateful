import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePromotions();
  }, []);

  const fetchActivePromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('v_active_promotions')
        .select('*');

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  return { promotions, loading };
}

