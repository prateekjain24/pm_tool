/**
 * Utility types for the application
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract non-nullable type
 */
export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

/**
 * Create a type with timestamps
 */
export interface WithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a type with soft delete
 */
export interface WithSoftDelete {
  deletedAt?: Date | null;
}

/**
 * Create a type with version
 */
export interface WithVersion {
  version: number;
}

/**
 * Create a type with workspace
 */
export interface WithWorkspace {
  workspaceId: string;
}

/**
 * Create a type with user tracking
 */
export interface WithUserTracking {
  createdBy: string;
  updatedBy?: string;
}

/**
 * Combine multiple mixins
 */
export type Entity<T> = T & WithTimestamps & WithWorkspace;
export type SoftDeletableEntity<T> = Entity<T> & WithSoftDelete;
export type VersionedEntity<T> = Entity<T> & WithVersion;
export type AuditableEntity<T> = Entity<T> & WithUserTracking;

/**
 * ID type for entities
 */
export type EntityId = string;

/**
 * Date range type
 */
export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

/**
 * Sort order type
 */
export type SortOrder = "asc" | "desc";

/**
 * Sort configuration
 */
export interface SortConfig<T> {
  field: keyof T;
  order: SortOrder;
}

/**
 * Filter operators
 */
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "like"
  | "between";

/**
 * Filter configuration
 */
export interface FilterConfig<T, K extends keyof T = keyof T> {
  field: K;
  operator: FilterOperator;
  value: T[K] | T[K][] | [T[K], T[K]];
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Maybe type (nullable)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Type for form field errors
 */
export type FieldErrors<T> = Partial<Record<keyof T, string[]>>;

/**
 * Type for form state
 */
export interface FormState<T> {
  values: T;
  errors: FieldErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Type for async state
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Type for mutation state
 */
export interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  called: boolean;
}

/**
 * Enum to union type
 */
export type EnumToUnion<T extends Record<string, string>> = T[keyof T];

/**
 * Extract array element type
 */
export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never;

/**
 * Prettify type (expand object type for better IDE hints)
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Type for React component props with className
 */
export interface WithClassName {
  className?: string;
}
