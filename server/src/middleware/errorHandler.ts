import type { ApiErrorResponse, ErrorCode } from "@shared/types";
import { ErrorCodes } from "@shared/types";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { isDevelopment } from "../config/env";
import { addBreadcrumb, captureException } from "../config/sentry";
import { getUser } from "../utils/auth";
import { getLogger } from "../utils/logger";
import { getRequestId } from "../utils/requestContext";

const logger = getLogger("error-handler");

/**
 * Maps HTTP status codes to error codes
 */
const statusToErrorCode: Record<number, ErrorCode> = {
  400: ErrorCodes.INVALID_INPUT,
  401: ErrorCodes.UNAUTHORIZED,
  403: ErrorCodes.FORBIDDEN,
  404: ErrorCodes.NOT_FOUND,
  409: ErrorCodes.CONFLICT,
  422: ErrorCodes.VALIDATION_ERROR,
  429: ErrorCodes.RATE_LIMITED,
  500: ErrorCodes.INTERNAL_ERROR,
  503: ErrorCodes.SERVICE_UNAVAILABLE,
};

/**
 * Global error handling middleware
 * Catches all errors and formats them according to ApiErrorResponse
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    // Add breadcrumb for the request
    addBreadcrumb({
      message: `${c.req.method} ${c.req.path}`,
      category: "request",
      level: "info",
      data: {
        method: c.req.method,
        path: c.req.path,
        query: c.req.query(),
      },
    });

    await next();
  } catch (error) {
    const requestId = getRequestId(c);
    const user = getUser(c);

    // Log the error
    logger.error(
      {
        error,
        requestId,
        path: c.req.path,
        method: c.req.method,
      },
      "Request error",
    );

    // Capture to Sentry (except for expected errors)
    if (error instanceof Error && !(error instanceof HTTPException && error.status < 500)) {
      captureException(error, {
        user: user ? { id: user.id, email: user.email ?? undefined } : undefined,
        tags: {
          requestId: requestId ?? "unknown",
          path: c.req.path,
          method: c.req.method,
        },
        extra: {
          query: c.req.query(),
          headers: Object.fromEntries(c.req.raw.headers.entries()),
        },
      });
    }

    // Handle different error types
    if (error instanceof HTTPException) {
      return handleHTTPException(c, error, requestId);
    }

    if (error instanceof ZodError) {
      return handleZodError(c, error, requestId);
    }

    // Handle generic errors
    return handleGenericError(c, error, requestId);
  }
}

/**
 * Handle HTTPException errors
 */
function handleHTTPException(c: Context, error: HTTPException, requestId?: string) {
  const status = error.status;
  const errorCode = statusToErrorCode[status] || ErrorCodes.INTERNAL_ERROR;

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: error.message,
      details: error.cause ? { cause: error.cause } : undefined,
      stack: isDevelopment ? error.stack : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return c.json(response, status as any);
}

/**
 * Handle Zod validation errors
 */
function handleZodError(c: Context, error: ZodError, requestId?: string) {
  const fields: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!fields[path]) {
      fields[path] = [];
    }
    fields[path].push(err.message);
  });

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Validation failed",
      details: { fields },
      stack: isDevelopment ? error.stack : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return c.json(response, 422 as any);
}

/**
 * Handle generic/unknown errors
 */
function handleGenericError(c: Context, error: unknown, requestId?: string) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  const stack = error instanceof Error && isDevelopment ? error.stack : undefined;

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: isDevelopment ? message : "Internal server error",
      stack,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return c.json(response, 500 as any);
}

/**
 * Create a custom HTTPException with error code
 */
export function createError(
  status: number,
  message: string,
  code?: ErrorCode,
  details?: Record<string, any>,
): HTTPException {
  const error = new HTTPException(status as any, { message });
  if (code || details) {
    error.cause = { code, details };
  }
  return error;
}

/**
 * Common error factories
 */
export const errors = {
  unauthorized: (message = "Unauthorized") => createError(401, message, ErrorCodes.UNAUTHORIZED),

  forbidden: (message = "Forbidden") => createError(403, message, ErrorCodes.FORBIDDEN),

  notFound: (resource = "Resource") =>
    createError(404, `${resource} not found`, ErrorCodes.NOT_FOUND),

  conflict: (message: string, details?: Record<string, any>) =>
    createError(409, message, ErrorCodes.CONFLICT, details),

  validationError: (message: string, fields?: Record<string, string[]>) =>
    createError(422, message, ErrorCodes.VALIDATION_ERROR, { fields }),

  rateLimited: (message = "Too many requests") =>
    createError(429, message, ErrorCodes.RATE_LIMITED),

  internal: (message = "Internal server error") =>
    createError(500, message, ErrorCodes.INTERNAL_ERROR),
};
