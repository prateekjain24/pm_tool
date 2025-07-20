import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
const ENVIRONMENT = import.meta.env.MODE;

/**
 * Initialize Sentry for the client
 */
export function initSentry() {
  // Only initialize in production
  if (!SENTRY_DSN || ENVIRONMENT === "development") {
    console.log("Sentry not initialized (development mode or missing DSN)");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: APP_VERSION,
    integrations: [
      // Note: Sentry SDK v8+ has different integration setup
      // BrowserTracing and Replay are configured differently in newer versions
    ],
    // Performance monitoring sample rate
    tracesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,
    // Filter out certain errors
    beforeSend: (event, hint) => {
      // Filter out network errors in development
      if (ENVIRONMENT === "development") {
        const error = hint.originalException;
        if (error instanceof Error && error.message.includes("NetworkError")) {
          return null;
        }
      }

      // Don't send ResizeObserver errors (common browser quirk)
      if (event.exception?.values?.[0]?.value?.includes("ResizeObserver")) {
        return null;
      }

      return event;
    },
    // Sanitize breadcrumbs
    beforeBreadcrumb: (breadcrumb) => {
      // Filter out debug console logs
      if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
        return null;
      }

      // Sanitize fetch/XHR breadcrumbs
      if (breadcrumb.category === "fetch" || breadcrumb.category === "xhr") {
        if (breadcrumb.data?.url?.includes("/api/")) {
          // Remove sensitive query parameters
          const url = new URL(breadcrumb.data.url);
          const sensitiveParams = ["token", "key", "secret"];
          sensitiveParams.forEach((param) => url.searchParams.delete(param));
          breadcrumb.data.url = url.toString();
        }
      }

      return breadcrumb;
    },
  });
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
}) {
  if (!SENTRY_DSN) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearSentryUser() {
  if (!SENTRY_DSN) return;
  Sentry.setUser(null);
}

/**
 * Capture a message with context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, any>
) {
  if (!SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureMessage(message, level);
  });
}

/**
 * Add a breadcrumb for better error context
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  if (!SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || "custom",
    level: breadcrumb.level || "info",
    data: breadcrumb.data,
    timestamp: Date.now() / 1000,
  });
}