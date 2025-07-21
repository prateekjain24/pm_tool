import { Hono } from "hono";
import { authMiddleware, requirePermission } from "../middleware";
import { apiSuccess, apiError } from "../utils/apiResponse";
import { getDb } from "../db";
import { invitations as invitationsTable, users as usersTable } from "../db/schema";
import { eq, and, gte, or } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import crypto from "crypto";
import type { CreateInvitationInput, InvitationWithRelations, InvitationStatus } from "@shared/types";

const invitations = new Hono();

/**
 * Generate a secure invitation token
 */
function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Check if an invitation is expired
 */
function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Create a new invitation
 */
invitations.post("/", authMiddleware, requirePermission("manage_team", "invitation"), async (c) => {
  const user = c.get("user");
  const workspaceId = c.get("workspaceId") as string | undefined;
  const { email, role, message } = await c.req.json<CreateInvitationInput>();
  
  if (!workspaceId) {
    throw new HTTPException(403, { message: "No workspace context" });
  }

  // Validate email
  if (!email || !email.includes("@")) {
    throw new HTTPException(400, { message: "Invalid email address" });
  }

  // Check if user already exists with this email
  const db = getDb();
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(and(
      eq(usersTable.email, email),
      eq(usersTable.workspaceId, workspaceId)
    ))
    .limit(1);

  if (existingUser.length > 0) {
    throw new HTTPException(409, { message: "User already exists in this workspace" });
  }

  // Check if there's already a pending invitation
  const existingInvitation = await db
    .select()
    .from(invitationsTable)
    .where(and(
      eq(invitationsTable.email, email),
      eq(invitationsTable.workspaceId, workspaceId),
      eq(invitationsTable.status, "pending"),
      gte(invitationsTable.expiresAt, new Date())
    ))
    .limit(1);

  if (existingInvitation.length > 0) {
    throw new HTTPException(409, { message: "An invitation has already been sent to this email" });
  }

  // Create invitation
  const token = generateInvitationToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  try {
    const [invitation] = await db
      .insert(invitationsTable)
      .values({
        email,
        role,
        message,
        token,
        workspaceId,
        invitedById: user?.id || "",
        expiresAt,
        status: "pending",
      })
      .returning();

    // Get the inviter's details
    const [inviter] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      })
      .from(usersTable)
      .where(eq(usersTable.clerkId, user?.clerkId || ""))
      .limit(1);

    // TODO: Send invitation email
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    const inviteUrl = `${process.env.CLIENT_URL}/invitation/accept?token=${token}`;

    return apiSuccess(c, {
      invitation: {
        ...invitation,
        invitedBy: inviter ? {
          id: inviter.id,
          name: `${inviter.firstName || ""} ${inviter.lastName || ""}`.trim() || inviter.email,
          email: inviter.email,
        } : null,
      },
      inviteUrl,
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw new HTTPException(500, { message: "Failed to create invitation" });
  }
});

/**
 * List invitations for the workspace
 */
invitations.get("/", authMiddleware, requirePermission("manage_team", "invitation"), async (c) => {
  const workspaceId = c.get("workspaceId") as string | undefined;
  const { status, page = "1", limit = "20" } = c.req.query();
  
  if (!workspaceId) {
    throw new HTTPException(403, { message: "No workspace context" });
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  try {
    const db = getDb();
    const baseQuery = db
      .select({
        invitation: invitationsTable,
        invitedBy: {
          id: usersTable.id,
          email: usersTable.email,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
        },
      })
      .from(invitationsTable)
      .leftJoin(usersTable, eq(invitationsTable.invitedById, usersTable.id));

    const whereConditions = status 
      ? and(
          eq(invitationsTable.workspaceId, workspaceId),
          eq(invitationsTable.status, status)
        )
      : eq(invitationsTable.workspaceId, workspaceId);

    const query = baseQuery.where(whereConditions);

    const results = await query
      .orderBy(invitationsTable.createdAt)
      .limit(limitNum)
      .offset(offset);

    const invitationsList: InvitationWithRelations[] = results.map(({ invitation, invitedBy }) => ({
      ...invitation,
      role: invitation.role as "member" | "admin" | "viewer",
      status: invitation.status as InvitationStatus,
      invitedBy: invitedBy ? {
        id: invitedBy.id,
        name: `${invitedBy.firstName || ""} ${invitedBy.lastName || ""}`.trim() || invitedBy.email,
        email: invitedBy.email,
      } : undefined,
      workspace: {
        id: workspaceId,
        name: "Current Workspace", // You might want to fetch the actual workspace name
      },
    }));

    return apiSuccess(c, {
      invitations: invitationsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: invitationsList.length,
      },
    });
  } catch (error) {
    console.error("Error listing invitations:", error);
    throw new HTTPException(500, { message: "Failed to list invitations" });
  }
});

/**
 * Revoke an invitation
 */
