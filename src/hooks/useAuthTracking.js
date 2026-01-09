import { useEffect, useCallback, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useLocation } from 'react-router-dom';
import {
  AUTH_EVENTS,
  AUTH_METHODS,
  AUTH_SOURCES,
  SESSION_TYPES,
  AUTH_STORAGE_KEYS,
} from '../utils/authEvents';

/**
 * Threshold for detecting redirect loops
 * If login page is viewed more than this many times in a session, it's likely a loop
 */
const REDIRECT_LOOP_THRESHOLD = 3;

/**
 * Custom hook for comprehensive auth tracking with PostHog
 * 
 * Features:
 * - Tracks auth attempts, successes, and failures with method/source details
 * - Detects redirect loops (users stuck bouncing between login and protected routes)
 * - Deduplicates login pageviews per session
 * - Provides a unique attempt ID to correlate events
 * 
 * @returns {Object} Auth tracking functions
 */
export function useAuthTracking() {
  const posthog = usePostHog();
  const location = useLocation();
  const hasTrackedFirstView = useRef(false);

  /**
   * Generate a unique attempt ID for correlating auth events
   */
  const generateAttemptId = useCallback(() => {
    const attemptId = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.AUTH_ATTEMPT_ID, attemptId);
    } catch {
      // Storage may be unavailable
    }
    return attemptId;
  }, []);

  /**
   * Get the current attempt ID from storage
   */
  const getAttemptId = useCallback(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEYS.AUTH_ATTEMPT_ID);
    } catch {
      return null;
    }
  }, []);

  /**
   * Track when user starts an auth attempt (clicks login button)
   * 
   * @param {string} method - Auth method (github, email)
   * @param {string} source - Where the attempt originated
   * @param {Object} additionalProps - Extra properties to include
   */
  const trackAuthAttemptStarted = useCallback((method, source = AUTH_SOURCES.LOGIN_PAGE, additionalProps = {}) => {
    if (!posthog) return;

    const attemptId = generateAttemptId();
    
    posthog.capture(AUTH_EVENTS.AUTH_ATTEMPT_STARTED, {
      method,
      source,
      attempt_id: attemptId,
      current_url: window.location.href,
      ...additionalProps,
    });

    return attemptId;
  }, [posthog, generateAttemptId]);

  /**
   * Track successful authentication
   * 
   * @param {string} userId - The authenticated user's ID
   * @param {string} method - Auth method used
   * @param {Object} userProperties - Properties to set on the user
   */
  const trackAuthSuccess = useCallback((userId, method, userProperties = {}) => {
    if (!posthog) return;

    const attemptId = getAttemptId();
    
    // Determine if this is a new or returning session
    // A returning session would have had a previous identify call in this browser
    const sessionType = posthog.get_distinct_id() === userId 
      ? SESSION_TYPES.RETURNING 
      : SESSION_TYPES.NEW;

    posthog.capture(AUTH_EVENTS.AUTH_SUCCESS, {
      method,
      session_type: sessionType,
      attempt_id: attemptId,
    });

    // Identify the user with auth properties
    posthog.identify(userId, {
      is_authenticated: true,
      auth_method: method,
      last_auth_at: new Date().toISOString(),
      ...userProperties,
    });

    // Clear the login page tracking on success
    clearLoginPageTracking();
  }, [posthog, getAttemptId]);

  /**
   * Track authentication failure
   * 
   * @param {string} method - Auth method that was attempted
   * @param {Error|Object} error - The error that occurred
   * @param {Object} additionalProps - Extra properties to include
   */
  const trackAuthFailed = useCallback((method, error, additionalProps = {}) => {
    if (!posthog) return;

    const attemptId = getAttemptId();
    
    posthog.capture(AUTH_EVENTS.AUTH_FAILED, {
      method,
      error_code: error?.code || error?.name || 'unknown',
      error_message: error?.message || String(error),
      attempt_id: attemptId,
      ...additionalProps,
    });
  }, [posthog, getAttemptId]);

  /**
   * Track user logout
   */
  const trackLogout = useCallback(() => {
    if (!posthog) return;

    posthog.capture(AUTH_EVENTS.AUTH_LOGOUT);
    
    // Reset PostHog identity will be called in AuthContext.signOut
  }, [posthog]);

  /**
   * Track OAuth callback events
   * 
   * @param {string} status - 'started', 'success', or 'error'
   * @param {Object} details - Additional details about the callback
   */
  const trackAuthCallback = useCallback((status, details = {}) => {
    if (!posthog) return;

    const eventName = {
      started: AUTH_EVENTS.AUTH_CALLBACK_STARTED,
      success: AUTH_EVENTS.AUTH_CALLBACK_SUCCESS,
      error: AUTH_EVENTS.AUTH_CALLBACK_ERROR,
    }[status];

    if (eventName) {
      posthog.capture(eventName, {
        attempt_id: getAttemptId(),
        ...details,
      });
    }
  }, [posthog, getAttemptId]);

  /**
   * Increment login page view counter and check for redirect loops
   * Call this when the login page mounts
   */
  const trackLoginPageView = useCallback(() => {
    if (!posthog) return;

    try {
      // Get current view count
      const currentViews = parseInt(sessionStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_VIEWS) || '0', 10);
      const newViewCount = currentViews + 1;
      sessionStorage.setItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_VIEWS, String(newViewCount));

      // Check for redirect loop
      if (newViewCount > REDIRECT_LOOP_THRESHOLD) {
        posthog.capture(AUTH_EVENTS.AUTH_REDIRECT_LOOP_DETECTED, {
          login_view_count: newViewCount,
          user_agent: navigator.userAgent,
          current_url: window.location.href,
          referrer: document.referrer,
        });
      }

      // Track first login page view only (deduplicated)
      if (!hasTrackedFirstView.current) {
        const alreadyTracked = sessionStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_TRACKED);
        if (!alreadyTracked) {
          posthog.capture(AUTH_EVENTS.FIRST_LOGIN_PAGE_VIEW, {
            referrer: document.referrer,
            current_url: window.location.href,
          });
          sessionStorage.setItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_TRACKED, 'true');
        }
        hasTrackedFirstView.current = true;
      }
    } catch {
      // Storage may be unavailable (private browsing, etc.)
    }
  }, [posthog]);

  /**
   * Clear login page tracking counters
   * Call this after successful auth
   */
  const clearLoginPageTracking = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_VIEWS);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_TRACKED);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_ATTEMPT_ID);
    } catch {
      // Storage may be unavailable
    }
  }, []);

  /**
   * Get current login page view count (for debugging/display)
   */
  const getLoginPageViewCount = useCallback(() => {
    try {
      return parseInt(sessionStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_PAGE_VIEWS) || '0', 10);
    } catch {
      return 0;
    }
  }, []);

  return {
    // Event tracking functions
    trackAuthAttemptStarted,
    trackAuthSuccess,
    trackAuthFailed,
    trackLogout,
    trackAuthCallback,
    
    // Login page tracking
    trackLoginPageView,
    clearLoginPageTracking,
    getLoginPageViewCount,
    
    // Constants for convenience
    AUTH_METHODS,
    AUTH_SOURCES,
  };
}

export default useAuthTracking;




