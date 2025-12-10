import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for fetching and managing task recommendations.
 * Provides personalized "For You", "Popular Now", and "Featured" task lists.
 */
export function useTaskRecommendations(allTasks = [], myTasks = []) {
  const { user } = useAuth();
  const [popularTaskIds, setPopularTaskIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch popular tasks from the database
  useEffect(() => {
    async function fetchPopularTasks() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('v_popular_tasks')
          .select('task_id, claim_count')
          .order('claim_count', { ascending: false })
          .limit(20);

        if (fetchError) throw fetchError;
        
        setPopularTaskIds(data?.map(d => d.task_id) || []);
      } catch (err) {
        console.error('Error fetching popular tasks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularTasks();
  }, []);

  // Get available tasks (not already selected by anyone)
  const availableTasks = useMemo(() => {
    return allTasks.filter(t => !t.is_selected);
  }, [allTasks]);

  // "For You" - Tasks similar to what user has claimed (same category/subcategory)
  const forYouTasks = useMemo(() => {
    if (myTasks.length === 0) return [];
    
    // Get categories and subcategories from user's claimed tasks
    const myCategories = new Set(myTasks.map(t => t.category).filter(Boolean));
    const mySubcategories = new Set(myTasks.map(t => t.subcategory).filter(Boolean));
    const myTaskIds = new Set(myTasks.map(t => t.id));
    
    // Score tasks based on similarity
    const scoredTasks = availableTasks
      .filter(t => !myTaskIds.has(t.id))
      .map(task => {
        let score = 0;
        
        // Higher score for matching subcategory
        if (mySubcategories.has(task.subcategory)) {
          score += 3;
        }
        
        // Lower score for just matching category
        if (myCategories.has(task.category)) {
          score += 1;
        }
        
        // Bonus for priority tasks
        if (task.is_highlighted) {
          score += 0.5;
        }
        
        return { ...task, similarityScore: score };
      })
      .filter(t => t.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore);
    
    return scoredTasks.slice(0, 10);
  }, [availableTasks, myTasks]);

  // "Popular Now" - Most claimed tasks in last 7 days
  const popularTasks = useMemo(() => {
    if (popularTaskIds.length === 0) return [];
    
    const popularSet = new Set(popularTaskIds);
    return availableTasks
      .filter(t => popularSet.has(t.id))
      .slice(0, 10);
  }, [availableTasks, popularTaskIds]);

  // "Featured" - Admin-curated priority/highlighted tasks
  const featuredTasks = useMemo(() => {
    return availableTasks
      .filter(t => t.is_highlighted || t.priority_tag)
      .sort((a, b) => {
        // Sort by display_order first, then by category
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.category || '').localeCompare(b.category || '');
      })
      .slice(0, 10);
  }, [availableTasks]);

  // "Quick Start" - Easy tasks for new users (when no history)
  const quickStartTasks = useMemo(() => {
    if (myTasks.length > 0) return [];
    
    return availableTasks
      .filter(t => t.difficulty?.toLowerCase() === 'easy' || t.difficulty?.toLowerCase() === 'medium')
      .slice(0, 6);
  }, [availableTasks, myTasks]);

  // "Diverse Picks" - One from each category for exploration
  const diversePicks = useMemo(() => {
    const picks = [];
    const seenCategories = new Set();
    
    // Shuffle available tasks for variety
    const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
    
    for (const task of shuffled) {
      if (seenCategories.has(task.category)) continue;
      seenCategories.add(task.category);
      picks.push(task);
      if (picks.length >= 9) break;
    }
    
    return picks;
  }, [availableTasks]);

  // Get a single random task ("Surprise Me" feature)
  const getRandomTask = () => {
    if (availableTasks.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    return availableTasks[randomIndex];
  };

  // Check if we have any recommendations to show
  const hasRecommendations = 
    forYouTasks.length > 0 || 
    popularTasks.length > 0 || 
    featuredTasks.length > 0;

  // Get all recommendation sections with data
  const sections = useMemo(() => {
    const result = [];
    
    if (featuredTasks.length > 0) {
      result.push({
        id: 'featured',
        title: 'Featured',
        subtitle: 'Admin-curated priority tasks',
        icon: 'star',
        tasks: featuredTasks
      });
    }
    
    if (forYouTasks.length > 0) {
      result.push({
        id: 'for-you',
        title: 'For You',
        subtitle: 'Based on your task history',
        icon: 'user',
        tasks: forYouTasks
      });
    }
    
    if (popularTasks.length > 0) {
      result.push({
        id: 'popular',
        title: 'Popular Now',
        subtitle: 'Trending in the last 7 days',
        icon: 'trending',
        tasks: popularTasks
      });
    }
    
    if (quickStartTasks.length > 0) {
      result.push({
        id: 'quick-start',
        title: 'Quick Start',
        subtitle: 'Great tasks for getting started',
        icon: 'zap',
        tasks: quickStartTasks
      });
    }
    
    if (diversePicks.length > 0 && result.length < 2) {
      result.push({
        id: 'diverse',
        title: 'Explore Categories',
        subtitle: 'One from each area',
        icon: 'compass',
        tasks: diversePicks
      });
    }
    
    return result;
  }, [featuredTasks, forYouTasks, popularTasks, quickStartTasks, diversePicks]);

  return {
    // Individual recommendation lists
    forYouTasks,
    popularTasks,
    featuredTasks,
    quickStartTasks,
    diversePicks,
    
    // Combined sections for UI
    sections,
    
    // Utility
    getRandomTask,
    hasRecommendations,
    
    // Loading state
    loading,
    error
  };
}





