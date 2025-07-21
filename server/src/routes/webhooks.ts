import { Hono } from "hono";
import { Webhook } from "svix";
import { getDb } from "../db";
import { users as usersTable, workspaces as workspacesTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { logger } from "../utils/logger";
import { env } from "../config/env";

const webhooks = new Hono();

// Clerk webhook event types
interface ClerkWebhookEvent {
  data: Record<string, any>;
  object: string;
  type: string;
}

interface UserCreatedEvent {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
      verification: {
        status: string;
      };
    }>;
    first_name: string | null;
    last_name: string | null;
    created_at: number;
    updated_at: number;
  };
  object: "event";
  type: "user.created";
}

interface UserUpdatedEvent {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
      verification: {
        status: string;
      };
    }>;
    first_name: string | null;
    last_name: string | null;
    updated_at: number;
  };
  object: "event";
  type: "user.updated";
}

interface UserDeletedEvent {
  data: {
    id: string;
    deleted: boolean;
  };
  object: "event";
  type: "user.deleted";
}

interface OrganizationCreatedEvent {
  data: {
    id: string;
    name: string;
    slug: string;
    created_at: number;
  };
  object: "event";
  type: "organization.created";
}

interface OrganizationMembershipCreatedEvent {
  data: {
    id: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
    public_user_data: {
      user_id: string;
    };
    role: string;
    created_at: number;
  };
  object: "event";
  type: "organizationMembership.created";
}

/**
 * Clerk webhook endpoint
 * Handles user lifecycle events from Clerk
 */
webhooks.post("/clerk", async (c) => {
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    logger.error("CLERK_WEBHOOK_SECRET not configured");
    throw new HTTPException(500, { message: "Webhook secret not configured" });
  }

  // Get headers required for verification
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn("Missing svix headers in webhook request");
    throw new HTTPException(400, { message: "Missing webhook headers" });
  }

  // Get the raw body
  const body = await c.req.text();

  // Create Svix instance
  const wh = new Webhook(webhookSecret);

  let evt: ClerkWebhookEvent;

  try {
    // Verify the webhook signature
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    logger.error({ error }, "Failed to verify webhook signature");
    throw new HTTPException(400, { message: "Invalid webhook signature" });
  }

  // Log the event
  logger.info({ type: evt.type, id: evt.data.id }, "Processing Clerk webhook event");

  try {
    // Handle different event types
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt as UserCreatedEvent);
        break;
      
      case "user.updated":
        await handleUserUpdated(evt as UserUpdatedEvent);
        break;
      
      case "user.deleted":
        await handleUserDeleted(evt as UserDeletedEvent);
        break;
      
      case "organization.created":
        await handleOrganizationCreated(evt as OrganizationCreatedEvent);
        break;
      
      case "organizationMembership.created":
        await handleOrganizationMembershipCreated(evt as OrganizationMembershipCreatedEvent);
        break;
      
      default:
        logger.info({ type: evt.type }, "Unhandled webhook event type");
    }

    return c.json({ success: true });
  } catch (error) {
    logger.error({ error, eventType: evt.type }, "Error processing webhook event");
    throw new HTTPException(500, { message: "Failed to process webhook event" });
  }
});

/**
 * Handle user.created event
 */
