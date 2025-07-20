import * as Sentry from "@sentry/node";
import { env } from "./env";
import { getLogger } from "../utils/logger";

const logger = getLogger("sentry");

/**
 * Initialize Sentry error tracking
 */
export function initSentry() {
  // Only initialize in production
  if (!env.SENTRY_DSN || env.NODE_ENV === "development") {
    logger.info("Sentry not initialized (development mode or missing DSN)");
    return;
  }

  try {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      release: env.APP_VERSION || "1.0.0",
      tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [
        // Note: Sentry SDK v7+ has these integrations enabled by default
        // HTTP tracking, console capture, and context lines are automatic
      ],
      beforeSend: (event, hint) => {
        // Filter out certain errors in production
        if (env.NODE_ENV === "production") {
          // Don't send 404 errors
          if (event.exception?.values?.[0]?.value?.includes("404")) {
            return null;
          }
          
          // Don't send validation errors
          if (event.exception?.values?.[0]?.type === "ZodError") {
            return null;
          }
        }
        
        return event;
      },
      beforeBreadcrumb: (breadcrumb) => {
        // Filter out sensitive breadcrumbs
        if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
          return null;
        }
        
        // Sanitize data
        if (breadcrumb.data) {
          const sensitiveKeys = ["password", "token", "secret", "api_key"];
          sensitiveKeys.forEach((key) => {
            if (breadcrumb.data && breadcrumb.data[key]) {
              breadcrumb.data[key] = "[REDACTED]";
            }
          });
        }
        
        return breadcrumb;
      },
    });

    logger.info("Sentry initialized successfully");
  } catch (error) {
    logger.error(error, "Failed to initialize Sentry");
  }
}

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error,
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser({
        id: context.user.id,
        email: context.user.email,
      });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture a message with additional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, any>
) {
  if (!env.SENTRY_DSN) {
    return;
  }

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
 * Add breadcrumb for better error context
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || "custom",
    level: breadcrumb.level || "info",
    data: breadcrumb.data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: { id: string; email?: string; role?: string }) {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext() {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.setUser(null);
}