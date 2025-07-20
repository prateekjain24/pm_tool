import { z } from "zod";

/**
 * Settings Validation Schemas
 */

// General settings schema
export const updateGeneralSettingsSchema = z.object({
  firstName: z.string().min(1).max(50).nullable().optional(),
  lastName: z.string().min(1).max(50).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

// Notification preferences schemas
export const emailNotificationSchema = z.object({
  marketingEmails: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
  experimentResults: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
});

export const inAppNotificationSchema = z.object({
  experimentUpdates: z.boolean().optional(),
  collaborationActivity: z.boolean().optional(),
  systemAlerts: z.boolean().optional(),
});

export const updateNotificationPreferencesSchema = z.object({
  email: emailNotificationSchema.optional(),
  inApp: inAppNotificationSchema.optional(),
});

// API key schemas
export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  expiresIn: z.number().int().positive().nullable().optional(), // days
});

export const apiKeyNameSchema = z.string().min(1).max(100);

// Theme schema
export const themeSchema = z.enum(["light", "dark", "system"]);

export const updateThemeSchema = z.object({
  theme: themeSchema,
});

// Utility function to generate a secure API key
export function generateApiKey(prefix = "pm_"): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hexString = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}${hexString}`;
}

// Utility function to mask API key for display
export function maskApiKey(key: string): string {
  if (key.length < 12) return key; // Don't mask very short keys
  const prefix = key.slice(0, 7);
  const suffix = key.slice(-4);
  return `${prefix}...${suffix}`;
}
