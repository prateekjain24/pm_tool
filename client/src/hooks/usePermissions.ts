import { useUser as useClerkUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useApiClient } from "@client/lib/api";
import type { User } from "@shared/types";

// Import types from backend RBAC
type Permission = 
  | "read"
  | "write"
  | "delete"
  | "manage_team"
  | "manage_workspace"
  | "manage_billing"
  | "manage_experiments"
  | "manage_documents";

type Resource = 
  | "hypothesis"
  | "experiment"
  | "document"
  | "workspace"
  | "user"
  | "settings"
  | "invitation"
  | "team";

interface UserPermissions {
  role: string;
  permissions: {
    global: string[];
    resources: Record<string, string[]>;
  };
}

interface UsePermissionsReturn {
  permissions: UserPermissions | null;
  isLoading: boolean;
  hasPermission: (permission: Permission, resource?: Resource) => boolean;
  hasAnyPermission: (permissions: Permission[], resource?: Resource) => boolean;
  hasAllPermissions: (permissions: Permission[], resource?: Resource) => boolean;
  hasRole: (role: User["role"]) => boolean;
  canAccessResource: (resource: Resource) => boolean;
  refetch: () => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiClient();

  const fetchPermissions = async () => {
    if (!clerkUser) {
      setPermissions(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.getUserPermissions();
      setPermissions(response as UserPermissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      // Fallback to default member permissions
      setPermissions({
        role: "member",
        permissions: {
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchPermissions();
    } else {
      setPermissions(null);
    }
  }, [clerkUser, isLoaded]);

  const hasPermission = (permission: Permission, resource?: Resource): boolean => {
    if (!permissions) return false;

    // Check global permissions first
    if (permissions.permissions.global.includes(permission)) {
      return true;
    }

    // If resource is specified, check resource-specific permissions
    if (resource && permissions.permissions.resources[resource]) {
      return permissions.permissions.resources[resource].includes(permission);
    }

    return false;
  };

  const hasAnyPermission = (perms: Permission[], resource?: Resource): boolean => {
    return perms.some(perm => hasPermission(perm, resource));
  };

  const hasAllPermissions = (perms: Permission[], resource?: Resource): boolean => {
    return perms.every(perm => hasPermission(perm, resource));
  };

  const hasRole = (role: User["role"]): boolean => {
    return permissions?.role === role;
  };

  const canAccessResource = (resource: Resource): boolean => {
    if (!permissions) return false;
    const resourcePerms = permissions.permissions.resources[resource];
    return resourcePerms && resourcePerms.length > 0;
  };

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    canAccessResource,
    refetch: fetchPermissions,
  };
}

// Convenience hooks for common permission checks
export function useCanEdit(resource?: Resource): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("write", resource);
}

export function useCanDelete(resource?: Resource): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("delete", resource);
}

export function useCanManage(resource: Resource): boolean {
  const { hasAnyPermission } = usePermissions();
  const managePermissions: Permission[] = [
    "manage_team",
    "manage_workspace",
    "manage_experiments",
    "manage_documents",
  ];
  return hasAnyPermission(managePermissions, resource);
}

export function useIsWorkspaceAdmin(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("manage_workspace", "workspace");
}

export function useCanInviteUsers(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("manage_team", "invitation");
}