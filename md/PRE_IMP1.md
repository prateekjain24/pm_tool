# Pre-Experiment Check Tool Implementation Plan - Part 1: Foundation & Core Features

## Overview
This implementation plan breaks down the Pre-Experiment Check Tool into manageable one-story-point tickets. Each ticket represents approximately 4-8 hours of work and includes clear deliverables.

This document covers tickets 1-65, focusing on:
- Phase 1: Foundation & Infrastructure (20 tickets)
- Phase 2: Authentication & Routing (15 tickets)
- Phase 3: Hypothesis Builder UI (30 tickets)

## Recent Updates (2025-07-20)

### Completed User Settings & Navigation Tickets (28-30)
- ✅ TICKET-028: Navigation component with auth state
  - Updated DashboardLayout with role-based navigation filtering
  - Created useUser hook for role and permission management
  - Added admin-only navigation items (Team, Admin)
  - Display user role badge in sidebar
- ✅ TICKET-029: User settings page implementation
  - Built complete Settings page with 4 tabs
  - Created UI components (Input, Label, Switch, Select)
  - Implemented all settings components with form validation
  - Added settings types and schemas to shared package
  - Integrated with Clerk for profile updates
- ✅ TICKET-030: API middleware auth validation
  - Auth middleware already fully implemented
  - Created complete settings API with all CRUD operations
  - Protected routes with proper JWT validation

### Completed Workspace & Dashboard Layout Tickets (25-26)
- ✅ TICKET-025: Implement workspace/organization support
  - Created workspace types and schemas in shared package
  - Implemented workspace API endpoints (create, list, switch, invite)
  - Created WorkspaceProvider context for client-side state management
  - Added WorkspaceSelector component in header
  - Integrated workspace creation into onboarding flow
  - Mock data implementation ready for database integration
- ✅ TICKET-026: Create dashboard layout component
  - Built responsive DashboardLayout with sidebar navigation
  - Implemented mobile-friendly collapsible sidebar
  - Created nested routing structure for dashboard pages
  - Added navigation for all main sections (Dashboard, Hypotheses, Experiments, Documents, Settings)
  - Separated PublicHeader for landing page from dashboard Header
  - Integrated with ProtectedRoute wrapper for authentication

### Key Components Added
- **WorkspaceContext**: React context for workspace state management
- **WorkspaceSelector**: Dropdown component for switching workspaces
- **DashboardLayout**: Main layout component with sidebar and content area
- **PublicHeader**: Header component for public pages (landing, sign-in, sign-up)

### Technical Improvements
- Enhanced onboarding flow with workspace creation step
- Implemented proper route nesting for dashboard sections
- Added responsive design with mobile menu support
- Created placeholder pages for upcoming features

## Recent Updates (2025-07-20)
### Completed Authentication & Routing Tickets (21-24)
- ✅ TICKET-021: Create protected route wrapper component
  - Component already existed and was fully functional
  - Updated to use new LoadingSpinner component
- ✅ TICKET-022 & 023: Implement Clerk sign-in/sign-up pages
  - Both pages were already implemented in previous work
- ✅ TICKET-024: Create user profile page
  - Implemented using Clerk's UserProfile component
  - Created supporting UI components (LoadingSpinner, Card, Tabs)
  - Added profile route and navigation
  - Integrated with dashboard and header navigation

### Key UI Components Added
- **LoadingSpinner**: Reusable loading indicator with size variants
- **Card**: Shadcn-style card component with header, content, and footer sections
- **Tabs**: Radix UI-based tabs component for future settings organization
- **Alert**: Fixed missing Alert component for ErrorBoundary

### Technical Improvements
- Fixed Sentry integration issues with latest SDK versions
- Added @radix-ui/react-tabs dependency for Tabs component
- Updated navigation to use React Router Links consistently
- Configured UserButton to navigate to profile page instead of modal

## Recent Updates (2025-07-19)
### Completed Infrastructure Tickets (18-20)
- ✅ TICKET-018: Setup error handling middleware
  - Implemented comprehensive error handling with HTTPException
  - Created client ErrorBoundary component with recovery UI
  - Added Sentry integration for both server and client
  - Configured error filtering and sanitization
- ✅ TICKET-019: Create API response utilities
  - Built standardized response utilities (apiSuccess, apiError, apiPaginated, apiBatchResult)
  - Created response formatter middleware for automatic formatting
  - Added pagination helpers with proper metadata
  - Integrated with shared types for type safety
- ✅ TICKET-020: Setup logging system  
  - Created custom logger with namespace support and log levels
  - Implemented request/response logging middleware with timing
  - Added rotating file logger with compression for production
  - Configured log retention and automatic cleanup
  - Added performance monitoring and slow request detection

### Key Technical Improvements
- Fixed TypeScript compilation issues with Hono status codes
- Added environment variables for Sentry configuration
- Integrated log rotation with graceful shutdown
- Enhanced error tracking with user context and request correlation

