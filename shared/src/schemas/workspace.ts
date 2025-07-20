import { z } from 'zod';

// Validation schemas for workspace operations

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

export const inviteToWorkspaceSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'member', 'viewer']),
});

export const workspaceSlugSchema = z.string()
  .min(2)
  .max(50)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

// Utility function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}