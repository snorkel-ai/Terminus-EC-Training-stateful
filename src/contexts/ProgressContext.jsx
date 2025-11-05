import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProgressContext = createContext({});

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progressItems, setProgressItems] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all progress items (catalog)
  useEffect(() => {
    fetchProgressItems();
  }, []);

  // Fetch user's progress when user logs in
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    } else {
      setUserProgress({});
      setLoading(false);
    }
  }, [user]);

  const fetchProgressItems = async () => {
    try {
      const { data, error } = await supabase
        .from('progress_items')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setProgressItems(data || []);
    } catch (error) {
      console.error('Error fetching progress items:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert array to object for easy lookup
      const progressMap = {};
      data?.forEach(item => {
        progressMap[item.progress_item_id] = item;
      });
      
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (itemId) => {
    if (!user) return;

    const currentProgress = userProgress[itemId];
    const newCompletedState = !currentProgress?.completed;

    // Optimistic update
    setUserProgress(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        completed: newCompletedState,
        completed_at: newCompletedState ? new Date().toISOString() : null,
      }
    }));

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          progress_item_id: itemId,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,progress_item_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling completion:', error);
      // Revert optimistic update on error
      setUserProgress(prev => ({
        ...prev,
        [itemId]: currentProgress
      }));
    }
  };

  const isCompleted = (itemId) => {
    return userProgress[itemId]?.completed || false;
  };

  const getCompletionPercentage = () => {
    if (progressItems.length === 0) return 0;
    
    const completedCount = Object.values(userProgress).filter(
      p => p.completed
    ).length;
    
    return Math.round((completedCount / progressItems.length) * 100);
  };

  const getCoreCompletionPercentage = () => {
    const coreItems = progressItems.filter(item => item.is_core);
    if (coreItems.length === 0) return 0;
    
    const completedCoreCount = coreItems.filter(
      item => userProgress[item.id]?.completed
    ).length;
    
    return Math.round((completedCoreCount / coreItems.length) * 100);
  };

  const getCompletedCount = () => {
    return Object.values(userProgress).filter(p => p.completed).length;
  };

  const value = {
    progressItems,
    userProgress,
    loading,
    toggleCompletion,
    isCompleted,
    getCompletionPercentage,
    getCoreCompletionPercentage,
    getCompletedCount,
    totalItems: progressItems.length,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

