import { createClerkClient } from "@clerk/backend";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "../config/env";

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

// Type for the user context
export interface AuthUser {
  id: string;
  clerkId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Auth middleware for Hono that verifies Clerk JWT tokens
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      throw new HTTPException(401, { message: "No authorization header" });
    }

    // Extract the token from Bearer scheme
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new HTTPException(401, { message: "Invalid authorization format" });
    }

    // Create a mock request object for Clerk's authenticateRequest
    const mockRequest = {
      headers: new Headers({
        authorization: `Bearer ${token}`,
      }),
      url: c.req.url,
    } as Request;

    // Authenticate the request with Clerk
    const requestState = await clerk.authenticateRequest(mockRequest, {
      secretKey: env.CLERK_SECRET_KEY,
      publishableKey: env.CLERK_PUBLISHABLE_KEY,
    });

    if (!requestState.isSignedIn) {
      throw new HTTPException(401, { message: "Invalid or expired token" });
    }

    const userId = requestState.toAuth().userId;
    if (!userId) {
      throw new HTTPException(401, { message: "No user ID in token" });
    }

    // Get the full user details from Clerk
    const user = await clerk.users.getUser(userId);

    // Create our auth user object
    const authUser: AuthUser = {
      id: user.id, // In a real app, this might be a database ID
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || null,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    c.set("user", authUser);
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Auth middleware error:", error);
    throw new HTTPException(401, { message: "Authentication failed" });
  }
}

/**
 * Optional auth middleware - doesn't require authentication but adds user if token is present
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");

    if (authHeader) {
      // Extract the token from Bearer scheme
      const token = authHeader.replace("Bearer ", "");

      if (token) {
        // Create a mock request object for Clerk's authenticateRequest
        const mockRequest = {
          headers: new Headers({
            authorization: `Bearer ${token}`,
          }),
          url: c.req.url,
        } as Request;

        // Authenticate the request with Clerk
        const requestState = await clerk.authenticateRequest(mockRequest, {
          secretKey: env.CLERK_SECRET_KEY,
        });

        if (requestState.isSignedIn) {
          const userId = requestState.toAuth().userId;
          if (userId) {
            // Get the full user details from Clerk
            const user = await clerk.users.getUser(userId);

            // Create our auth user object
            const authUser: AuthUser = {
              id: user.id, // In a real app, this might be a database ID
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress || null,
              firstName: user.firstName,
              lastName: user.lastName,
            };

            c.set("user", authUser);
          }
        }
      }
    }
  } catch (error) {
    // In optional auth, we don't throw errors - just continue without auth
    console.warn("Optional auth middleware warning:", error);
  }

  await next();
}
