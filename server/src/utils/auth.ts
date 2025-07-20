import type { Context } from "hono";
import type { AuthUser } from "../middleware/auth";

/**
 * Get the authenticated user from the context
 * @param c - Hono context
 * @returns The authenticated user or null
 */
export function getUser(c: Context): AuthUser | null {
  return c.get("user") || null;
}

/**
 * Get the authenticated user from the context, throwing if not found
 * @param c - Hono context
 * @returns The authenticated user
 * @throws Error if user is not authenticated
 */
export function requireUser(c: Context): AuthUser {
  const user = getUser(c);
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

/**
 * Check if the request is authenticated
 * @param c - Hono context
 * @returns true if authenticated, false otherwise
 */
export function isAuthenticated(c: Context): boolean {
  return !!getUser(c);
}
