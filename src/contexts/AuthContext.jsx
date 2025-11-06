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
    // Failsafe timeout - if loading takes more than 10 seconds, something is wrong
    const timeout = setTimeout(() => {
      console.warn('Loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000);

    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        clearTimeout(timeout);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).finally(() => clearTimeout(timeout));
      } else {
        setLoading(false);
        clearTimeout(timeout);
      }
    }).catch(error => {
      console.error('Unexpected error getting session:', error);
      setLoading(false);
      clearTimeout(timeout);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Trigger handles profile creation automatically - just fetch it
        console.log('Fetching user profile after auth change...');
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for:', userId);
      console.log('About to query profiles table...');
      
      const queryStart = Date.now();
      const result = await supabase
        .from('profiles')  // Changed from 'users' to 'profiles'
        .select('*')
        .eq('id', userId)
        .single();
      
      const queryTime = Date.now() - queryStart;
      console.log(`Query completed in ${queryTime}ms`);
      console.log('Query result:', result);

      const { data, error } = result;

      if (error) {
        console.error('Error fetching profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If profile doesn't exist, create it (fallback)
        if (error.code === 'PGRST116') {
          console.log('Profile not found - this should not happen with trigger');
        }
        throw error;
      }
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Even if profile fetch fails, user is still authenticated
      setProfile(null);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  // Removed upsertUserProfile - the database trigger handles profile creation automatically

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
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

  const value = {
    user,
    profile,
    loading,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

