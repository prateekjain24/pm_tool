/**
 * Common API response types
 */

/**
 * Success response wrapper
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version?: string;
  };
}

/**
 * Error response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string; // Only in development
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  meta?: {
    timestamp: string;
  };
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Common filter parameters
 */
export interface FilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

/**
 * Batch operation response
 */
export interface BatchOperationResponse<T> {
  success: true;
  results: Array<{
    id: string;
    success: boolean;
    data?: T;
    error?: string;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: string;
    fields: Record<string, string[]>;
  };
}

/**
 * Type for API endpoints that return a single entity
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type for API endpoints that return multiple entities
 */
export type ApiListResponse<T> = PaginatedResponse<T> | ApiErrorResponse;

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  
  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",
  
  // Server errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];