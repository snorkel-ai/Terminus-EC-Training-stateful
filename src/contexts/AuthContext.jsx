import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Removed upsertUserProfile - the database trigger handles profile creation automatically

  const signInWithGitHub = async () => {
    try {
      // Construct redirect URL - use the current origin and pathname structure
      // Extract base path from current location
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      let basePath = '';
      
      // If we're on localhost with the base path, include it
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Check if path includes the repo name
        if (pathParts[0] === 'Terminus-EC-Training-stateful') {
          basePath = '/Terminus-EC-Training-stateful';
        }
      } else {
        // Production: always include base path
        basePath = '/Terminus-EC-Training-stateful';
      }
      
      const redirectTo = `${window.location.origin}${basePath}/portal`;
      
      console.log('🔐 OAuth Debug Info:');
      console.log('  Current URL:', window.location.href);
      console.log('  Redirect To:', redirectTo);
      console.log('  Origin:', window.location.origin);
      console.log('  Pathname:', window.location.pathname);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectTo,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      // Get the base path from the current location
      const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
      const emailRedirectTo = `${window.location.origin}${basePath}/portal`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: emailRedirectTo,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const completeOnboarding = async (specialties = []) => {
    try {
      const updates = { onboarding_completed: true };
      if (specialties && specialties.length > 0) {
        updates.specialties = specialties;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      // Update local state
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updates }));
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    completeOnboarding,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

