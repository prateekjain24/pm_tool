import type { Context, Next, ValidationTargets } from "hono";
import type { ZodError, ZodSchema } from "zod";
import { errors } from "./errorHandler";

/**
 * Validation targets that can be validated
 */
type ValidationType = keyof ValidationTargets;

/**
 * Configuration for the validation middleware
 */
interface ValidationConfig<T extends ValidationType> {
  target: T;
  schema: ZodSchema;
}

/**
 * Creates a validation middleware for the specified target and schema
 */
export function validate<T extends ValidationType>(
  config: ValidationConfig<T>,
) {
  return async (c: Context, next: Next) => {
    try {
      let data: unknown;

      // Get data based on target
      switch (config.target) {
        case "json":
          data = await c.req.json();
          break;
        case "query":
          data = c.req.query();
          break;
        case "param":
          data = c.req.param();
          break;
        case "header": {
          // Get all headers as an object
          const headers: Record<string, string> = {};
          c.req.raw.headers.forEach((value, key) => {
            headers[key] = value;
          });
          data = headers;
          break;
        }
        case "form":
          data = await c.req.formData();
          if (data instanceof FormData) {
            // Convert FormData to object
            const obj: Record<string, any> = {};
            data.forEach((value, key) => {
              obj[key] = value;
            });
            data = obj;
          }
          break;
        default:
          throw new Error(`Invalid validation target: ${config.target}`);
      }

      // Validate the data
      const validated = await config.schema.parseAsync(data);

      // Store validated data in context for later use
      c.set(`validated${capitalize(config.target)}`, validated);

      return await next();
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as ZodError;
        const fields: Record<string, string[]> = {};

        zodError.errors.forEach((err) => {
          const path = err.path.join(".");
          if (!fields[path]) {
            fields[path] = [];
          }
          fields[path].push(err.message);
        });

        throw errors.validationError(`Invalid ${config.target} data`, fields);
      }

      throw error;
    }
  };
}

/**
 * Shorthand validation functions for common use cases
 */
export const validateBody = (schema: ZodSchema) => validate({ target: "json", schema });

export const validateQuery = (schema: ZodSchema) => validate({ target: "query", schema });

export const validateParams = (schema: ZodSchema) => validate({ target: "param", schema });

export const validateHeaders = (schema: ZodSchema) => validate({ target: "header", schema });

export const validateForm = (schema: ZodSchema) => validate({ target: "form", schema });

/**
 * Helper to get validated data from context
 */
export function getValidated<T>(c: Context, target: ValidationType): T {
  const key = `validated${capitalize(target)}`;
  const data = c.get(key);

  if (!data) {
    throw new Error(
      `No validated ${target} data found. Did you forget to add validation middleware?`,
    );
  }

  return data as T;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
