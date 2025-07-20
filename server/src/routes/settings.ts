import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { 
  UserSettings, 
  ApiKeyResponse,
  CreateApiKeyResponse,
  NotificationPreferences,
  ThemePreference
} from "@shared/types";
import { 
  updateGeneralSettingsSchema, 
  updateNotificationPreferencesSchema,
  createApiKeySchema,
  updateThemeSchema,
} from "@shared/schemas";
import { authMiddleware } from "../middleware/auth";
import { requireUser } from "../utils/auth";
import { apiSuccess, apiErrors } from "../utils/apiResponse";
import { logger } from "../utils/logger";
import {
  getOrCreateUserSettings,
  updateUserSettings,
  updateNotificationPreferences,
  addApiKey,
  deleteApiKey,
  updateTheme,
} from "../repositories/settings";

const settingsRouter = new Hono();

// Apply auth middleware to all settings routes
settingsRouter.use("*", authMiddleware);

// Get user settings
settingsRouter.get("/", async (c) => {
  const user = requireUser(c);
  
  logger.info({ userId: user.id }, "Fetching user settings");

  try {
    // Get or create settings from database
    const settings = await getOrCreateUserSettings(user.id, {
      email: user.email || "no-email@example.com", // Fallback for users without email
      firstName: user.firstName,
      lastName: user.lastName,
    });

    logger.info({ userId: user.id, settings }, "Returning user settings");
    return apiSuccess(c, settings);
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: user.id 
    }, "Failed to fetch user settings");
    return apiErrors.internal(c, "Failed to fetch user settings");
  }
});

// Update general settings
settingsRouter.put(
  "/general",
  zValidator("json", updateGeneralSettingsSchema),
  async (c) => {
    const user = requireUser(c);
    const data = c.req.valid("json");

    logger.info({ userId: user.id, requestData: data }, "Updating general settings");

    try {
      // Ensure settings exist first
      await getOrCreateUserSettings(user.id, {
        email: user.email || "no-email@example.com",
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Update settings in database
      const updatedSettings = await updateUserSettings(user.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
      });

      if (!updatedSettings) {
        return apiErrors.notFound(c, "User settings");
      }

      return apiSuccess(c, updatedSettings);
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id 
      }, "Failed to update general settings");
      return apiErrors.internal(c, "Failed to update settings");
    }
  }
);

// Update notification preferences
settingsRouter.put(
  "/notifications",
  zValidator("json", updateNotificationPreferencesSchema),
  async (c) => {
    const user = requireUser(c);
    const data = c.req.valid("json");

    logger.info({ userId: user.id }, "Updating notification preferences");

    try {
      // Ensure settings exist first
      await getOrCreateUserSettings(user.id, {
        email: user.email || "no-email@example.com",
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Update notification preferences in database
      const updatedNotifications = await updateNotificationPreferences(user.id, data);

      if (!updatedNotifications) {
        return apiErrors.notFound(c, "User settings");
      }

      return apiSuccess(c, updatedNotifications);
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id 
      }, "Failed to update notification preferences");
      return apiErrors.internal(c, "Failed to update notification preferences");
    }
  }
);

// Create API key
settingsRouter.post(
  "/api-keys",
  zValidator("json", createApiKeySchema),
  async (c) => {
    const user = requireUser(c);
    const data = c.req.valid("json");

    logger.info({ userId: user.id }, "Creating API key");

    try {
      // Ensure settings exist first
      await getOrCreateUserSettings(user.id, {
        email: user.email || "no-email@example.com",
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Create API key in database
      const result = await addApiKey(user.id, {
        name: data.name,
        expiresIn: data.expiresIn,
      });

      if (!result) {
        return apiErrors.notFound(c, "User settings");
      }

      logger.info({ keyId: result.apiKey.id }, "API key created");

      const response: CreateApiKeyResponse = {
        apiKey: result.apiKey,
        plainTextKey: result.plainTextKey,
      };

      return apiSuccess(c, response, { status: 201 });
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id 
      }, "Failed to create API key");
      return apiErrors.internal(c, "Failed to create API key");
    }
  }
);

// Delete API key
settingsRouter.delete("/api-keys/:keyId", async (c) => {
  const user = requireUser(c);
  const keyId = c.req.param("keyId");

  logger.info({ userId: user.id, keyId }, "Deleting API key");

  try {
    const deleted = await deleteApiKey(user.id, keyId);

    if (!deleted) {
      return apiErrors.notFound(c, "API key");
    }

    logger.info({ keyId }, "API key deleted");

    return apiSuccess(c, { deleted: true });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: user.id,
      keyId 
    }, "Failed to delete API key");
    return apiErrors.internal(c, "Failed to delete API key");
  }
});

// Update theme preference
settingsRouter.put(
  "/theme",
  zValidator("json", updateThemeSchema),
  async (c) => {
    const user = requireUser(c);
    const data = c.req.valid("json");

    logger.info({ userId: user.id, theme: data.theme }, "Updating theme preference");

    try {
      // Ensure settings exist first
      await getOrCreateUserSettings(user.id, {
        email: user.email || "no-email@example.com",
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Update theme in database
      const updatedTheme = await updateTheme(user.id, data.theme);

      if (!updatedTheme) {
        return apiErrors.notFound(c, "User settings");
      }

      return apiSuccess(c, { theme: updatedTheme });
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id 
      }, "Failed to update theme preference");
      return apiErrors.internal(c, "Failed to update theme preference");
    }
  }
);

export { settingsRouter };