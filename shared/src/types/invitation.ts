import type { User } from "./auth";

/**
 * Team invitation status
 */
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

/**
 * Team invitation type
 */
export interface Invitation {
  id: string;
  email: string;
  role: User["role"];
  token: string;
  message?: string | null;
  workspaceId: string;
  invitedById?: string | null;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date | null;
  revokedAt?: Date | null;
  acceptedByUserId?: string | null;
}

/**
 * Input for creating a new invitation
 */
export interface CreateInvitationInput {
  email: string;
  role: User["role"];
  message?: string;
}

/**
 * Input for accepting an invitation
 */
export interface AcceptInvitationInput {
  token: string;
}

/**
 * Response from invitation creation
 */
export interface InvitationResponse {
  invitation: Invitation;
  inviteUrl: string;
}

/**
 * Extended invitation with relationships
 */
export interface InvitationWithRelations extends Invitation {
  invitedBy?: {
    id: string;
    name: string;
    email: string;
  };
  workspace: {
    id: string;
    name: string;
  };
}

/**
 * Invitation list filter options
 */
export interface InvitationFilter {
  status?: InvitationStatus;
  workspaceId?: string;
  email?: string;
}