async function handleUserCreated(event: UserCreatedEvent) {
  const { id, email_addresses, first_name, last_name } = event.data;
  
  // Get primary email
  const primaryEmail = email_addresses.find(e => e.verification.status === "verified")?.email_address;
  
  if (!primaryEmail) {
    logger.warn({ userId: id }, "No verified email found for user");
    return;
  }

  try {
    // Check if user already exists
    const db = getDb();
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, id))
      .limit(1);

    if (existingUser.length > 0) {
      logger.info({ userId: id }, "User already exists, skipping creation");
      return;
    }

    // TODO: Get workspace ID from invitation or create default workspace
    // For now, we'll create without a workspace
    
    // Create user in database
    const [newUser] = await db
      .insert(usersTable)
      .values({
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        role: "member", // Default role
        createdAt: new Date(event.data.created_at),
        updatedAt: new Date(event.data.updated_at),
      })
      .returning();

    if (newUser) {
      logger.info({ userId: newUser.id, clerkId: id }, "User created successfully");
    }
  } catch (error) {
    logger.error({ error, userId: id }, "Failed to create user");
    throw error;
  }
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(event: UserUpdatedEvent) {
  const { id, email_addresses, first_name, last_name, updated_at } = event.data;
  
  // Get primary email
  const primaryEmail = email_addresses.find(e => e.verification.status === "verified")?.email_address;
  
  if (!primaryEmail) {
    logger.warn({ userId: id }, "No verified email found for user");
    return;
  }

  try {
    // Update user in database
    const db = getDb();
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        updatedAt: new Date(updated_at),
      })
      .where(eq(usersTable.clerkId, id))
      .returning();

    if (!updatedUser) {
      logger.warn({ userId: id }, "User not found for update");
      return;
    }

    logger.info({ userId: updatedUser.id, clerkId: id }, "User updated successfully");
  } catch (error) {
    logger.error({ error, userId: id }, "Failed to update user");
    throw error;
  }
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(event: UserDeletedEvent) {
  const { id } = event.data;

  try {
    // Soft delete user (set deletedAt timestamp)
    const db = getDb();
    const [deletedUser] = await db
      .update(usersTable)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.clerkId, id))
      .returning();

    if (!deletedUser) {
      logger.warn({ userId: id }, "User not found for deletion");
      return;
    }

    logger.info({ userId: deletedUser.id, clerkId: id }, "User soft deleted successfully");
  } catch (error) {
    logger.error({ error, userId: id }, "Failed to delete user");
    throw error;
  }
}

/**
 * Handle organization.created event
 */
async function handleOrganizationCreated(event: OrganizationCreatedEvent) {
  const { id, name, slug, created_at } = event.data;

  try {
    // Check if workspace already exists
    const db = getDb();
    const existingWorkspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.clerkOrgId, id))
      .limit(1);

    if (existingWorkspace.length > 0) {
      logger.info({ workspaceId: id }, "Workspace already exists, skipping creation");
      return;
    }

    // Create workspace in database
    const [newWorkspace] = await db
      .insert(workspacesTable)
      .values({
        name,
        slug,
        clerkOrgId: id,
        plan: "free", // Default plan
        createdAt: new Date(created_at),
        updatedAt: new Date(created_at),
      })
      .returning();

    if (newWorkspace) {
      logger.info({ workspaceId: newWorkspace.id, clerkOrgId: id }, "Workspace created successfully");
    }
  } catch (error) {
    logger.error({ error, orgId: id }, "Failed to create workspace");
    throw error;
  }
}

/**
 * Handle organizationMembership.created event
 */
async function handleOrganizationMembershipCreated(event: OrganizationMembershipCreatedEvent) {
  const { organization, public_user_data, role } = event.data;
  const userId = public_user_data.user_id;

  try {
    // Find the workspace
    const db = getDb();
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.clerkOrgId, organization.id))
      .limit(1);

    if (!workspace) {
      logger.warn({ orgId: organization.id }, "Workspace not found for membership");
      return;
    }

    // Map Clerk organization role to our role system
    const userRole = role === "admin" ? "admin" : "member";

    // Update user with workspace and role
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        workspaceId: workspace.id,
        role: userRole,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.clerkId, userId))
      .returning();

    if (!updatedUser) {
      logger.warn({ userId, workspaceId: workspace.id }, "User not found for workspace assignment");
      return;
    }

    logger.info({ 
      userId: updatedUser.id, 
      workspaceId: workspace.id, 
      role: userRole 
    }, "User added to workspace successfully");
  } catch (error) {
    logger.error({ error, userId, orgId: organization.id }, "Failed to add user to workspace");
    throw error;
  }
}

export { webhooks };