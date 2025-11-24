import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and restart the dev server.'
  );
}

// Create Supabase client (official pattern)
// Note: autoRefreshToken, persistSession, and detectSessionInUrl are true by default
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

