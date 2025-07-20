// Legacy ApiResponse type (keeping for backward compatibility)
export type ApiResponse = {
  message: string;
  success: true;
};

// Re-export all types
export * from "./auth";
export * from "./hypothesis";
export * from "./experiment";
export * from "./document";
export * from "./api";
export * from "./utils";
export * from "./workspace";
