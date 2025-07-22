import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import type { User } from "@shared/types";

// Import types from usePermissions hook
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

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  resource?: Resource;
  role?: User["role"];
  roles?: User["role"][];
  showError?: boolean;
  errorMessage?: string;
}

/**
 * PermissionGate component that conditionally renders children based on user permissions
 * 
 * @example
 * // Check for single permission
 * <PermissionGate permission="write" resource="document">
 *   <EditButton />
 * </PermissionGate>
 * 
 * @example
 * // Check for any of multiple permissions
 * <PermissionGate permissions={["write", "delete"]} resource="experiment">
 *   <ActionButtons />
 * </PermissionGate>
 * 
 * @example
 * // Check for all permissions
 * <PermissionGate permissions={["write", "manage_experiments"]} requireAll resource="experiment">
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * @example
 * // Check for role
 * <PermissionGate role="admin">
 *   <AdminDashboard />
 * </PermissionGate>
 * 
 * @example
 * // With custom fallback
 * <PermissionGate 
 *   permission="manage_team" 
 *   fallback={<p>You don't have permission to manage team members.</p>}
 * >
 *   <TeamManagement />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  fallback = null,
  permission,
  permissions,
  requireAll = false,
  resource,
  role,
  roles,
  showError = false,
  errorMessage = "You don't have permission to view this content.",
}: PermissionGateProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasRole,
    isLoading 
  } = usePermissions();

  // While loading, optionally show nothing or a loading state
  if (isLoading) {
    return null;
  }

  let hasAccess = false;

  // Check role-based access
  if (role) {
    hasAccess = hasRole(role);
  } else if (roles && roles.length > 0) {
    hasAccess = roles.some(r => hasRole(r));
  }
  // Check permission-based access
  else if (permission) {
    hasAccess = hasPermission(permission, resource);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions, resource)
      : hasAnyPermission(permissions, resource);
  }
  // If no permission or role specified, default to no access
  else {
    hasAccess = false;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show error message if requested
  if (showError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{errorMessage}</p>
      </div>
    );
  }

  // Return fallback or null
  return <>{fallback}</>;
}

/**
 * Higher-order component version of PermissionGate
 */
export function withPermissions<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<PermissionGateProps, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <PermissionGate {...options}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}

/**
 * Hook to create permission-based conditional rendering
 */
export function usePermissionGate(
  options: Omit<PermissionGateProps, "children" | "fallback">
): boolean {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasRole 
  } = usePermissions();

  const { permission, permissions, requireAll, resource, role, roles } = options;

  if (role) {
    return hasRole(role);
  }
  
  if (roles && roles.length > 0) {
    return roles.some(r => hasRole(r));
  }
  
  if (permission) {
    return hasPermission(permission, resource);
  }
  
  if (permissions && permissions.length > 0) {
    return requireAll 
      ? hasAllPermissions(permissions, resource)
      : hasAnyPermission(permissions, resource);
  }

  return false;
}