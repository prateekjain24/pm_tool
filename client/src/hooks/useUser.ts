import { useUser as useClerkUser } from "@clerk/clerk-react";
import type { User } from "@shared/types";
import { useEffect, useState } from "react";

interface UseUserReturn {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  role: User["role"] | null;
  hasRole: (role: User["role"]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Mock role data (in production, this would come from your database)
const mockUserRoles = new Map<string, User["role"]>([
  ["user_2abc123", "admin"], // Example admin user
]);

// Permission mappings
const rolePermissions: Record<User["role"], string[]> = {
  admin: ["read", "write", "delete", "manage_team", "manage_workspace", "view_analytics"],
  member: ["read", "write", "view_analytics"],
  viewer: ["read"],
};

export function useUser(): UseUserReturn {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      // Get role from mock data (in production, fetch from API)
      const role = mockUserRoles.get(clerkUser.id) || "member";

      const userData: User = {
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        role,
        workspaceId: undefined, // This would come from workspace context
        createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt) : new Date(),
        updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt) : new Date(),
      };

      setUser(userData);
    } else {
      setUser(null);
    }
  }, [clerkUser, isLoaded, isSignedIn]);

  const hasRole = (role: User["role"]): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.includes(permission);
  };

  return {
    user,
    isLoaded,
    isSignedIn: isSignedIn || false,
    role: user?.role || null,
    hasRole,
    hasPermission,
  };
}

// Convenience hooks for common role checks
export function useIsAdmin(): boolean {
  const { hasRole } = useUser();
  return hasRole("admin");
}

export function useIsMember(): boolean {
  const { hasRole } = useUser();
  return hasRole("member") || hasRole("admin");
}

export function useCanWrite(): boolean {
  const { hasPermission } = useUser();
  return hasPermission("write");
}

export function useCanManageTeam(): boolean {
  const { hasPermission } = useUser();
  return hasPermission("manage_team");
}