## Recent Updates (2025-07-18)
### Completed Authentication Implementation
- ✅ Fixed Clerk JWT verification in backend middleware using authenticateRequest
- ✅ Implemented React Router v7 with protected routes
- ✅ Created dedicated sign-in and sign-up pages using Clerk components
- ✅ Built dashboard and onboarding pages
- ✅ Updated ProtectedRoute component with proper navigation
- ✅ Configured all routing and redirects

### Key Changes from Original Plan
- Used `authenticateRequest` method instead of deprecated `verifyToken` for JWT validation
- Implemented React Router earlier than planned (TICKET-027) as it was needed for auth pages
- Created all authentication pages upfront for better user flow

### Database Schema Implementation (2025-07-18)
- ✅ Implemented TICKET-007: Hypothesis schema with full "We Believe That" framework support
- ✅ Implemented TICKET-008: Experiment schema with variants and timeline tracking
- ✅ Implemented TICKET-009: HypothesisScore schema with AI feedback structure
- ✅ Updated schema index with proper relations between all tables
- ✅ Created shared TypeScript types for hypothesis and experiment entities
- ✅ Added proper indexes for performance optimization
- ✅ Used JSONB for flexible data structures (metrics, variants, feedback)
- ✅ Implemented cascade deletes for data integrity
- ✅ Added decimal precision for score values (0.0 to 10.0)

### Document Schema & Migration System (2025-07-19)
- ✅ Implemented TICKET-010: Document schema with version control and collaboration features
- ✅ Created DocumentVersions table for complete version history tracking
- ✅ Added support for multiple document types (PRD, test plan, summary, hypothesis doc)
- ✅ Implemented export tracking and shareable links with expiration
- ✅ Enhanced TICKET-011: Database migration system with helper scripts
- ✅ Created seed script with sample data for development
- ✅ Added database reset script with safety prompts
- ✅ Created migration check script for status monitoring
- ✅ Updated npm scripts for improved developer workflow (db:seed, db:reset, db:check, db:migrate:dev)

### Shared Types Enhancement (2025-07-19)
- ✅ Enhanced TICKET-015: Hypothesis types with comprehensive Zod validation schemas
- ✅ Enhanced TICKET-016: Experiment types with business rule validations
- ✅ Enhanced TICKET-017: Document types with templates and export utilities
- ✅ Created shared/src/schemas directory with validation for all entity types
- ✅ Added utility types (DeepPartial, RequireFields, Entity mixins, Result types)
- ✅ Created standardized API response types (ApiSuccessResponse, PaginatedResponse, ErrorCodes)
- ✅ Implemented type guards and validation helpers for runtime safety
- ✅ Added document templates for PRD, Test Plan, Summary, and Hypothesis Doc
- ✅ Defined constants for business rules (score thresholds, confidence levels, etc.)

## Tech Stack Decisions
- **Authentication**: Clerk (instead of Lucia Auth)
- **Code Quality**: Biome (instead of Prettier/ESLint)
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **AI Providers**: OpenAI o3-mini, Claude Sonnet 4, Google Gemini 2.5 Pro
- **Framework**: Bun + Hono + Vite + React

## Phase 1: Foundation & Infrastructure (20 tickets)

### TICKET-001: Setup Biome for code formatting and linting ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Install Biome in the monorepo
- ✅ Configure biome.json with project standards
- ✅ Add format and lint scripts to package.json
- ⏳ Update CI/CD to run Biome checks (to be done later)
**Technical Details:**
- ✅ Use `bun add --dev @biomejs/biome`
- ✅ Configure for TypeScript, React, and Node environments
- ⏳ Set up pre-commit hooks (optional, to be done later)

### TICKET-002: Configure Clerk authentication for client ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Install @clerk/clerk-react
- ✅ Setup ClerkProvider in React app
- ✅ Configure environment variables
- ✅ Create auth configuration file
**Technical Details:**
- ✅ Add Clerk publishable key to .env
- ✅ Wrap App component with ClerkProvider
- ✅ Configure allowed redirect URLs
**Additional Work Completed:**
- ✅ Created ProtectedRoute component with React Router navigation
- ✅ Added Header component with auth UI
- ✅ Created .env.example file
- ✅ Installed react-router-dom and configured routing
- ✅ Created dedicated sign-in and sign-up pages
- ✅ Created dashboard and onboarding pages
- ✅ Updated Header to use React Router Links

### TICKET-003: Configure Clerk middleware for server ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Install @clerk/backend
- ✅ Create auth middleware for Hono
- ✅ Setup JWT verification
- ✅ Add protected route examples
**Technical Details:**
- ✅ Use Clerk's Node SDK for backend
- ✅ Implement middleware to verify session tokens
- ✅ Create helper functions for user context
**Additional Work Completed:**
- ✅ Created optionalAuthMiddleware for flexible auth
- ✅ Added auth utilities (getUser, requireUser, isAuthenticated)
- ✅ Created shared auth types (User, Session, AuthStatusResponse)
- ✅ Added example API endpoints (status, profile, hypothesis)
- ✅ Fixed JWT verification to use authenticateRequest method
- ✅ Implemented proper token extraction and validation
- ✅ Added error handling for authentication failures

