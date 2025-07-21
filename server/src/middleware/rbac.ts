import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { RolePermissions } from "@shared/types";
import { getDb } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { AuthUser } from "./auth";

/**
 * Permission types for fine-grained access control
 */
export type Permission = 
  | "read"
  | "write"
  | "delete"
  | "manage_team"
  | "manage_workspace"
  | "manage_billing"
  | "manage_experiments"
  | "manage_documents";

/**
 * Resource types that can be protected
 */
export type Resource = 
  | "hypothesis"
  | "experiment"
  | "document"
  | "workspace"
  | "user"
  | "settings"
  | "invitation"
  | "team";

/**
 * Enhanced role permissions with resource-specific permissions
 */
export const EnhancedRolePermissions = {
  admin: {
    global: ["read", "write", "delete", "manage_team", "manage_workspace", "manage_billing"],
    resources: {
      hypothesis: ["read", "write", "delete", "manage_experiments"],
      experiment: ["read", "write", "delete", "manage_experiments"],
      document: ["read", "write", "delete", "manage_documents"],
      workspace: ["read", "write", "delete", "manage_workspace"],
      user: ["read", "write", "delete", "manage_team"],
      settings: ["read", "write"],
      invitation: ["read", "write", "delete", "manage_team"],
      team: ["read", "write", "delete", "manage_team"],
    },
  },
  member: {
    global: ["read", "write"],
    resources: {
      hypothesis: ["read", "write"],
      experiment: ["read", "write"],
      document: ["read", "write"],
      workspace: ["read"],
      user: ["read"],
      settings: ["read", "write"],
      invitation: ["read"],
      team: ["read"],
    },
  },
  viewer: {
    global: ["read"],
    resources: {
      hypothesis: ["read"],
      experiment: ["read"],
      document: ["read"],
      workspace: ["read"],
      user: ["read"],
      settings: ["read"],
      invitation: [],
      team: ["read"],
    },
  },
} as const;

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userRole: keyof typeof EnhancedRolePermissions,
  permission: Permission,
  resource?: Resource
): boolean {
  const rolePerms = EnhancedRolePermissions[userRole];
  
  if (!rolePerms) {
    return false;
  }

  // Check global permissions first
  if ((rolePerms.global as readonly string[]).includes(permission)) {
    return true;
  }

  // If resource is specified, check resource-specific permissions
  if (resource && rolePerms.resources[resource]) {
    return (rolePerms.resources[resource] as readonly string[]).includes(permission);
  }

  return false;
}

/**
 * RBAC middleware factory - creates middleware that checks for specific permissions
 */
export function requirePermission(permission: Permission, resource?: Resource) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    
    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    // Get user with role from database
    const db = getDb();
    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    if (!dbUser) {
      throw new HTTPException(403, { message: "User not found in database" });
    }

    const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;

    if (!hasPermission(userRole, permission, resource)) {
      throw new HTTPException(403, { 
        message: `Insufficient permissions. Required: ${permission}${resource ? ` for ${resource}` : ''}` 
      });
    }

    // Add role to context for downstream use
    c.set("userRole", userRole);
    
    await next();
  };
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(permissions: Permission[], resource?: Resource) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    
    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    // Get user with role from database
    const db = getDb();
    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    if (!dbUser) {
      throw new HTTPException(403, { message: "User not found in database" });
    }

    const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;

    const hasAnyPermission = permissions.some(permission => 
      hasPermission(userRole, permission, resource)
    );

    if (!hasAnyPermission) {
      throw new HTTPException(403, { 
        message: `Insufficient permissions. Required one of: ${permissions.join(', ')}${resource ? ` for ${resource}` : ''}` 
      });
    }

    // Add role to context for downstream use
    c.set("userRole", userRole);
    
    await next();
  };
}

/**
 * Require all of the specified permissions
 */
export function requireAllPermissions(permissions: Permission[], resource?: Resource) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    
    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    // Get user with role from database
    const db = getDb();
    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    if (!dbUser) {
      throw new HTTPException(403, { message: "User not found in database" });
    }

    const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;

    const hasAllPermissions = permissions.every(permission => 
      hasPermission(userRole, permission, resource)
    );

    if (!hasAllPermissions) {
      throw new HTTPException(403, { 
        message: `Insufficient permissions. Required all of: ${permissions.join(', ')}${resource ? ` for ${resource}` : ''}` 
      });
    }

    // Add role to context for downstream use
    c.set("userRole", userRole);
    
    await next();
  };
}

/**
 * Require specific role(s)
 */
export function requireRole(...roles: (keyof typeof EnhancedRolePermissions)[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    
    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    // Get user with role from database
    const db = getDb();
    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    if (!dbUser) {
      throw new HTTPException(403, { message: "User not found in database" });
    }

    const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;

    if (!roles.includes(userRole)) {
      throw new HTTPException(403, { 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    // Add role to context for downstream use
    c.set("userRole", userRole);
    
    await next();
  };
}

/**
 * Workspace-level permission check
 * Ensures user has permission within their current workspace
 */
export function requireWorkspacePermission(permission: Permission, resource?: Resource) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    
    if (!user) {
      throw new HTTPException(401, { message: "Authentication required" });
    }

    // Get user with role and workspace from database
    const db = getDb();
    const [dbUser] = await db
      .select({ 
        role: users.role,
        workspaceId: users.workspaceId 
      })
      .from(users)
      .where(eq(users.clerkId, user.clerkId))
      .limit(1);

    if (!dbUser) {
      throw new HTTPException(403, { message: "User not found in database" });
    }

    if (!dbUser.workspaceId) {
      throw new HTTPException(403, { message: "User not assigned to any workspace" });
    }

    const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;

    if (!hasPermission(userRole, permission, resource)) {
      throw new HTTPException(403, { 
        message: `Insufficient workspace permissions. Required: ${permission}${resource ? ` for ${resource}` : ''}` 
      });
    }

    // Add role and workspaceId to context for downstream use
    c.set("userRole", userRole);
    c.set("workspaceId", dbUser.workspaceId);
    
    await next();
  };
}

/**
 * Get user permissions helper for frontend
 */
export async function getUserPermissions(clerkId: string): Promise<{
  role: string;
  permissions: {
    global: string[];
    resources: Record<string, string[]>;
  };
}> {
  const db = getDb();
  const [dbUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const userRole = dbUser.role as keyof typeof EnhancedRolePermissions;
  const rolePerms = EnhancedRolePermissions[userRole];

  return {
    role: userRole,
    permissions: {
      global: [...rolePerms.global],
      resources: Object.fromEntries(
        Object.entries(rolePerms.resources).map(([resource, perms]) => [
          resource,
          [...perms],
        ])
      ),
    },
  };
}