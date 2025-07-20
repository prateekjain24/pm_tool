import type { Context, Next } from "hono";
import { getUser } from "../utils/auth";
import { getLogger } from "../utils/logger";
import { getRequestId, setRequestId } from "../utils/requestContext";

const logger = getLogger("http");

/**
 * Generates a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sanitizes headers by removing sensitive information
 */
function sanitizeHeaders(headers: Headers): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const sensitiveHeaders = ["authorization", "cookie", "x-api-key"];

  headers.forEach((value, key) => {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}

/**
 * Logging middleware that logs all requests and responses
 */
export async function loggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const requestId = generateRequestId();

  // Set request ID in context
  setRequestId(c, requestId);

  // Add request ID to response headers
  c.header("X-Request-ID", requestId);

  // Extract request info
  const req = c.req;
  const method = req.method;
  const path = req.path;
  const query = req.query();
  const headers = sanitizeHeaders(req.raw.headers);

  // Log request
  logger.info(
    {
      type: "request",
      requestId,
      method,
      path,
      query,
      headers,
      ip: c.env?.remoteAddr || req.header("x-forwarded-for") || "unknown",
      userAgent: req.header("user-agent"),
    },
    `${method} ${path}`,
  );
  await next();

  // Log response
  const duration = Date.now() - start;
  const status = c.res.status;
  const user = getUser(c);

  logger.info(
    {
      type: "response",
      requestId,
      method,
      path,
      status,
      duration,
      userId: user?.id,
      userEmail: user?.email,
    },
    `${method} ${path} ${status} ${duration}ms`,
  );

  // Add timing header
  c.header("X-Response-Time", `${duration}ms`);
}

/**
 * Performance monitoring middleware
 */
export async function performanceMiddleware(c: Context, next: Next) {
  const start = Date.now();

  // Set start time in context for other middleware to use
  c.set("requestStartTime", start);

  await next();

  const duration = Date.now() - start;

  // Log slow requests
  if (duration > 1000) {
    logger.warn(
      {
        requestId: getRequestId(c),
        method: c.req.method,
        path: c.req.path,
        duration,
      },
      `Slow request detected: ${c.req.method} ${c.req.path} took ${duration}ms`,
    );
  }

  // Add Server-Timing header for performance debugging
  c.header("Server-Timing", `total;dur=${duration}`);
}
