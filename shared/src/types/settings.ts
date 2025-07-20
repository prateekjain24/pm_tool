/**
 * User Settings Types
 */

export interface UserSettings {
  id: string;
  userId: string;

  // General settings
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;

  // Notification preferences
  notifications: NotificationPreferences;

  // API keys
  apiKeys: ApiKey[];

  // Appearance
  theme: ThemePreference;

  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  email: {
    marketingEmails: boolean;
    productUpdates: boolean;
    experimentResults: boolean;
    weeklyDigest: boolean;
  };
  inApp: {
    experimentUpdates: boolean;
    collaborationActivity: boolean;
    systemAlerts: boolean;
  };
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsedAt: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
}

export type ThemePreference = "light" | "dark" | "system";

// Input types for API operations
export interface UpdateGeneralSettingsInput {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateNotificationPreferencesInput {
  email?: Partial<NotificationPreferences["email"]>;
  inApp?: Partial<NotificationPreferences["inApp"]>;
}

export interface CreateApiKeyInput {
  name: string;
  expiresIn?: number; // days until expiration, null for never
}

export interface UpdateThemeInput {
  theme: ThemePreference;
}

// Response types
export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string; // Only returned on creation
  lastUsedAt: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKeyResponse;
  plainTextKey: string; // Only available at creation time
}
