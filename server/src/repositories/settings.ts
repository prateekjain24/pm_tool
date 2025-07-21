import { generateApiKey } from "@shared/schemas";
import type {
  ApiKeyResponse,
  NotificationPreferences,
  ThemePreference,
  UserSettings,
} from "@shared/types";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { type UserSettingsInsert, userSettings } from "../db/schema";
import { getOrCreateUser } from "./users";

/**
 * Get user settings from the database
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    console.log("getUserSettings called with userId:", userId);
    const db = getDb();
    const results = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    console.log("getUserSettings query results:", results);

    if (results.length === 0) {
      console.log("No settings found for user:", userId);
      return null;
    }

    const settings = results[0];
    if (!settings) {
      return null;
    }
    return {
      id: settings.id,
      userId: settings.userId,
      firstName: settings.firstName,
      lastName: settings.lastName,
      email: settings.email,
      avatarUrl: settings.avatarUrl,
      notifications: settings.notifications as NotificationPreferences,
      apiKeys: settings.apiKeys as ApiKeyResponse[],
      theme: settings.theme as ThemePreference,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  } catch (error) {
    console.error("getUserSettings database error:", error);
    throw error;
  }
}

/**
 * Create default user settings
 */
export async function createUserSettings(
  userId: string,
  data: Partial<UserSettings>,
): Promise<UserSettings> {
  const settingsData: UserSettingsInsert = {
    userId,
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    email: data.email || "",
    avatarUrl: data.avatarUrl || null,
    notifications: data.notifications || {
      email: {
        marketingEmails: false,
        productUpdates: true,
        experimentResults: true,
        weeklyDigest: true,
      },
      inApp: {
        experimentUpdates: true,
        collaborationActivity: true,
        systemAlerts: true,
      },
    },
    apiKeys: data.apiKeys || [],
    theme: data.theme || "system",
  };

  const db = getDb();
  const [inserted] = await db.insert(userSettings).values(settingsData).returning();

  if (!inserted) {
    throw new Error("Failed to create user settings");
  }

  return {
    id: inserted.id,
    userId: inserted.userId,
    firstName: inserted.firstName,
    lastName: inserted.lastName,
    email: inserted.email,
    avatarUrl: inserted.avatarUrl,
    notifications: inserted.notifications as NotificationPreferences,
    apiKeys: inserted.apiKeys as ApiKeyResponse[],
    theme: inserted.theme as ThemePreference,
    createdAt: inserted.createdAt,
    updatedAt: inserted.updatedAt,
  };
}

/**
 * Update general user settings
 */
export async function updateUserSettings(
  userId: string,
  data: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  },
): Promise<UserSettings | null> {
  console.log("updateUserSettings called with:", { userId, data });

  const db = getDb();
  const updateData = {
    firstName: data.firstName,
    lastName: data.lastName,
    avatarUrl: data.avatarUrl,
    updatedAt: new Date(),
  };

  console.log("Updating with data:", updateData);

  const [updated] = await db
    .update(userSettings)
    .set(updateData)
    .where(eq(userSettings.userId, userId))
    .returning();

  console.log("Update result:", updated);

  if (!updated) {
    return null;
  }

  return {
    id: updated.id,
    userId: updated.userId,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    avatarUrl: updated.avatarUrl,
    notifications: updated.notifications as NotificationPreferences,
    apiKeys: updated.apiKeys as ApiKeyResponse[],
    theme: updated.theme as ThemePreference,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences | null> {
  // First get current settings
  const current = await getUserSettings(userId);
  if (!current) {
    return null;
  }

  const updatedNotifications: NotificationPreferences = {
    email: {
      ...current.notifications.email,
      ...(preferences.email || {}),
    },
    inApp: {
      ...current.notifications.inApp,
      ...(preferences.inApp || {}),
    },
  };

  const db = getDb();
  const [updated] = await db
    .update(userSettings)
    .set({
      notifications: updatedNotifications,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId))
    .returning();

  return updated ? updated.notifications as NotificationPreferences : null;
}

/**
 * Add an API key
 */
export async function addApiKey(
  userId: string,
  keyData: {
    name: string;
    expiresIn?: number;
  },
): Promise<{ apiKey: ApiKeyResponse; plainTextKey: string } | null> {
  // Get current settings
  const current = await getUserSettings(userId);
  if (!current) {
    return null;
  }

  // Generate new API key
  const plainTextKey = generateApiKey();
  const newKey: ApiKeyResponse = {
    id: crypto.randomUUID(),
    name: keyData.name,
    key: plainTextKey, // In production, store hashed version
    lastUsedAt: null,
    createdAt: new Date(),
    expiresAt: keyData.expiresIn
      ? new Date(Date.now() + keyData.expiresIn * 24 * 60 * 60 * 1000)
      : null,
  };

  // Add to existing keys
  const updatedKeys = [...current.apiKeys, newKey];

  const db = getDb();
  await db
    .update(userSettings)
    .set({
      apiKeys: updatedKeys,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId));

  return { apiKey: newKey, plainTextKey };
}

/**
 * Delete an API key
 */
export async function deleteApiKey(userId: string, keyId: string): Promise<boolean> {
  // Get current settings
  const current = await getUserSettings(userId);
  if (!current) {
    return false;
  }

  // Filter out the key
  const updatedKeys = current.apiKeys.filter((key) => key.id !== keyId);

  if (updatedKeys.length === current.apiKeys.length) {
    // Key not found
    return false;
  }

  const db = getDb();
  await db
    .update(userSettings)
    .set({
      apiKeys: updatedKeys,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId));

  return true;
}

/**
 * Update theme preference
 */
export async function updateTheme(
  userId: string,
  theme: ThemePreference,
): Promise<ThemePreference | null> {
  const db = getDb();
  const [updated] = await db
    .update(userSettings)
    .set({
      theme,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId))
    .returning();

  return updated ? (updated.theme as ThemePreference) : null;
}

/**
 * Get or create user settings
 */
export async function getOrCreateUserSettings(
  userId: string,
  userData: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  },
): Promise<UserSettings> {
  // First ensure the user exists in the database
  await getOrCreateUser({
    clerkId: userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  // Try to get existing settings
  const existing = await getUserSettings(userId);
  if (existing) {
    return existing;
  }

  // Create new settings
  return createUserSettings(userId, {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
}
