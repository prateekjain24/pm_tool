import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { type NewUser, type User, users } from "../db/schema";

/**
 * Check if a user exists by Clerk ID
 */
export async function userExistsByClerkId(clerkId: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result.length > 0;
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const db = getDb();
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0] || null;
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  workspaceId?: string | null;
}): Promise<User> {
  const db = getDb();

  const newUser: NewUser = {
    clerkId: userData.clerkId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    workspaceId: userData.workspaceId,
    role: "member",
  };

  const [inserted] = await db.insert(users).values(newUser).returning();

  if (!inserted) {
    throw new Error("Failed to create user");
  }
  return inserted;
}

/**
 * Get or create user by Clerk ID
 */
export async function getOrCreateUser(userData: {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<User> {
  // Try to get existing user
  const existingUser = await getUserByClerkId(userData.clerkId);
  if (existingUser) {
    return existingUser;
  }

  // Create new user
  return createUser(userData);
}

/**
 * Update user
 */
export async function updateUser(
  clerkId: string,
  updates: Partial<{
    email: string;
    firstName: string | null;
    lastName: string | null;
    workspaceId: string | null;
    role: string;
  }>,
): Promise<User | null> {
  const db = getDb();

  const [updated] = await db
    .update(users)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, clerkId))
    .returning();

  return updated || null;
}