### TICKET-004: Setup PostgreSQL with Drizzle ORM ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Install Drizzle ORM and PostgreSQL driver
- ✅ Create database configuration
- ✅ Setup connection pooling
- ✅ Add database health check
**Technical Details:**
- ✅ Use `bun add drizzle-orm pg`
- ✅ Configure connection string from env
- ✅ Setup Drizzle config file
**Additional Work Completed:**
- ✅ Installed drizzle-kit for migrations
- ✅ Created drizzle.config.ts
- ✅ Added migration scripts to package.json
- ✅ Added health check endpoint with database status

### TICKET-005: Create database connection utilities ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create db connection singleton
- ✅ Add connection retry logic
- ✅ Implement graceful shutdown
- ✅ Add connection monitoring
**Technical Details:**
- ✅ Create `server/src/db/connection.ts`
- ✅ Implement exponential backoff for retries
- ✅ Add connection pool metrics
**Additional Work Completed:**
- ✅ Created DatabaseConnection class with singleton pattern
- ✅ Added pool event listeners for monitoring
- ✅ Created health check and metrics functions
- ✅ Added executeWithRetry for automatic retry on connection errors
- ✅ Integrated graceful shutdown in server index.ts
- ✅ Created migration runner script

### TICKET-006: Design and implement User schema ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create User table schema
- ✅ Add Clerk ID mapping
- ✅ Include workspace support
- ✅ Add timestamps and soft delete
**Technical Details:**
- ✅ Created `server/src/db/schema/users.ts` with full user table definition
- ✅ Added proper TypeScript types with type inference
- ✅ Created foreign key reference to workspaces table
- ✅ Added indexes for performance (clerkId, email, workspaceId)
**Additional Work Completed:**
- ✅ Created minimal workspaces schema to support User foreign key
- ✅ Created schema index file with relations definitions
- ✅ Exported all schemas and types
- ✅ Added firstName and lastName fields for user profile
- ✅ Used proper onDelete cascade for workspace reference

### TICKET-007: Design and implement Hypothesis schema ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create comprehensive hypothesis table
- ✅ Support all "We Believe That" fields
- ✅ Add status tracking
- ✅ Include version history support
**Technical Details:**
```typescript
// server/src/db/schema/hypotheses.ts
export const hypotheses = pgTable('hypotheses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  intervention: text('intervention').notNull(),
  targetAudience: text('target_audience').notNull(),
  expectedOutcome: text('expected_outcome').notNull(),
  reasoning: text('reasoning').notNull(),
  successMetrics: jsonb('success_metrics').notNull(),
  status: varchar('status', { length: 50 }).default('draft'),
  version: integer('version').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

### TICKET-008: Design and implement Experiment schema ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create experiment tracking table
- ✅ Link to hypotheses
- ✅ Add duration and traffic fields
- ✅ Support multiple variants
**Technical Details:**
```typescript
export const experiments = pgTable('experiments', {
  id: uuid('id').primaryKey().defaultRandom(),
  hypothesisId: uuid('hypothesis_id').references(() => hypotheses.id),
  name: varchar('name', { length: 255 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  dailyTraffic: integer('daily_traffic'),
  sampleSize: integer('sample_size'),
  variants: jsonb('variants').notNull(),
  status: varchar('status', { length: 50 }).default('planning')
});
```

### TICKET-009: Design and implement HypothesisScore schema ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Track scoring history
- ✅ Store individual dimension scores
- ✅ Include AI feedback
- ✅ Support score evolution
**Technical Details:**
```typescript
export const hypothesisScores = pgTable('hypothesis_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  hypothesisId: uuid('hypothesis_id').references(() => hypotheses.id),
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }),
  clarityScore: decimal('clarity_score', { precision: 3, scale: 1 }),
  measurabilityScore: decimal('measurability_score', { precision: 3, scale: 1 }),
  reasoningScore: decimal('reasoning_score', { precision: 3, scale: 1 }),
  scopeScore: decimal('scope_score', { precision: 3, scale: 1 }),
  testabilityScore: decimal('testability_score', { precision: 3, scale: 1 }),
  aiFeedback: jsonb('ai_feedback'),
  aiProvider: varchar('ai_provider', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});
