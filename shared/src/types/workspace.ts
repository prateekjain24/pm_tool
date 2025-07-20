// Workspace types for organization support

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface CreateWorkspaceInput {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  logoUrl?: string;
}

export interface InviteToWorkspaceInput {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface WorkspaceWithMembers extends Workspace {
  members: (WorkspaceMember & {
    user: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      avatarUrl?: string | null;
    };
  })[];
  memberCount: number;
}

export interface WorkspaceQuota {
  experiments: {
    used: number;
    limit: number;
  };
  documents: {
    used: number;
    limit: number;
  };
  members: {
    used: number;
    limit: number;
  };
}

export const WorkspacePlans = {
  free: {
    name: 'Free',
    experiments: 5,
    documents: 10,
    members: 3,
  },
  starter: {
    name: 'Starter',
    experiments: 50,
    documents: 100,
    members: 10,
  },
  pro: {
    name: 'Pro',
    experiments: 500,
    documents: 1000,
    members: 50,
  },
  enterprise: {
    name: 'Enterprise',
    experiments: -1, // unlimited
    documents: -1,
    members: -1,
  },
} as const;

export const WorkspaceRolePermissions = {
  owner: ['*'],
  admin: ['workspace:update', 'workspace:invite', 'workspace:remove_member', 'hypothesis:*', 'experiment:*', 'document:*'],
  member: ['hypothesis:*', 'experiment:*', 'document:*'],
  viewer: ['hypothesis:read', 'experiment:read', 'document:read'],
} as const;