/**
 * Analytics utility for tracking page views and events
 * Uses Plausible Analytics (privacy-friendly, cookie-free analytics)
 */

interface PlausibleWindow extends Window {
  plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
}

declare const window: PlausibleWindow;

/**
 * Track a page view
 * @param url The URL to track (defaults to current URL)
 */
export function trackPageView(url?: string): void {
  try {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: url || window.location.pathname,
        },
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track a custom event
 * @param eventName Name of the event
 * @param props Additional properties to track with the event
 */
export function trackEvent(eventName: string, props?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Initialize analytics
 */
export function initAnalytics(): void {
  if (typeof document !== 'undefined') {
    // Create and append Plausible script
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = window.location.hostname;
    script.src = 'https://plausible.io/js/script.js';
    
    document.head.appendChild(script);
  }
} 