```

### TICKET-010: Design and implement Document schema ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Support multiple document types
- ✅ Add version control
- ✅ Include export history
- ✅ Support collaborative editing
**Technical Details:**
```typescript
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  experimentId: uuid('experiment_id').references(() => experiments.id),
  type: varchar('type', { length: 50 }).notNull(), // 'prd', 'test_plan', 'summary'
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  format: varchar('format', { length: 20 }), // 'markdown', 'pdf'
  version: integer('version').default(1),
  exportedAt: timestamp('exported_at'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

### TICKET-011: Create database migration system ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Setup Drizzle migrations
- ✅ Create initial migration
- ✅ Add migration scripts
- ✅ Document migration process
**Technical Details:**
- ✅ Configure drizzle.config.ts
- ✅ Create npm scripts for migrations
- ✅ Setup automatic migrations in development

### TICKET-012: Setup Redis for caching ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Install Redis client
- ✅ Create cache utilities
- ✅ Implement cache strategies
- ✅ Add cache invalidation
**Technical Details:**
- ✅ Use ioredis for Bun compatibility
- ✅ Create cache wrapper with TTL support
- ✅ Implement cache-aside pattern
**Additional Work Completed:**
- ✅ Created RedisConnection class with singleton pattern
- ✅ Added connection retry logic with exponential backoff
- ✅ Implemented helper methods for get/set/del/exists operations
- ✅ Added JSON serialization helpers (getJSON/setJSON)
- ✅ Integrated with environment configuration

### TICKET-013: Configure environment variables structure ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create .env.example
- ✅ Setup env validation
- ✅ Add type safety for env vars
- ✅ Document all variables
**Technical Details:**
- ✅ Created shared/src/config/env.ts with Zod validation
- ✅ Separated server and client environment schemas
- ✅ Added runtime validation with helpful error messages
- ✅ Created type-safe environment configs for both server and client
**Implementation Highlights:**
```typescript
// shared/src/config/env.ts
export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  // ... other server vars
});

export const clientEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  VITE_API_URL: z.string().url(),
  // ... other client vars
});
```
**Additional Work Completed:**
- ✅ Installed Zod for schema validation
- ✅ Created parseServerEnv and parseClientEnv functions
- ✅ Updated all server code to use typed env config
- ✅ Updated client code to use typed env config
- ✅ Added helpful error formatting for missing/invalid env vars
- ✅ Preserved dotenv usage in drizzle.config.ts to avoid circular dependencies

### TICKET-014: Create shared types for authentication ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Define User type
- ✅ Create Session type
- ✅ Add Role enum
- ✅ Export from shared package
**Technical Details:**
- ✅ Created shared/src/types/auth.ts with comprehensive auth types
- ✅ Defined User interface with all necessary fields
- ✅ Created Session type for user sessions
- ✅ Added RolePermissions constant for RBAC
- ✅ Included response types for API endpoints
**Implementation Highlights:**
```typescript
// shared/src/types/auth.ts
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  workspaceId?: string;
  role: "admin" | "member" | "viewer";
  createdAt?: Date;
  updatedAt?: Date;
}

export const RolePermissions = {
  admin: ["read", "write", "delete", "manage_team"],
  member: ["read", "write"],
  viewer: ["read"],
} as const;
```
**Additional Work Completed:**
- ✅ Added AuthStatusResponse and UserProfileResponse types
- ✅ Integrated auth types with server middleware
- ✅ Properly exported from shared package index

### TICKET-015: Create shared types for hypotheses ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Define Hypothesis interface
- ✅ Create HypothesisScore type
- ✅ Add status enums
- ✅ Include validation schemas
**Technical Details:**
- ✅ Created comprehensive Hypothesis interface in shared/src/types/hypothesis.ts
- ✅ Defined HypothesisScore type with all scoring dimensions
- ✅ Added status enums and input types
- ✅ Created Zod validation schemas in shared/src/schemas/hypothesis.ts
**Implementation Highlights:**
```typescript
// shared/src/types/hypothesis.ts
export interface Hypothesis {
  id: string;
  userId: string;
  workspaceId: string;
  intervention: string;
  targetAudience: string;
  expectedOutcome: string;
  reasoning: string;
  successMetrics: string[];
  status: 'draft' | 'analyzing' | 'scored' | 'approved';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```
**Additional Work Completed:**
- ✅ Added CreateHypothesisInput and UpdateHypothesisInput types
- ✅ Created ScoreHypothesisInput type for AI scoring
- ✅ Implemented Zod schemas with validation rules
- ✅ Added type guards and validation helpers
- ✅ Defined constants for score dimensions and thresholds

### TICKET-016: Create shared types for experiments ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Define Experiment interface
- ✅ Create Variant type
- ✅ Add calculation types
- ✅ Include timeline types
**Technical Details:**
- ✅ Created comprehensive Experiment interface in shared/src/types/experiment.ts
- ✅ Defined Variant type with allocation and description
- ✅ Added SampleSizeCalculation type for statistical calculations
- ✅ Created ExperimentTimeline type for duration tracking
- ✅ Implemented Zod validation schemas in shared/src/schemas/experiment.ts
**Implementation Highlights:**
```typescript
// shared/src/types/experiment.ts
export interface Experiment {
  id: string;
  hypothesisId: string;
  workspaceId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dailyTraffic?: number;
  sampleSize?: number;
  confidenceLevel: number;
  statisticalPower: number;
  variants: Variant[];
  status: 'planning' | 'running' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```
**Additional Work Completed:**
- ✅ Added CreateExperimentInput and UpdateExperimentInput types
- ✅ Created variant allocation validation (must sum to 100%)
- ✅ Implemented Zod schemas with business rules
- ✅ Added utility functions for duration calculation
- ✅ Defined constants for confidence levels and statistical power

### TICKET-017: Create shared types for documents ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Define Document interface
- ✅ Create template types
- ✅ Add export formats
- ✅ Include metadata types
**Technical Details:**
- ✅ Created comprehensive Document interface in shared/src/types/document.ts
- ✅ Defined document types (PRD, test plan, summary, hypothesis doc)
- ✅ Added export formats (markdown, PDF, HTML)
- ✅ Created metadata types (EditHistoryEntry, DocumentVersion)
- ✅ Implemented Zod validation schemas in shared/src/schemas/document.ts
**Implementation Highlights:**
```typescript
// shared/src/types/document.ts
export interface Document {
  id: string;
  experimentId?: string;
  workspaceId: string;
  type: 'prd' | 'test_plan' | 'summary' | 'hypothesis_doc';
  title: string;
  content: string;
  format: 'markdown' | 'pdf' | 'html';
  version: number;
  editHistory: EditHistoryEntry[];
  shareableLink?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```
**Additional Work Completed:**
- ✅ Added CreateDocumentInput and UpdateDocumentInput types
- ✅ Created ExportDocumentInput and ShareDocumentInput types
- ✅ Implemented document templates for each document type
- ✅ Added MIME types and file extension mappings
- ✅ Created DocumentFilter and DocumentExportResult types
- ✅ Implemented version tracking with DocumentVersion type

### TICKET-018: Setup error handling middleware ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create custom error classes
- ✅ Add error middleware for Hono
- ✅ Implement error logging
- ✅ Add client error boundaries
**Technical Details:**
- ✅ Create AppError base class (HTTPException used)
- ✅ Implement ValidationError, AuthError, etc.
- ✅ Add Sentry integration
**Additional Work Completed:**
- ✅ Created comprehensive error handler middleware with different error type handling
- ✅ Added error factories for common HTTP errors
- ✅ Integrated with request ID tracking
- ✅ Created client ErrorBoundary component with recovery options
- ✅ Added Sentry integration for both server and client
- ✅ Configured Sentry with proper filtering and sanitization

### TICKET-019: Create API response utilities ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Standardize API responses
- ✅ Add pagination helpers
- ✅ Create response types
- ✅ Add error responses
**Technical Details:**
- ✅ Created comprehensive API response utilities
- ✅ Implemented apiSuccess, apiError, apiPaginated, apiBatchResult functions
- ✅ Added parsePaginationParams helper
- ✅ Created response formatter middleware
- ✅ All responses follow ApiSuccessResponse/ApiErrorResponse types
**Additional Work Completed:**
- ✅ Created error response factories for common HTTP errors
- ✅ Added response formatter middleware for automatic formatting
- ✅ Integrated with shared types from @shared/types
- ✅ Added request ID to all responses
- ✅ Implemented pagination with hasNextPage/hasPreviousPage indicators

### TICKET-020: Setup logging system ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Configure structured logging
- ✅ Add request logging
- ✅ Implement log levels
- ✅ Add log rotation
**Technical Details:**
- ✅ Created custom logger utility with namespaces
- ✅ Implemented log levels (DEBUG, INFO, WARN, ERROR)
- ✅ Added request/response logging middleware
- ✅ Implemented performance monitoring middleware
- ✅ Created rotating file logger with compression
**Additional Work Completed:**
- ✅ Request ID correlation across all logs
- ✅ Sensitive header sanitization
- ✅ Color-coded console output for development
- ✅ JSON structured logging for production
- ✅ Automatic log rotation by size (10MB) and date
- ✅ Log compression (gzip) for rotated files
- ✅ Configurable retention (max files and max age)
- ✅ Graceful shutdown handling for log files
- ✅ Performance monitoring with slow request detection
- ✅ Server-Timing headers for debugging

## Phase 2: Authentication & Routing (15 tickets)

### TICKET-021: Create protected route wrapper component ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Build ProtectedRoute component
- ✅ Integrate with Clerk
- ✅ Add loading states
- ✅ Handle redirects
**Technical Details:**
- ✅ ProtectedRoute component already existed and is fully functional
- ✅ Uses Clerk's useAuth hook for authentication state
- ✅ Shows loading spinner while Clerk is initializing
- ✅ Redirects to /sign-in if user is not authenticated
- ✅ Updated to use the new LoadingSpinner component

### TICKET-022: Implement Clerk sign-in page ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create custom sign-in UI
- ✅ Add social login options (via Clerk component)
- ✅ Include error handling (handled by Clerk)
- ✅ Style with Tailwind
**Technical Details:**
- ✅ Use Clerk's SignIn component
- ✅ Customize appearance prop
- ✅ Add redirect logic
**Implementation:**
- ✅ Created SignInPage component at pages/SignIn.tsx
- ✅ Added PM Tools branding
- ✅ Configured redirects to dashboard after sign-in

### TICKET-023: Implement Clerk sign-up page ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create registration flow
- ✅ Add email verification (handled by Clerk)
- ⏳ Include workspace creation (deferred to workspace implementation)
- ✅ Add onboarding redirect
**Technical Details:**
- ✅ Use SignUp component
- ⏳ Add custom fields (using Clerk defaults for now)
- ✅ Implement multi-step flow (via Clerk)
**Implementation:**
- ✅ Created SignUpPage component at pages/SignUp.tsx
- ✅ Added PM Tools branding to match sign-in
- ✅ Configured redirect to onboarding after sign-up

### TICKET-024: Create user profile page ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Display user information
- ✅ Add edit capabilities
- ✅ Include avatar upload
- ⏳ Show workspace details (deferred to workspace implementation)
**Technical Details:**
- ✅ Used Clerk's UserProfile component for comprehensive functionality
- ✅ Created Profile page with back navigation to dashboard
- ✅ Added /profile route with ProtectedRoute wrapper
- ✅ Integrated with UserButton for seamless navigation
- ✅ Added profile link in Dashboard quick actions
**Additional Work Completed:**
- ✅ Created LoadingSpinner component for consistent loading states
- ✅ Created Card component for UI consistency
- ✅ Created Tabs component (using Radix UI) for future settings organization
- ✅ Configured UserButton to navigate to /profile instead of modal
- ✅ Styled UserProfile to match application design

### TICKET-025: Implement workspace/organization support ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create workspace model
- ✅ Add workspace switching
- ✅ Implement invitations
- ✅ Add role management
**Technical Details:**
- ✅ Created workspace types and schemas
- ✅ Create workspace context
- ✅ Add workspace API endpoints
**Implementation Highlights:**
- Created comprehensive workspace types with plans and quotas
- Built WorkspaceProvider context for state management
- Implemented mock API endpoints ready for database integration
- Added WorkspaceSelector component with switching functionality
- Integrated workspace creation into onboarding flow

### TICKET-026: Create dashboard layout component ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Build responsive layout
- ✅ Add navigation sidebar
- ✅ Include header with user menu
- ✅ Support mobile view
**Technical Details:**
- ✅ Created DashboardLayout component with sidebar and main content area
- ✅ Implemented responsive mobile menu with slide-out sidebar
- ✅ Added navigation items for all main sections
- ✅ Integrated with React Router nested routes
**Implementation Highlights:**
- Built responsive sidebar with mobile hamburger menu
- Created navigation with icons and descriptions
- Implemented active route highlighting
- Added proper layout structure with header and content areas
- Separated public and dashboard headers for proper layout

### TICKET-027: Setup React Router with protected routes ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Configure React Router v6
- ✅ Add route definitions
- ✅ Implement route guards
- ⏳ Add breadcrumbs (deferred)
**Technical Details:**
- ✅ Create routes configuration
- ⏳ Add lazy loading (deferred for optimization phase)
- ⏳ Implement route transitions (deferred)
**Additional Work Completed:**
- ✅ Installed react-router-dom v7
- ✅ Created BrowserRouter structure in App.tsx
- ✅ Defined public routes (/, /sign-in, /sign-up)
- ✅ Defined protected routes (/dashboard, /onboarding)
- ✅ Updated ProtectedRoute to use Navigate component
- ✅ Added catch-all redirect to home page

### TICKET-028: Create navigation component with auth state ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Build dynamic navigation
- ✅ Show/hide based on auth  
- ✅ Add active states
- ✅ Include mobile menu
**Technical Details:**
- ✅ Use Clerk hooks
- ✅ Add role-based items
- ✅ Implement responsive design
**Implementation:**
- ✅ Updated DashboardLayout with role-based navigation filtering
- ✅ Added useUser hook for accessing user roles and permissions
- ✅ Added admin and team management navigation items
- ✅ Display user role badge in sidebar

### TICKET-029: Implement user settings page ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Create settings layout
- ✅ Add notification preferences
- ✅ Include API key management
- ✅ Add theme selection
**Technical Details:**
- ✅ Create tabbed interface
- ✅ Add form validation
- ✅ Implement auto-save
**Implementation:**
- ✅ Created Settings page with 4 tabs (General, Notifications, API Keys, Appearance)
- ✅ Built UI components: Input, Label, Switch, Select
- ✅ Created individual settings components:
  - GeneralSettings: Name and email management
  - NotificationSettings: Email and in-app preferences
  - ApiKeySettings: Create, view, and delete API keys
  - AppearanceSettings: Theme selection (light/dark/system)
- ✅ Added settings types and validation schemas in shared package
- ✅ Integrated with Clerk for user profile updates

### TICKET-030: Create API middleware for auth validation ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Verify Clerk JWT tokens
- ✅ Extract user context
- ✅ Add to request object
- ✅ Handle errors
**Technical Details:**
- ✅ Implemented authMiddleware and optionalAuthMiddleware
- ✅ Uses Clerk's authenticateRequest method
- ✅ Proper error handling with HTTPException
**Implementation:**
- ✅ Already fully implemented in server/src/middleware/auth.ts
- ✅ Added auth utility functions (getUser, requireUser, isAuthenticated)
- ✅ Created API endpoints for user settings with auth protection
- ✅ Settings router with full CRUD operations:
  - GET /api/user/settings - Get user settings
  - PUT /api/user/settings/general - Update general settings
  - PUT /api/user/settings/notifications - Update notifications
  - POST /api/user/settings/api-keys - Create API key
  - DELETE /api/user/settings/api-keys/:id - Delete API key
  - PUT /api/user/settings/theme - Update theme

### TICKET-031: Setup CORS with Clerk domains
**Acceptance Criteria:**
- Configure CORS properly
- Allow Clerk domains
- Add environment-based config
- Include preflight handling
**Technical Details:**
- Update Hono CORS config
- Add dynamic origin validation
- Include credentials support

### TICKET-032: Create user onboarding flow ✅ COMPLETED
**Acceptance Criteria:**
- ✅ Build welcome screens
- ✅ Collect user preferences
- ⏳ Create first hypothesis (deferred to hypothesis builder implementation)
- ✅ Add progress tracking
**Technical Details:**
- ✅ Create multi-step wizard
- ⏳ Add skip options (deferred for UX refinement)
- ⏳ Store completion state (needs backend integration)
**Implementation:**
- ✅ Created Onboarding component at pages/Onboarding.tsx
- ✅ Implemented 3-step flow (role, experience, goals)
- ✅ Added progress indicators
- ✅ Collected user preferences in local state
- ✅ Added navigation between steps

### TICKET-033: Implement role-based access control
**Acceptance Criteria:**
- Define permission system
- Create role middleware
- Add UI conditionals
- Include admin panel
**Technical Details:**
- Create RBAC utilities
- Add permission checks
- Implement role hierarchy

### TICKET-034: Create team invitation system
**Acceptance Criteria:**
- Build invitation UI
- Send invitation emails
- Handle acceptance flow
- Add invitation management
**Technical Details:**
- Use Clerk invitations
- Add custom metadata
- Create invitation list

### TICKET-035: Setup webhook handlers for Clerk events
**Acceptance Criteria:**
- Configure webhook endpoint
- Handle user events
- Sync with database
- Add error handling
**Technical Details:**
- Verify webhook signatures
- Process user.created events
- Handle organization events

## Phase 3: Hypothesis Builder UI (30 tickets)

### TICKET-036: Create hypothesis builder layout
**Acceptance Criteria:**
- Design main container
- Add step navigation
- Include progress bar
- Support mobile layout
**Technical Details:**
- Create HypothesisBuilder component
- Use CSS Grid for layout
- Add responsive breakpoints

### TICKET-037: Implement step 1: "What change?" form
**Acceptance Criteria:**
- Create text input field
- Add character counter
- Include examples
- Add validation
**Technical Details:**
```typescript
// client/src/components/hypothesis/steps/StepOne.tsx
export function StepOne({ value, onChange }: StepProps) {
  return (
    <div>
      <h2>What change do you want to test?</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your change..."
        maxLength={500}
      />
      <Examples items={changeExamples} />
    </div>
  );
}
```

### TICKET-038: Implement step 2: "Target audience" form
**Acceptance Criteria:**
- Add preset options
- Include custom input
- Support multiple selection
- Add audience size estimate
**Technical Details:**
- Create checkbox group
- Add "Other" option
- Include tooltips

### TICKET-039: Implement step 3: "Why will it work?" form
**Acceptance Criteria:**
- Create reasoning input
- Add evidence fields
- Include research links
- Support rich text
**Technical Details:**
- Use markdown editor
- Add link validation
- Include preview mode

### TICKET-040: Implement step 4: "Expected impact" form
**Acceptance Criteria:**
- Add metric selection
- Include lift calculator
- Show baseline input
- Add confidence selector
**Technical Details:**
- Create metric dropdown
- Add percentage input
- Include visual feedback

### TICKET-041: Implement step 5: "Success metrics" form
**Acceptance Criteria:**
- List primary metrics
- Add secondary metrics
- Include guardrail metrics
- Support custom metrics
**Technical Details:**
- Create metric builder
- Add metric categories
- Include definitions

### TICKET-042: Create progress indicator component
**Acceptance Criteria:**
- Show current step
- Display completion
- Add step labels
- Support navigation
**Technical Details:**
```typescript
// client/src/components/hypothesis/ProgressIndicator.tsx
export function ProgressIndicator({ currentStep, totalSteps, onStepClick }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <Step
          key={i}
          number={i + 1}
          active={i + 1 === currentStep}
          completed={i + 1 < currentStep}
          onClick={() => onStepClick(i + 1)}
        />
      ))}
    </div>
  );
}
```

### TICKET-043: Implement form navigation logic
**Acceptance Criteria:**
- Add next/previous buttons
- Implement validation gates
- Support keyboard navigation
- Add quick jump menu
**Technical Details:**
- Create navigation hooks
- Add transition animations
- Implement focus management

### TICKET-044: Create form validation for each step
**Acceptance Criteria:**
- Define validation rules
- Show inline errors
- Prevent progression
- Add success feedback
**Technical Details:**
- Use zod schemas
- Create validation hook
- Add error messages

### TICKET-045: Implement draft auto-save functionality
**Acceptance Criteria:**
- Save on change
- Add debouncing
- Show save status
- Support offline mode
**Technical Details:**
- Use localStorage backup
- Add sync indicators
- Implement conflict resolution

### TICKET-046: Create hypothesis preview component
**Acceptance Criteria:**
- Show assembled hypothesis
- Use framework format
- Add edit shortcuts
- Include score preview
**Technical Details:**
- Create preview modal
- Add section highlighting
- Include copy button

### TICKET-047: Build hypothesis assembly logic
**Acceptance Criteria:**
- Combine all inputs
- Format using framework
- Validate completeness
- Generate summary
**Technical Details:**
```typescript
// client/src/utils/hypothesis.ts
export function assembleHypothesis(data: HypothesisData): string {
  return `We believe that ${data.intervention} for ${data.audience} 
          will result in ${data.outcome} because ${data.reasoning}. 
          We'll know this works when ${data.metrics.join(', ')}`;
}
```

### TICKET-048: Create "We Believe That" framework display
**Acceptance Criteria:**
- Show framework structure
- Highlight user inputs
- Add visual design
- Support print view
**Technical Details:**
- Create styled component
- Add syntax highlighting
- Include export options

### TICKET-049: Implement form error handling
**Acceptance Criteria:**
- Catch API errors
- Show user messages
- Add retry logic
- Log errors
**Technical Details:**
- Create error boundary
- Add toast notifications
- Implement fallbacks

### TICKET-050: Create loading states for each step
**Acceptance Criteria:**
- Add skeleton screens
- Show progress indicators
- Include cancel option
- Add timeout handling
**Technical Details:**
- Create loading components
- Add shimmer effects
- Implement abort controllers

### TICKET-051: Build responsive design for mobile
**Acceptance Criteria:**
- Optimize for touch
- Adjust layouts
- Simplify navigation
- Test on devices
**Technical Details:**
- Use container queries
- Add touch gestures
- Optimize form inputs

### TICKET-052: Create keyboard navigation support
**Acceptance Criteria:**
- Add tab order
- Support arrow keys
- Include shortcuts
- Show focus indicators
**Technical Details:**
- Implement key handlers
- Add ARIA labels
- Create help modal

### TICKET-053: Implement form field tooltips
**Acceptance Criteria:**
- Add help icons
- Show on hover/focus
- Include examples
- Support mobile
**Technical Details:**
- Use Radix UI Tooltip
- Add delay timing
- Include animations

### TICKET-054: Create example suggestions component
**Acceptance Criteria:**
- Show relevant examples
- Allow insertion
- Categorize by type
- Add search
**Technical Details:**
- Create example database
- Add filtering logic
- Implement insertion

### TICKET-055: Build metric selection component
**Acceptance Criteria:**
- List common metrics
- Group by category
- Show descriptions
- Add icons
**Technical Details:**
- Create metric registry
- Add autocomplete
- Include definitions

### TICKET-056: Create custom metric input
**Acceptance Criteria:**
- Add metric builder
- Include unit selection
- Support calculations
- Add validation
**Technical Details:**
- Create formula editor
- Add unit converter
- Validate expressions

### TICKET-057: Implement form reset functionality
**Acceptance Criteria:**
- Add reset button
- Confirm action
- Clear all fields
- Reset to defaults
**Technical Details:**
- Create confirmation dialog
- Clear storage
- Reset validation

### TICKET-058: Create confirmation dialogs
**Acceptance Criteria:**
- Build dialog component
- Add action buttons
- Include warnings
- Support keyboard
**Technical Details:**
- Use Radix UI Dialog
- Add animations
- Implement focus trap

### TICKET-059: Build form completion animation
**Acceptance Criteria:**
- Create success animation
- Show completion message
- Add confetti effect
- Include next steps
**Technical Details:**
- Use Framer Motion
- Add particle effects
- Create transition

### TICKET-060: Create success state UI
**Acceptance Criteria:**
- Show score summary
- Display next actions
- Include sharing options
- Add celebration
**Technical Details:**
- Create success page
- Add action cards
- Include metrics

### TICKET-061: Implement print-friendly view
**Acceptance Criteria:**
- Create print stylesheet
- Format for A4/Letter
- Include all content
- Add page breaks
**Technical Details:**
- Use CSS @media print
- Hide navigation
- Optimize layout

### TICKET-062: Create share hypothesis feature
**Acceptance Criteria:**
- Generate share links
- Add access control
- Include preview
- Track shares
**Technical Details:**
- Create short URLs
- Add permissions
- Include analytics

### TICKET-063: Build hypothesis history view
**Acceptance Criteria:**
- List past hypotheses
- Show versions
- Add filters
- Include search
**Technical Details:**
- Create list component
- Add pagination
- Include sorting

### TICKET-064: Create hypothesis comparison tool
**Acceptance Criteria:**
- Select hypotheses
- Show differences
- Highlight changes
- Export comparison
**Technical Details:**
- Create diff view
- Add side-by-side
- Include metrics

### TICKET-065: Implement hypothesis templates
**Acceptance Criteria:**
- Create template library
- Allow customization
- Add categories
- Include preview
**Technical Details:**
- Build template system
- Add variables
- Create editor

## Summary

This document covers the first 65 tickets of the Pre-Experiment Check Tool implementation, focusing on:

1. **Foundation & Infrastructure** - Setting up the core technical stack, database schemas, and shared utilities
2. **Authentication & Routing** - Implementing Clerk auth, protected routes, and user management
3. **Hypothesis Builder UI** - Creating the conversational form interface with all 5 steps

Each ticket is designed to be completed in 4-8 hours (1 story point) with clear acceptance criteria and technical implementation details.