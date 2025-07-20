import type { Context } from "hono";
import type { 
  ApiSuccessResponse, 
  ApiErrorResponse, 
  PaginatedResponse,
  BatchOperationResponse,
  ErrorCode 
} from "@shared/types";
import { ErrorCodes } from "@shared/types";
import { getRequestId } from "./requestContext";

/**
 * API Response builder utilities
 */

/**
 * Create a success response
 */
export function apiSuccess<T>(
  c: Context,
  data: T,
  options?: {
    status?: number;
    meta?: Record<string, any>;
  }
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      ...options?.meta,
    },
  };
  
  return c.json(response, (options?.status || 200) as any);
}

/**
 * Create an error response
 */
export function apiError(
  c: Context,
  options: {
    status: number;
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
  }
): Response {
  const requestId = getRequestId(c);
  
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: options.code,
      message: options.message,
      details: options.details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
  
  return c.json(response, options.status as any);
}

/**
 * Create a paginated response
 */
export function apiPaginated<T>(
  c: Context,
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
  },
  options?: {
    status?: number;
    meta?: Record<string, any>;
  }
): Response {
  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
      totalItems: pagination.totalItems,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...options?.meta,
    },
  };
  
  return c.json(response, (options?.status || 200) as any);
}

/**
 * Create a batch operation response
 */
export function apiBatchResult<T>(
  c: Context,
  results: Array<{
    id: string;
    success: boolean;
    data?: T;
    error?: string;
  }>,
  options?: {
    status?: number;
  }
): Response {
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  const response: BatchOperationResponse<T> = {
    success: true,
    results,
    summary: {
      total: results.length,
      succeeded,
      failed,
    },
  };
  
  return c.json(response, (options?.status || 200) as any);
}

/**
 * Common error response factories
 */
export const apiErrors = {
  unauthorized: (c: Context, message = "Unauthorized") =>
    apiError(c, {
      status: 401,
      code: ErrorCodes.UNAUTHORIZED,
      message,
    }),
    
  forbidden: (c: Context, message = "Access forbidden") =>
    apiError(c, {
      status: 403,
      code: ErrorCodes.FORBIDDEN,
      message,
    }),
    
  notFound: (c: Context, resource = "Resource") =>
    apiError(c, {
      status: 404,
      code: ErrorCodes.NOT_FOUND,
      message: `${resource} not found`,
    }),
    
  conflict: (c: Context, message: string, details?: Record<string, any>) =>
    apiError(c, {
      status: 409,
      code: ErrorCodes.CONFLICT,
      message,
      details,
    }),
    
  validationError: (c: Context, message: string, fields?: Record<string, string[]>) =>
    apiError(c, {
      status: 422,
      code: ErrorCodes.VALIDATION_ERROR,
      message,
      details: fields ? { fields } : undefined,
    }),
    
  rateLimited: (c: Context, message = "Too many requests") =>
    apiError(c, {
      status: 429,
      code: ErrorCodes.RATE_LIMITED,
      message,
    }),
    
  internal: (c: Context, message = "Internal server error") =>
    apiError(c, {
      status: 500,
      code: ErrorCodes.INTERNAL_ERROR,
      message,
    }),
};

/**
 * Parse pagination params from query string
 */
export function parsePaginationParams(c: Context): {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} {
  const query = c.req.query();
  
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize || "20", 10) || 20));
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";
  
  return { page, pageSize, sortBy, sortOrder };
}