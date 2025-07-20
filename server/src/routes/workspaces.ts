import { zValidator } from "@hono/zod-validator";
import {
  createWorkspaceSchema,
  generateSlug,
  inviteToWorkspaceSchema,
  updateWorkspaceSchema,
} from "@shared/schemas";
import type { WorkspaceWithMembers } from "@shared/types";
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { apiErrors, apiSuccess } from "../utils/apiResponse";
import { requireUser } from "../utils/auth";
import { logger } from "../utils/logger";

const workspaceRouter = new Hono();

// Apply auth middleware to all workspace routes
workspaceRouter.use("*", authMiddleware);

// Mock data for now (will be replaced with database queries)
const mockWorkspaces: Map<string, WorkspaceWithMembers> = new Map();

// Get user's workspaces
workspaceRouter.get("/", async (c) => {
  const user = requireUser(c);

  logger.info({ userId: user.id }, "Fetching workspaces for user");

  // Mock: Get workspaces where user is a member
  const userWorkspaces = Array.from(mockWorkspaces.values()).filter(
    (ws) => ws.ownerId === user.id || ws.members.some((m) => m.userId === user.id),
  );

  return apiSuccess(c, userWorkspaces);
});

// Create new workspace
workspaceRouter.post("/", zValidator("json", createWorkspaceSchema), async (c) => {
  const user = requireUser(c);
  const data = c.req.valid("json");

  logger.info({ userId: user.id, name: data.name }, "Creating new workspace");

  // Generate slug if not provided
  const slug = data.slug || generateSlug(data.name);

  // Check if slug is already taken
  const slugExists = Array.from(mockWorkspaces.values()).some((ws) => ws.slug === slug);
  if (slugExists) {
    return apiErrors.conflict(c, "Workspace slug already exists");
  }

  // Create workspace
  const workspace: WorkspaceWithMembers = {
    id: crypto.randomUUID(),
    name: data.name,
    slug,
    description: data.description,
    logoUrl: data.logoUrl,
    ownerId: user.id,
    plan: "free",
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        id: crypto.randomUUID(),
        workspaceId: "",
        userId: user.id,
        role: "owner",
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: user.id,
          email: user.email!, // User type guarantees email is not null
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          avatarUrl: null,
        },
      },
    ],
    memberCount: 1,
  };

  // Update workspace ID in member
  workspace.members[0]!.workspaceId = workspace.id;

  mockWorkspaces.set(workspace.id, workspace);

  logger.info({ workspaceId: workspace.id }, "Workspace created successfully");

  return apiSuccess(c, workspace, { status: 201 });
});

// Get workspace details
workspaceRouter.get("/:id", async (c) => {
  const user = requireUser(c);
  const workspaceId = c.req.param("id");

  logger.info({ workspaceId, userId: user.id }, "Fetching workspace details");

  const workspace = mockWorkspaces.get(workspaceId);
  if (!workspace) {
    return apiErrors.notFound(c, "Workspace");
  }

  // Check if user has access
  const hasAccess =
    workspace.ownerId === user.id || workspace.members.some((m) => m.userId === user.id);

  if (!hasAccess) {
    return apiErrors.forbidden(c, "Access denied to this workspace");
  }

  return apiSuccess(c, workspace);
});

// Update workspace
workspaceRouter.put("/:id", zValidator("json", updateWorkspaceSchema), async (c) => {
  const user = requireUser(c);
  const workspaceId = c.req.param("id");
  const data = c.req.valid("json");

  logger.info({ workspaceId, userId: user.id }, "Updating workspace");

  const workspace = mockWorkspaces.get(workspaceId);
  if (!workspace) {
    return apiErrors.notFound(c, "Workspace");
  }

  // Check if user has admin access
  const member = workspace.members.find((m) => m.userId === user.id);
  const hasAdminAccess =
    workspace.ownerId === user.id ||
    (member && (member.role === "admin" || member.role === "owner"));

  if (!hasAdminAccess) {
    return apiErrors.forbidden(c, "Admin access required");
  }

  // Update workspace
  if (data.name) workspace.name = data.name;
  if (data.description !== undefined) workspace.description = data.description;
  if (data.logoUrl !== undefined) workspace.logoUrl = data.logoUrl;
  workspace.updatedAt = new Date();

  logger.info({ workspaceId }, "Workspace updated successfully");

  return apiSuccess(c, workspace);
});

// Invite member to workspace
workspaceRouter.post("/:id/invite", zValidator("json", inviteToWorkspaceSchema), async (c) => {
  const user = requireUser(c);
  const workspaceId = c.req.param("id");
  const data = c.req.valid("json");

  logger.info(
    {
      workspaceId,
      invitedBy: user.id,
      inviteeEmail: data.email,
    },
    "Inviting member to workspace",
  );

  const workspace = mockWorkspaces.get(workspaceId);
  if (!workspace) {
    return apiErrors.notFound(c, "Workspace");
  }

  // Check if user has admin access
  const member = workspace.members.find((m) => m.userId === user.id);
  const hasAdminAccess =
    workspace.ownerId === user.id ||
    (member && (member.role === "admin" || member.role === "owner"));

  if (!hasAdminAccess) {
    return apiErrors.forbidden(c, "Admin access required");
  }

  // Create invitation (mock)
  const invitation = {
    id: crypto.randomUUID(),
    workspaceId,
    email: data.email,
    role: data.role,
    invitedBy: user.id,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdAt: new Date(),
  };

  logger.info({ invitationId: invitation.id }, "Invitation created");

  // In a real implementation, send invitation email here

  return apiSuccess(c, invitation);
});

// Switch workspace (set as current workspace)
workspaceRouter.post("/:id/switch", async (c) => {
  const user = requireUser(c);
  const workspaceId = c.req.param("id");

  logger.info({ workspaceId, userId: user.id }, "Switching workspace");

  const workspace = mockWorkspaces.get(workspaceId);
  if (!workspace) {
    return apiErrors.notFound(c, "Workspace");
  }

  // Check if user has access
  const hasAccess =
    workspace.ownerId === user.id || workspace.members.some((m) => m.userId === user.id);

  if (!hasAccess) {
    return apiErrors.forbidden(c, "Access denied to this workspace");
  }

  // In a real implementation, update user's current workspace in database/session

  return apiSuccess(c, { workspaceId });
});

export { workspaceRouter };
