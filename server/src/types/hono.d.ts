import type { AuthUser } from "../middleware/auth";

declare module "hono" {
  interface ContextVariableMap {
    // Auth
    user?: AuthUser;

    // Request context
    requestId?: string;
    requestStartTime?: number;

    // Validated data
    validatedJson?: any;
    validatedQuery?: any;
    validatedParam?: any;
    validatedHeader?: any;
    validatedForm?: any;
  }
}
