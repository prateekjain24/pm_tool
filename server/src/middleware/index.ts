/**
 * Central export for all middleware
 */

export { type AuthUser, authMiddleware, optionalAuthMiddleware } from "./auth";
export { createError, errorHandler, errors } from "./errorHandler";
export { loggingMiddleware, performanceMiddleware } from "./logger";
export { paginated, responseFormatter, success } from "./responseFormatter";
export {
  getValidated,
  validate,
  validateBody,
  validateForm,
  validateHeaders,
  validateParams,
  validateQuery,
} from "./validation";
export {
  type Permission,
  type Resource,
  EnhancedRolePermissions,
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireWorkspacePermission,
  getUserPermissions,
} from "./rbac";
