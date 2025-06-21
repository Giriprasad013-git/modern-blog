/**
 * Error tracking utility using Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking
 */
export function initErrorTracking(): void {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      // Performance monitoring
      tracesSampleRate: 0.5, // Capture 50% of transactions for performance monitoring
      // Session replay
      replaysSessionSampleRate: 0.1, // Sample rate for session replay - 10%
      replaysOnErrorSampleRate: 1.0, // Sample rate for errors - 100%
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'dev',
    });
  }
}

/**
 * Track an error manually
 * @param error Error object or error message
 * @param context Additional context information
 */
export function trackError(error: Error | string, context?: Record<string, any>): void {
  if (typeof error === 'string') {
    Sentry.captureMessage(error, {
      level: 'error',
      ...(context && { extra: context }),
    });
  } else {
    Sentry.captureException(error, {
      ...(context && { extra: context }),
    });
  }
}

/**
 * Set user information for error tracking
 * @param user User information
 */
export function setUserContext(user: { id?: string; email?: string; username?: string }): void {
  Sentry.setUser(user);
}

/**
 * Clear user information
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
} 