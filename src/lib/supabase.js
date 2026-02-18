import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and restart the dev server.'
  );
}

// ---------------------------------------------------------------------------
// Auth health tracking — inferred from the Supabase client's own requests.
// No separate health-check fetch required.
// ---------------------------------------------------------------------------
let _authHealthy = null;
const _listeners = new Set();

function setAuthHealthy(healthy) {
  if (_authHealthy !== healthy) {
    _authHealthy = healthy;
    _listeners.forEach((fn) => fn(healthy));
  }
}

/**
 * Subscribe to auth-health changes. The listener fires immediately with the
 * current value (if known) and again whenever it changes.
 * Returns an unsubscribe function.
 */
export function subscribeToAuthHealth(listener) {
  _listeners.add(listener);
  if (_authHealthy !== null) listener(_authHealthy);
  return () => _listeners.delete(listener);
}

/** Read the current health state without subscribing. */
export function getAuthHealthy() {
  return _authHealthy;
}

// If an auth request is still pending after this long, assume the service is
// degraded. Much shorter than Cloudflare's ~40s 522 timeout so the banner
// appears quickly.
const SLOW_REQUEST_THRESHOLD_MS = 5000;

/**
 * Custom fetch wrapper passed to the Supabase client.
 * Intercepts responses on auth endpoints to infer service health.
 * Also detects "hanging" requests that haven't resolved in time.
 */
function healthTrackingFetch(url, options) {
  const isAuthRequest = typeof url === 'string' && url.includes('/auth/v1/');

  // If an auth request is still in-flight after the threshold, proactively
  // signal unhealthy so the banner shows without waiting for the full timeout.
  let slowTimer;
  if (isAuthRequest) {
    slowTimer = setTimeout(() => setAuthHealthy(false), SLOW_REQUEST_THRESHOLD_MS);
  }

  return fetch(url, options).then(
    (response) => {
      if (isAuthRequest) {
        clearTimeout(slowTimer);
        setAuthHealthy(response.status < 500);
      }
      return response;
    },
    (error) => {
      if (isAuthRequest) {
        clearTimeout(slowTimer);
        setAuthHealthy(false);
      }
      throw error;
    },
  );
}

// Create Supabase client with health-tracking fetch
// Note: autoRefreshToken, persistSession, and detectSessionInUrl are true by default
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: healthTrackingFetch },
});
