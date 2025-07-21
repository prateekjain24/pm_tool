// Legacy ApiResponse type (keeping for backward compatibility)
export type ApiResponse = {
  message: string;
  success: true;
};

export * from "./api";
// Re-export all types
export * from "./auth";
export * from "./document";
export * from "./experiment";
export * from "./hypothesis";
export * from "./invitation";
export * from "./settings";
export * from "./utils";
export * from "./workspace";
