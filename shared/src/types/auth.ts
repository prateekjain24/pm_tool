/**
 * User type representing an authenticated user
 */
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  workspaceId?: string;
  role: "admin" | "member" | "viewer";
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Session type for user sessions
 */
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

/**
 * Role permissions
 */
export const RolePermissions = {
  admin: ["read", "write", "delete", "manage_team"],
  member: ["read", "write"],
  viewer: ["read"],
} as const;

/**
 * Auth response types
 */
export interface AuthStatusResponse {
  authenticated: boolean;
  user: {
    id: string;
    email: string | null;
    name: string;
  } | null;
}

export interface UserProfileResponse {
  success: boolean;
  data: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}
