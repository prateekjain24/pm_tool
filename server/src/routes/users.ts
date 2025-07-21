import { Hono } from "hono";
import { authMiddleware, getUserPermissions } from "../middleware";
import { apiSuccess } from "../utils/apiResponse";
import { requireRole } from "../middleware/rbac";
import { getDb } from "../db";
import { users as usersTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const users = new Hono();

/**
 * Get current user's permissions
 */
users.get("/permissions", authMiddleware, async (c) => {
  const authUser = c.get("user");
  
  try {
    const permissions = await getUserPermissions(authUser?.clerkId || "");
    return apiSuccess(c, permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw new HTTPException(500, { message: "Failed to fetch permissions" });
  }
});

/**
 * Get current user's profile
 */
users.get("/profile", authMiddleware, async (c) => {
  const authUser = c.get("user");
  
  try {
    const db = getDb();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, authUser?.clerkId || ""))
      .limit(1);
      
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    
    return apiSuccess(c, {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      workspaceId: user.workspaceId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error fetching user profile:", error);
    throw new HTTPException(500, { message: "Failed to fetch user profile" });
  }
});

/**
 * Update user's role (admin only)
 */
users.put("/:userId/role", authMiddleware, requireRole("admin"), async (c) => {
  const userId = c.req.param("userId");
  const { role } = await c.req.json<{ role: string }>();
  
  if (!["admin", "member", "viewer"].includes(role)) {
    throw new HTTPException(400, { message: "Invalid role" });
  }

  try {
    const db = getDb();
    const [updatedUser] = await db
      .update(usersTable)
      .set({ 
        role,
        updatedAt: new Date() 
      })
      .where(eq(usersTable.id, userId))
      .returning();

    if (!updatedUser) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return apiSuccess(c, {
      id: updatedUser.id,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error updating user role:", error);
    throw new HTTPException(500, { message: "Failed to update user role" });
  }
});

/**
 * List all users (admin only)
 */
users.get("/", authMiddleware, requireRole("admin"), async (c) => {
  const { page = "1", limit = "20", workspaceId } = c.req.query();
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  try {
    const db = getDb();
    const baseQuery = db.select().from(usersTable);
    
    const allUsers = await (workspaceId 
      ? baseQuery.where(eq(usersTable.workspaceId, workspaceId))
      : baseQuery)
      .limit(limitNum)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql`count(*)`.as('count') })
      .from(usersTable);
    const total = Number(countResult?.count) || 0;

    return apiSuccess(c, {
      users: allUsers.map(user => ({
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        workspaceId: user.workspaceId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error listing users:", error);
    throw new HTTPException(500, { message: "Failed to list users" });
  }
});

/**
 * Delete user (admin only)
 */
users.delete("/:userId", authMiddleware, requireRole("admin"), async (c) => {
  const userId = c.req.param("userId");
  const authUser = c.get("user");

  // Prevent self-deletion
  if (userId === authUser?.id) {
    throw new HTTPException(400, { message: "Cannot delete your own account" });
  }

  try {
    const db = getDb();
    const [deletedUser] = await db
      .update(usersTable)
      .set({ 
        deletedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(usersTable.id, userId))
      .returning();

    if (!deletedUser) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return apiSuccess(c, { 
      message: "User deleted successfully",
      userId: deletedUser.id 
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error deleting user:", error);
    throw new HTTPException(500, { message: "Failed to delete user" });
  }
});

export { users };