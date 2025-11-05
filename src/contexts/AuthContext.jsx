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
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          console.log('Upserting user profile...');
          await upsertUserProfile(session.user);
        }
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      console.log('Profile fetched:', data);
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

  const upsertUserProfile = async (user) => {
    try {
      console.log('Upserting user:', user.email);
      console.log('User data:', {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
        avatar: user.user_metadata?.avatar_url
      });
      
      // Try the upsert with detailed logging
      const userRecord = {
        id: user.id,
        email: user.email,
        github_username: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
        github_avatar_url: user.user_metadata?.avatar_url,
        last_active: new Date().toISOString(),
      };

      console.log('Attempting upsert with record:', userRecord);
      console.log('Starting upsert at:', new Date().toISOString());
      
      // Check if we can even make a simple query first
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      console.log('Pre-check count query result:', { count, countError });
      
      const { data, error, status, statusText } = await supabase
        .from('users')
        .upsert(userRecord, {
          onConflict: 'id'
        })
        .select();  // Add .select() to return the inserted/updated record

      console.log('Upsert completed at:', new Date().toISOString());
      console.log('Upsert response:', { data, error, status, statusText });

      if (error) {
        console.error('Upsert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      console.log('User upserted successfully');
    } catch (error) {
      console.error('Error upserting user profile:', error);
      // Don't block login even if upsert fails
    }
  };

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

