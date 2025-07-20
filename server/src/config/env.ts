import { parseServerEnv, type ServerEnv } from "@shared/config/env";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * Validated and typed environment variables for the server
 * This will throw an error if required environment variables are missing
 */
export const env: ServerEnv = parseServerEnv(process.env);

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper to check if we're in production mode
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Helper to check if we're in test mode
 */
export const isTest = env.NODE_ENV === "test";
