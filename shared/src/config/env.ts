import { z } from "zod";

/**
 * Base environment variables schema - common to all environments
 */
const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Server-specific environment variables schema
 */
export const serverEnvSchema = baseEnvSchema.extend({
  // Database
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),

  // Redis
  REDIS_URL: z.string().url().default("redis://localhost:6379").describe("Redis connection string"),

  // Server
  PORT: z.coerce.number().default(3000).describe("Server port"),
  CLIENT_URL: z.string().url().default("http://localhost:5173").describe("Client URL for CORS"),

  // Clerk Auth
  CLERK_SECRET_KEY: z.string().startsWith("sk_").describe("Clerk secret key for backend"),
  CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_").describe("Clerk publishable key"),

  // AI Services
  OPENAI_API_KEY: z.string().startsWith("sk-").describe("OpenAI API key"),
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-").describe("Anthropic API key"),
  GOOGLE_AI_API_KEY: z.string().describe("Google AI API key"),

  // Error Tracking
  SENTRY_DSN: z.string().url().optional().describe("Sentry DSN for error tracking"),
  APP_VERSION: z
    .string()
    .default("1.0.0")
    .describe("Application version for Sentry release tracking"),
});

/**
 * Client-specific environment variables schema
 */
export const clientEnvSchema = baseEnvSchema.extend({
  // Clerk Auth
  VITE_CLERK_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_")
    .describe("Clerk publishable key for frontend"),

  // API URL
  VITE_API_URL: z.string().url().default("http://localhost:3000").describe("Backend API URL"),

  // Error Tracking
  VITE_SENTRY_DSN: z.string().url().optional().describe("Sentry DSN for client error tracking"),
  VITE_APP_VERSION: z.string().default("1.0.0").describe("Application version for Sentry"),
});

/**
 * Server environment variables type
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Client environment variables type
 */
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Parse and validate server environment variables
 */
export function parseServerEnv(env: Record<string, string | undefined> = process.env): ServerEnv {
  try {
    return serverEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      console.error(error.flatten().fieldErrors);
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

/**
 * Parse and validate client environment variables
 */
export function parseClientEnv(
  env: Record<string, string | undefined> = import.meta.env,
): ClientEnv {
  try {
    return clientEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      console.error(error.flatten().fieldErrors);
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

/**
 * Format environment errors for better readability
 */
export function formatEnvErrors(error: z.ZodError): string {
  const errors = error.flatten().fieldErrors;
  const errorMessages: string[] = [];

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      errorMessages.push(`  ${field}: ${messages.join(", ")}`);
    }
  }

  return errorMessages.join("\n");
}
