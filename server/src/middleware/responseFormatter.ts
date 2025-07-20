import type { Context, Next } from "hono";
import type { ApiSuccessResponse, PaginatedResponse } from "@shared/types";
import { getRequestId } from "../utils/requestContext";

/**
 * Response formatter middleware
 * Ensures all successful responses follow the ApiSuccessResponse format
 */
export async function responseFormatter(c: Context, next: Next) {
  await next();
  
  // Only format successful JSON responses
  if (c.res.status >= 200 && c.res.status < 300) {
    const contentType = c.res.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      // Get the original response body
      const body = await c.res.json() as any;
      
      // If it's already formatted correctly, skip
      if (body && typeof body === "object" && "success" in body) {
        return;
      }
      
      // Check if it's a paginated response
      if (isPaginatedData(body)) {
        const formatted: PaginatedResponse<any> = {
          success: true,
          data: body.data,
          pagination: body.pagination,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
        
        return c.json(formatted, c.res.status as any);
      }
      
      // Format as standard success response
      const formatted: ApiSuccessResponse<any> = {
        success: true,
        data: body,
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0.0", // Could be dynamic based on env
        },
      };
      
      return c.json(formatted, c.res.status as any);
    }
  }
}

/**
 * Helper to create a success response
 */
export function success<T>(
  c: Context,
  data: T,
  status = 200
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };
  
  return c.json(response, status as any);
}

/**
 * Helper to create a paginated response
 */
export function paginated<T>(
  c: Context,
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
  },
  status = 200
): Response {
  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPreviousPage: pagination.page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  
  return c.json(response, status as any);
}

/**
 * Helper to check if data looks like paginated data
 */
function isPaginatedData(data: any): boolean {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.data) &&
    data.pagination &&
    typeof data.pagination === "object"
  );
}