import { useState, useEffect } from 'react';
import { subscribeToAuthHealth } from '../lib/supabase';

/**
 * Tracks whether the Supabase auth service is reachable, inferred from
 * the Supabase client's own requests (token refresh, session restore, etc.).
 *
 * No separate health-check probe — those hit the CDN layer which responds
 * even when the backend is down, giving false positives.
 *
 * The fetch wrapper in supabase.js detects:
 * - 5xx responses → unhealthy
 * - Network errors → unhealthy
 * - Requests hanging too long → unhealthy
 * - Successful responses → healthy
 */
export function useSupabaseHealth() {
  const [isHealthy, setIsHealthy] = useState(null);

  useEffect(() => {
    return subscribeToAuthHealth(setIsHealthy);
  }, []);

  return { isHealthy };
}
