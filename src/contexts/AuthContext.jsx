import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { supabase } from '../lib/supabase';
import { AUTH_EVENTS, AUTH_METHODS, SESSION_TYPES, AUTH_STORAGE_KEYS } from '../utils/authEvents';

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
  const posthog = usePostHog();

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

  /**
   * Clear auth tracking storage after successful login
   */
  const clearAuthTracking = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_VIEWS);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_TRACKED);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_ATTEMPT_ID);
    } catch {
      // Storage may be unavailable
    }
  }, []);

  /**
   * Get the stored auth attempt ID for correlating events
   */
  const getAttemptId = useCallback(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEYS.AUTH_ATTEMPT_ID);
    } catch {
      return null;
    }
  }, []);

  const fetchUserProfile = async (userId, retryCount = 0, authMethod = null) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 500;
    
    try {
      // Select only needed columns to reduce egress
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, github_username, github_avatar_url, first_name, last_name, bio, linkedin_url, website_url, specialties, onboarding_completed, slack_joined, payments_setup, dev_env_setup, is_admin, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile not found and we haven't exhausted retries, wait and retry
        // This handles the race condition where the database trigger hasn't finished yet
        if (error.code === 'PGRST116' && retryCount < MAX_RETRIES) {
          console.log(`Profile not ready yet, retrying in ${RETRY_DELAY_MS}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          return fetchUserProfile(userId, retryCount + 1, authMethod);
        }
        throw error;
      }
      
      setProfile(data);
      
      // Identify user in PostHog for analytics and track auth success
      if (posthog && data) {
        // Determine auth method from profile if not provided
        const method = authMethod || (data.github_username ? AUTH_METHODS.GITHUB : AUTH_METHODS.EMAIL);
        
        // Determine session type (new vs returning)
        const sessionType = posthog.get_distinct_id() === userId 
          ? SESSION_TYPES.RETURNING 
          : SESSION_TYPES.NEW;
        
        // Track auth success event
        posthog.capture(AUTH_EVENTS.AUTH_SUCCESS, {
          method,
          session_type: sessionType,
          attempt_id: getAttemptId(),
        });
        
        // Identify user with auth properties
        posthog.identify(userId, {
          email: data.email,
          github_username: data.github_username,
          name: [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined,
          created_at: data.created_at,
          is_authenticated: true,
          auth_method: method,
          last_auth_at: new Date().toISOString(),
        });
        
        // Clear login page tracking on success
        clearAuthTracking();
      }
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
      // Track logout event before signing out
      if (posthog) {
        posthog.capture(AUTH_EVENTS.AUTH_LOGOUT);
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      
      // Reset PostHog identity on sign out
      if (posthog) {
        posthog.reset();
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      // Call the edge function to delete the user account
      // The edge function uses the service role key to call auth.admin.deleteUser()
      // CASCADE constraints on the database will clean up profiles, user_progress, etc.
      const { error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });
      
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setProfile(null);
      
      // Reset PostHog identity
      if (posthog) {
        posthog.reset();
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { error };
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

  const resetPassword = async (email) => {
    try {
      // Get the base path for redirect URL
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      let basePath = '';
      
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (pathParts[0] === 'Terminus-EC-Training-stateful') {
          basePath = '/Terminus-EC-Training-stateful';
        }
      } else {
        basePath = '/Terminus-EC-Training-stateful';
      }
      
      const redirectTo = `${window.location.origin}${basePath}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
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
    deleteAccount,
    completeOnboarding,
    updateProfile,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
