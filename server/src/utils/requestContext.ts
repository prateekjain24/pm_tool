import type { Context } from "hono";

/**
 * Request context keys
 */
const REQUEST_ID_KEY = "requestId";
const REQUEST_START_TIME_KEY = "requestStartTime";

/**
 * Set request ID in context
 */
export function setRequestId(c: Context, requestId: string): void {
  c.set(REQUEST_ID_KEY, requestId);
}

/**
 * Get request ID from context
 */
export function getRequestId(c: Context): string | undefined {
  return c.get(REQUEST_ID_KEY);
}

/**
 * Set request start time in context
 */
export function setRequestStartTime(c: Context, startTime: number): void {
  c.set(REQUEST_START_TIME_KEY, startTime);
}

/**
 * Get request start time from context
 */
export function getRequestStartTime(c: Context): number | undefined {
  return c.get(REQUEST_START_TIME_KEY);
}

/**
 * Get request duration in milliseconds
 */
export function getRequestDuration(c: Context): number | undefined {
  const startTime = getRequestStartTime(c);
  if (!startTime) return undefined;

  return Date.now() - startTime;
}

/**
 * Get request metadata for logging
 */
export function getRequestMetadata(c: Context): Record<string, any> {
  return {
    requestId: getRequestId(c),
    method: c.req.method,
    path: c.req.path,
    userAgent: c.req.header("user-agent"),
    ip: c.env?.remoteAddr || c.req.header("x-forwarded-for") || "unknown",
    duration: getRequestDuration(c),
  };
}
