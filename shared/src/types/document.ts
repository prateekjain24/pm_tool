export interface Document {
  id: string;
  experimentId?: string;
  workspaceId: string;
  type: 'prd' | 'test_plan' | 'summary' | 'hypothesis_doc';
  title: string;
  content: string;
  format: 'markdown' | 'pdf' | 'html';
  version: number;
  previousVersionId?: string;
  exportedAt?: Date;
  exportedFormat?: string;
  lastEditedBy?: string;
  editHistory: EditHistoryEntry[];
  shareableLink?: string;
  shareExpiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditHistoryEntry {
  userId: string;
  timestamp: Date;
  changes: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  changesSummary?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface CreateDocumentInput {
  experimentId?: string;
  type: Document['type'];
  title: string;
  content: string;
  format?: Document['format'];
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  changesSummary?: string;
}

export interface ExportDocumentInput {
  format: 'pdf' | 'markdown' | 'html';
  includeMetadata?: boolean;
}

export interface ShareDocumentInput {
  expiresInDays?: number;
}

export interface DocumentFilter {
  experimentId?: string;
  type?: Document['type'];
  createdBy?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface DocumentWithVersions extends Document {
  versions: DocumentVersion[];
}

export interface DocumentExportResult {
  format: string;
  content: string | Buffer;
  filename: string;
  mimeType: string;
}