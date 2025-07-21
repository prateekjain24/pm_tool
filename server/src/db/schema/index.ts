import { relations } from "drizzle-orm";
import { documents } from "./documents";
import { documentVersions } from "./documentVersions";
import { experiments } from "./experiments";
import { hypotheses } from "./hypotheses";
import { hypothesisScores } from "./hypothesisScores";
import { userSettings } from "./userSettings";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { invitations } from "./invitations";

// Define relations between tables
export const usersRelations = relations(users, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [users.workspaceId],
    references: [workspaces.id],
  }),
  hypotheses: many(hypotheses),
  scores: many(hypothesisScores),
  documents: many(documents),
  documentVersions: many(documentVersions),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  users: many(users),
  hypotheses: many(hypotheses),
  experiments: many(experiments),
  documents: many(documents),
  invitations: many(invitations),
}));

export const hypothesesRelations = relations(hypotheses, ({ one, many }) => ({
  user: one(users, {
    fields: [hypotheses.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [hypotheses.workspaceId],
    references: [workspaces.id],
  }),
  experiments: many(experiments),
  scores: many(hypothesisScores),
}));

export const experimentsRelations = relations(experiments, ({ one, many }) => ({
  hypothesis: one(hypotheses, {
    fields: [experiments.hypothesisId],
    references: [hypotheses.id],
  }),
  workspace: one(workspaces, {
    fields: [experiments.workspaceId],
    references: [workspaces.id],
  }),
  documents: many(documents),
}));

export const hypothesisScoresRelations = relations(hypothesisScores, ({ one }) => ({
  hypothesis: one(hypotheses, {
    fields: [hypothesisScores.hypothesisId],
    references: [hypotheses.id],
  }),
  scorer: one(users, {
    fields: [hypothesisScores.scoredBy],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  experiment: one(experiments, {
    fields: [documents.experimentId],
    references: [experiments.id],
  }),
  workspace: one(workspaces, {
    fields: [documents.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
  }),
  lastEditor: one(users, {
    fields: [documents.lastEditedBy],
    references: [users.id],
  }),
  versions: many(documentVersions),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
  creator: one(users, {
    fields: [documentVersions.createdBy],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedById],
    references: [users.id],
  }),
  acceptedBy: one(users, {
    fields: [invitations.acceptedByUserId],
    references: [users.id],
  }),
}));

export * from "./documents";
export * from "./documentVersions";
export * from "./experiments";
export * from "./hypotheses";
export * from "./hypothesisScores";
export * from "./userSettings";
// Export all schemas
export * from "./users";
export * from "./workspaces";
export * from "./invitations";

// Export for migrations
export const schema = {
  users,
  workspaces,
  hypotheses,
  experiments,
  hypothesisScores,
  documents,
  documentVersions,
  userSettings,
  invitations,
};