invitations.post("/:id/revoke", authMiddleware, requirePermission("manage_team", "invitation"), async (c) => {
  const invitationId = c.req.param("id");
  const workspaceId = c.get("workspaceId") as string | undefined;
  
  if (!workspaceId) {
    throw new HTTPException(403, { message: "No workspace context" });
  }

  try {
    const db = getDb();
    const [revokedInvitation] = await db
      .update(invitationsTable)
      .set({
        status: "revoked",
        revokedAt: new Date(),
      })
      .where(and(
        eq(invitationsTable.id, invitationId),
        eq(invitationsTable.workspaceId, workspaceId),
        eq(invitationsTable.status, "pending")
      ))
      .returning();

    if (!revokedInvitation) {
      throw new HTTPException(404, { message: "Invitation not found or already processed" });
    }

    return apiSuccess(c, {
      message: "Invitation revoked successfully",
      invitation: revokedInvitation,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error revoking invitation:", error);
    throw new HTTPException(500, { message: "Failed to revoke invitation" });
  }
});

/**
 * Resend an invitation
 */
invitations.post("/:id/resend", authMiddleware, requirePermission("manage_team", "invitation"), async (c) => {
  const invitationId = c.req.param("id");
  const workspaceId = c.get("workspaceId") as string | undefined;
  
  if (!workspaceId) {
    throw new HTTPException(403, { message: "No workspace context" });
  }

  try {
    // Get the invitation
    const db = getDb();
    const [invitation] = await db
      .select()
      .from(invitationsTable)
      .where(and(
        eq(invitationsTable.id, invitationId),
        eq(invitationsTable.workspaceId, workspaceId),
        eq(invitationsTable.status, "pending")
      ))
      .limit(1);

    if (!invitation) {
      throw new HTTPException(404, { message: "Invitation not found" });
    }

    // Check if expired and update expiration
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // Reset to 7 days

    const [updatedInvitation] = await db
      .update(invitationsTable)
      .set({
        expiresAt: newExpiresAt,
      })
      .where(eq(invitationsTable.id, invitationId))
      .returning();

    // TODO: Resend invitation email
    const inviteUrl = `${process.env.CLIENT_URL}/invitation/accept?token=${invitation.token}`;

    return apiSuccess(c, {
      message: "Invitation resent successfully",
      invitation: updatedInvitation,
      inviteUrl,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error resending invitation:", error);
    throw new HTTPException(500, { message: "Failed to resend invitation" });
  }
});

/**
 * Accept an invitation (public endpoint)
 */
invitations.post("/accept", async (c) => {
  const { token } = await c.req.json<{ token: string }>();

  if (!token) {
    throw new HTTPException(400, { message: "Invalid token" });
  }

  try {
    const db = getDb();
    // Get the invitation
    const [invitation] = await db
      .select()
      .from(invitationsTable)
      .where(and(
        eq(invitationsTable.token, token),
        eq(invitationsTable.status, "pending")
      ))
      .limit(1);

    if (!invitation) {
      throw new HTTPException(404, { message: "Invalid or expired invitation" });
    }

    // Check if expired
    if (isExpired(invitation.expiresAt)) {
      // Mark as expired
      await db
        .update(invitationsTable)
        .set({ status: "expired" })
        .where(eq(invitationsTable.id, invitation.id));

      throw new HTTPException(410, { message: "Invitation has expired" });
    }

    // Mark invitation as accepted
    const [acceptedInvitation] = await db
      .update(invitationsTable)
      .set({
        status: "accepted",
        acceptedAt: new Date(),
      })
      .where(eq(invitationsTable.id, invitation.id))
      .returning();

    // TODO: Create user account or add to workspace
    // This would integrate with your auth system (Clerk)

    return apiSuccess(c, {
      message: "Invitation accepted successfully",
      invitation: acceptedInvitation,
      redirectUrl: "/dashboard", // Or wherever you want to redirect after acceptance
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error accepting invitation:", error);
    throw new HTTPException(500, { message: "Failed to accept invitation" });
  }
});

/**
 * Get invitation details by token (public endpoint)
 */
invitations.get("/token/:token", async (c) => {
  const token = c.req.param("token");

  try {
    const db = getDb();
    const [invitation] = await db
      .select({
        invitation: invitationsTable,
        invitedBy: {
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          email: usersTable.email,
        },
      })
      .from(invitationsTable)
      .leftJoin(usersTable, eq(invitationsTable.invitedById, usersTable.id))
      .where(eq(invitationsTable.token, token))
      .limit(1);

    if (!invitation) {
      throw new HTTPException(404, { message: "Invalid invitation" });
    }

    const { invitation: invite, invitedBy } = invitation;

    // Check if expired
    const expired = isExpired(invite.expiresAt);
    
    return apiSuccess(c, {
      email: invite.email,
      role: invite.role,
      message: invite.message,
      expired,
      status: invite.status,
      invitedBy: invitedBy ? {
        name: `${invitedBy.firstName || ""} ${invitedBy.lastName || ""}`.trim() || invitedBy.email,
        email: invitedBy.email,
      } : null,
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error("Error getting invitation details:", error);
    throw new HTTPException(500, { message: "Failed to get invitation details" });
  }
});

export { invitations };