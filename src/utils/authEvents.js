/**
 * Auth event constants for PostHog tracking
 * Centralized to ensure consistent naming across the codebase
 * 
 * @see https://posthog.com/docs/product-analytics/capture-events
 */

/**
 * Auth event names for PostHog tracking
 * @readonly
 * @enum {string}
 */
export const AUTH_EVENTS = {
  // Auth flow events
  AUTH_ATTEMPT_STARTED: 'auth_attempt_started',
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILED: 'auth_failed',
  AUTH_LOGOUT: 'auth_logout',
  
  // Redirect/loop detection
  AUTH_REDIRECT_LOOP_DETECTED: 'auth_redirect_loop_detected',
  
  // Session-based pageview tracking (deduped)
  FIRST_LOGIN_PAGE_VIEW: 'first_login_page_view_in_session',
  
  // OAuth callback events
  AUTH_CALLBACK_STARTED: 'auth_callback_started',
  AUTH_CALLBACK_SUCCESS: 'auth_callback_success',
  AUTH_CALLBACK_ERROR: 'auth_callback_error',
};

/**
 * Auth methods for tracking
 * @readonly
 * @enum {string}
 */
export const AUTH_METHODS = {
  GITHUB: 'github',
  EMAIL: 'email',
};

/**
 * Auth sources - where the auth attempt originated
 * @readonly
 * @enum {string}
 */
export const AUTH_SOURCES = {
  LOGIN_PAGE: 'login_page',
  AUTH_PAGE: 'auth_page',
  AUTO_REDIRECT: 'auto_redirect',
  PROTECTED_ROUTE: 'protected_route',
};

/**
 * Session types for auth_success events
 * @readonly
 * @enum {string}
 */
export const SESSION_TYPES = {
  NEW: 'new',
  RETURNING: 'returning',
};

/**
 * Storage keys for session-based tracking
 * @readonly
 */
export const AUTH_STORAGE_KEYS = {
  LOGIN_PAGE_VIEWS: 'tb_login_page_views',
  LOGIN_PAGE_TRACKED: 'tb_login_page_tracked',
  AUTH_ATTEMPT_ID: 'tb_auth_attempt_id',
};


