import { z } from "zod";

/**
 * Document type enum
 */
export const DocumentType = {
  PRD: "prd",
  TEST_PLAN: "test_plan",
  SUMMARY: "summary",
  HYPOTHESIS_DOC: "hypothesis_doc",
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

/**
 * Document format enum
 */
export const DocumentFormat = {
  MARKDOWN: "markdown",
  PDF: "pdf",
  HTML: "html",
} as const;

export type DocumentFormat = typeof DocumentFormat[keyof typeof DocumentFormat];

/**
 * Edit history entry schema
 */
export const editHistoryEntrySchema = z.object({
  userId: z.string().uuid(),
  timestamp: z.date(),
  changes: z.string(),
});

/**
 * Base document schema
 */
export const documentSchema = z.object({
  id: z.string().uuid(),
  experimentId: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  type: z.enum([DocumentType.PRD, DocumentType.TEST_PLAN, DocumentType.SUMMARY, DocumentType.HYPOTHESIS_DOC]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  format: z.enum([DocumentFormat.MARKDOWN, DocumentFormat.PDF, DocumentFormat.HTML]).default(DocumentFormat.MARKDOWN),
  version: z.number().int().positive(),
  previousVersionId: z.string().uuid().optional(),
  exportedAt: z.date().optional(),
  exportedFormat: z.string().optional(),
  lastEditedBy: z.string().uuid().optional(),
  editHistory: z.array(editHistoryEntrySchema).default([]),
  shareableLink: z.string().url().optional(),
  shareExpiresAt: z.date().optional(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Document version schema
 */
export const documentVersionSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  version: z.number().int().positive(),
  content: z.string(),
  changesSummary: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  createdAt: z.date(),
});

/**
 * Create document input schema
 */
export const createDocumentInputSchema = z.object({
  experimentId: z.string().uuid().optional(),
  type: z.enum([DocumentType.PRD, DocumentType.TEST_PLAN, DocumentType.SUMMARY, DocumentType.HYPOTHESIS_DOC]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  format: z.enum([DocumentFormat.MARKDOWN, DocumentFormat.PDF, DocumentFormat.HTML]).default(DocumentFormat.MARKDOWN),
});

/**
 * Update document input schema
 */
export const updateDocumentInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
  changesSummary: z.string().optional(),
});

/**
 * Export document input schema
 */
export const exportDocumentInputSchema = z.object({
  format: z.enum([DocumentFormat.PDF, DocumentFormat.MARKDOWN, DocumentFormat.HTML]),
  includeMetadata: z.boolean().default(false),
});

/**
 * Share document input schema
 */
export const shareDocumentInputSchema = z.object({
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

/**
 * Document filter schema
 */
export const documentFilterSchema = z.object({
  experimentId: z.string().uuid().optional(),
  type: z.enum([DocumentType.PRD, DocumentType.TEST_PLAN, DocumentType.SUMMARY, DocumentType.HYPOTHESIS_DOC]).optional(),
  createdBy: z.string().uuid().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

/**
 * Document export result schema
 */
export const documentExportResultSchema = z.object({
  format: z.string(),
  content: z.string(),
  filename: z.string(),
  mimeType: z.string(),
});

/**
 * Type guards
 */
export function isValidDocumentType(type: string): type is DocumentType {
  return Object.values(DocumentType).includes(type as DocumentType);
}

export function isValidDocumentFormat(format: string): format is DocumentFormat {
  return Object.values(DocumentFormat).includes(format as DocumentFormat);
}

/**
 * Validation helpers
 */
export function validateDocument(data: unknown) {
  return documentSchema.safeParse(data);
}

export function validateCreateDocumentInput(data: unknown) {
  return createDocumentInputSchema.safeParse(data);
}

export function validateUpdateDocumentInput(data: unknown) {
  return updateDocumentInputSchema.safeParse(data);
}

export function validateExportDocumentInput(data: unknown) {
  return exportDocumentInputSchema.safeParse(data);
}

export function validateShareDocumentInput(data: unknown) {
  return shareDocumentInputSchema.safeParse(data);
}

export function validateDocumentFilter(data: unknown) {
  return documentFilterSchema.safeParse(data);
}

/**
 * Constants
 */
export const MAX_DOCUMENT_TITLE_LENGTH = 255;
export const MAX_DOCUMENT_CONTENT_LENGTH = 1000000; // 1MB
export const DEFAULT_SHARE_EXPIRY_DAYS = 7;
export const MAX_SHARE_EXPIRY_DAYS = 30;

/**
 * MIME types for document formats
 */
export const DOCUMENT_MIME_TYPES: Record<DocumentFormat, string> = {
  [DocumentFormat.MARKDOWN]: "text/markdown",
  [DocumentFormat.PDF]: "application/pdf",
  [DocumentFormat.HTML]: "text/html",
};

/**
 * File extensions for document formats
 */
export const DOCUMENT_FILE_EXTENSIONS: Record<DocumentFormat, string> = {
  [DocumentFormat.MARKDOWN]: ".md",
  [DocumentFormat.PDF]: ".pdf",
  [DocumentFormat.HTML]: ".html",
};

/**
 * Document templates
 */
export const DOCUMENT_TEMPLATES: Record<DocumentType, string> = {
  [DocumentType.PRD]: `# Product Requirements Document

## Overview
[Brief description of the feature or product]

## Problem Statement
[What problem are we solving?]

## Goals and Objectives
- [Goal 1]
- [Goal 2]

## User Stories
- As a [user type], I want to [action] so that [benefit]

## Requirements
### Functional Requirements
- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements
- [Performance requirements]
- [Security requirements]

## Success Metrics
- [Metric 1]
- [Metric 2]`,

  [DocumentType.TEST_PLAN]: `# A/B Test Plan

## Test Overview
**Test Name:** [Name]
**Hypothesis:** [We believe that...]
**Duration:** [X days/weeks]

## Test Details
### Control
[Description of control variant]

### Treatment
[Description of treatment variant]

## Success Metrics
### Primary Metric
- [Metric name and expected impact]

### Secondary Metrics
- [Additional metrics to monitor]

## Test Timeline
- **Start Date:** [Date]
- **End Date:** [Date]
- **Analysis Date:** [Date]`,

  [DocumentType.SUMMARY]: `# Experiment Summary

## Results Overview
[High-level summary of results]

## Key Findings
1. [Finding 1]
2. [Finding 2]

## Recommendations
[What should we do based on these results?]

## Next Steps
- [Action item 1]
- [Action item 2]`,

  [DocumentType.HYPOTHESIS_DOC]: `# Hypothesis Document

## Hypothesis Statement
We believe that **[intervention]** for **[target audience]** will result in **[expected outcome]** because **[reasoning]**.

## Success Metrics
We'll know this works when:
- [Metric 1]
- [Metric 2]

## Supporting Evidence
[Research, data, or insights that support this hypothesis]

## Risks and Assumptions
### Risks
- [Risk 1]
- [Risk 2]

### Assumptions
- [Assumption 1]
- [Assumption 2]`,
};