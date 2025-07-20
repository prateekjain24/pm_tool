import type { ApiKeyResponse, NotificationPreferences, ThemePreference } from "@shared/types";
import { jsonb, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.clerkId, { onDelete: "cascade" }),

    // General settings
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),

    // Notification preferences (stored as JSONB)
    notifications: jsonb("notifications")
      .notNull()
      .$type<NotificationPreferences>()
      .default({
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
      }),

    // API keys (stored as JSONB array)
    apiKeys: jsonb("api_keys").notNull().$type<ApiKeyResponse[]>().default([]),

    // Theme preference
    theme: varchar("theme", { length: 20 }).$type<ThemePreference>().notNull().default("system"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    // Ensure one settings record per user
    uniqueUserId: unique().on(table.userId),
  }),
);

// Type inference for TypeScript
export type UserSettingsInsert = typeof userSettings.$inferInsert;
export type UserSettingsSelect = typeof userSettings.$inferSelect;
