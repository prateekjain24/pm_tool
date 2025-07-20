# Code Map: PM Tool Suite

## Overview

PM Tool Suite is an AI-powered toolkit for Product Managers designed to enforce scientific rigor in experimentation through hypothesis validation, pre-test checks, and documentation generation. Built with Bun + Hono + Vite + React, it aims to reduce experiment planning time from 2 hours to 8 minutes while increasing experiment success rates by 25%.

**Key Business Goals:**
- Reduce A/B test failure rate (currently 30-40% due to poor hypothesis formulation)
- Save 2-3 sprints wasted on flawed experiments
- Improve product decision quality through proper statistical analysis
- Increase documentation consistency and quality by 20-30%

## Technology Stack

- **Languages**: TypeScript (100%), JavaScript
- **Runtime**: Bun v1.x (JavaScript runtime and package manager)
- **Frameworks**: 
  - Backend: Hono 4.7 (lightweight web framework)
  - Frontend: React 19 + Vite 6.3
- **Key Libraries**:
  - UI: Tailwind CSS v4, shadcn/ui, Magic UI components
  - Database: Drizzle ORM 0.44, PostgreSQL
  - Auth: Clerk (OAuth integration)
  - Routing: React Router v7
  - Animations: Motion, custom animation components
- **Build Tools**: 
  - Vite (frontend bundling)
  - TypeScript compiler
  - Biome (linting & formatting)
- **Testing**: Currently no testing framework configured

## Project Structure

```
pm-tools/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Router configuration
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── sections/     # Landing page sections
│   │   │   └── ui/           # UI primitives (shadcn + custom)
│   │   ├── pages/            # Route pages
│   │   ├── config/           # Configuration files
│   │   └── lib/              # Utilities
│   ├── public/               # Static assets
│   └── vite.config.ts        # Vite configuration
│
├── server/                   # Hono backend API
│   ├── src/
│   │   ├── index.ts         # Main server entry & routes
│   │   ├── config/          # Environment configuration
│   │   ├── db/              # Database layer
│   │   │   ├── schema/      # Drizzle ORM schemas
│   │   │   ├── connection.ts
│   │   │   └── migrations/
│   │   ├── middleware/      # Express-style middleware
│   │   └── utils/           # Utility functions
│   ├── drizzle/             # Database migrations
│   └── drizzle.config.ts    # Drizzle configuration
│
├── shared/                  # Shared types & schemas
│   └── src/
│       ├── types/           # TypeScript interfaces
│       ├── schemas/         # Zod validation schemas
│       └── config/          # Shared configuration
│
├── docs/                    # Documentation
├── md/                      # Project documentation
└── logs/                    # Application logs
```

## Core Components

### Server Components

#### Main API Entry (server/src/index.ts)
- **Location**: `server/src/index.ts`
- **Purpose**: Hono server setup with CORS, routing, and graceful shutdown
- **Key Functions**:
  - `app.get("/")`: Health check endpoint
  - `app.get("/health")`: Detailed health status with DB metrics
  - `app.get("/api/status")`: Authentication status check
  - `app.get("/api/user/profile")`: Protected user profile endpoint
  - `app.post("/api/hypothesis")`: Hypothesis creation (stub)
- **Dependencies**: Hono, cors, auth middleware, database connections

#### Authentication Middleware (server/src/middleware/auth.ts)
- **Location**: `server/src/middleware/auth.ts`
- **Purpose**: Clerk JWT token verification and user context
- **Key Functions**:
  - `authMiddleware()`: Enforces authentication
  - `optionalAuthMiddleware()`: Adds user context if authenticated
- **Auth Flow**: Bearer token → Clerk verification → User context

#### Database Schema (server/src/db/schema/)
- **Core Tables**:
  - `users`: User accounts with workspace association
  - `workspaces`: Multi-tenant workspace support
  - `hypotheses`: "We Believe That" framework implementation
  - `experiments`: A/B test tracking
  - `hypothesisScores`: AI-powered quality scoring
  - `documents`: PRDs and test plans
  - `documentVersions`: Version control for documents
- **Relationships**: Full relational integrity with cascading deletes

### Client Components

#### App Router (client/src/App.tsx)
- **Location**: `client/src/App.tsx`
- **Purpose**: Route configuration with protected/public routes
- **Routes**:
  - `/`: Landing page (public)
  - `/sign-in`, `/sign-up`: Authentication pages
  - `/dashboard`: Main app (protected)
  - `/onboarding`: New user flow (protected)

#### Landing Page Sections
- **Hero**: Value proposition and CTA
- **Metrics**: Key performance indicators
- **Features**: Product capabilities showcase
- **CTA**: Sign-up call-to-action

#### UI Component Library
- **Base**: Button, Logo, shadcn/ui primitives
- **Animations**: 
  - AnimatedGradientText
  - BorderBeam
  - NumberTicker
  - Particles
  - ShimmerButton
- **Patterns**: MagicCard, AnimatedGridPattern

### Shared Types & Schemas

#### Type Definitions (shared/src/types/)
- `ApiResponse`: Legacy response format
- `auth.ts`: Authentication types
- `hypothesis.ts`: Hypothesis data structures
- `experiment.ts`: Experiment configurations
- `document.ts`: Document types
- `utils.ts`: Utility type helpers

#### Zod Schemas (shared/src/schemas/)
- Runtime validation for API payloads
- Form validation schemas
- Database model validation

## Architecture Patterns

### Monorepo Structure
- **Workspace Management**: Bun workspaces with interdependencies
- **Build Order**: shared → server → client
- **Type Safety**: Full-stack type sharing via TypeScript paths
- **Path Aliases**: 
  - `@client/*` → client/src/*
  - `@server/*` → server/src/*
  - `@shared/*` → shared/src/*

### API Design
- **RESTful Endpoints**: Standard HTTP verbs
- **Authentication**: Bearer token with Clerk JWT
- **Response Format**: Consistent JSON structure
- **Error Handling**: HTTPException with status codes

### Database Architecture
- **ORM**: Drizzle with PostgreSQL
- **Migrations**: Version-controlled SQL migrations
- **Relationships**: Properly defined foreign keys
- **Soft Deletes**: Not implemented (uses cascading deletes)

## Data Flow

### Authentication Flow
```
1. User signs in via Clerk (OAuth)
2. Clerk provides JWT token
3. Frontend stores token
4. API requests include Bearer token
5. Middleware validates with Clerk
6. User context added to request
7. Protected endpoints accessible
```

### Hypothesis Creation Flow
```
1. User fills hypothesis form
2. Frontend validates with Zod schema
3. POST to /api/hypothesis with auth
4. Server validates and enriches data
5. AI scoring service called
6. Database transaction:
   - Create hypothesis record
   - Create initial score record
7. Return enriched hypothesis to client
```

## Entry Points

- **Main Server**: `server/src/index.ts` (Bun runtime)
- **Client Dev**: `client/src/main.tsx` (Vite dev server)
- **Database Migrations**: `server/src/db/migrate.ts`
- **Database Seed**: `server/src/db/seed.ts`

## External Dependencies

### Authentication (Clerk)
- OAuth providers configuration
- JWT token management
- User profile synchronization

### AI Services (Planned)
- OpenAI API: Content generation
- Anthropic API: Analysis and scoring
- Google AI: Alternative LLM support

### Infrastructure
- PostgreSQL: Primary data store
- Redis: Caching layer (configured but not implemented)
- Railway: Deployment platform

## Testing Strategy

**Current State**: No testing framework configured

**Recommended Approach**:
- Unit tests: Vitest for both client and server
- Integration tests: Supertest for API endpoints
- E2E tests: Playwright for critical user flows
- Database tests: Isolated test database

## Development Notes

### Setup Instructions
```bash
# Install dependencies
bun install

# Environment setup
cp .env.example .env
# Configure: DATABASE_URL, CLERK keys, AI keys

# Database setup
bun run db:migrate
bun run db:seed

# Development
bun run dev
```

### Common Tasks
- **Add new API endpoint**: Update server/src/index.ts
- **Add database table**: Create schema in server/src/db/schema/
- **Add UI component**: Use shadcn/ui CLI or create in client/src/components/ui/
- **Type updates**: Modify shared/src/types/ for full-stack safety

### Code Quality
- **Formatting**: `bun run format` (Biome)
- **Linting**: `bun run lint` (Biome)
- **Type Check**: `bun run build` (TypeScript)

### Gotchas
- Bun workspace dependencies use `workspace:*` syntax
- Tailwind CSS v4 uses Vite plugin (not PostCSS)
- Clerk tokens must be passed as Bearer tokens
- Database migrations must be run in order
- Hot reload works across all workspaces

## Areas for Improvement

### Technical Debt
1. **No Testing Infrastructure**: Critical for PM tool reliability
2. **Incomplete API Implementation**: Most endpoints are stubs
3. **Missing Error Boundaries**: Frontend error handling needed
4. **No API Documentation**: OpenAPI/Swagger spec would help
5. **Limited Logging**: Only basic console logging present

### Missing Features (from PRD)
1. **Hypothesis Builder**: Core feature not implemented
2. **Pre-Test Validator**: No validation engine
3. **Post-Test Analyzer**: Statistical analysis missing
4. **Document Generator**: AI integration pending
5. **Real-time Collaboration**: WebSocket support needed

### Performance Optimizations
1. **Database Indexing**: Only basic indexes defined
2. **Query Optimization**: N+1 queries possible
3. **Caching Layer**: Redis configured but unused
4. **Bundle Splitting**: Frontend could be optimized
5. **Image Optimization**: No lazy loading implemented

### Security Enhancements
1. **Rate Limiting**: Not implemented
2. **Input Sanitization**: Basic Zod validation only
3. **CORS Configuration**: Currently permissive
4. **API Versioning**: No version strategy
5. **Audit Logging**: No user action tracking

### Developer Experience
1. **API Client Generation**: Could auto-generate from types
2. **Storybook**: Component documentation missing
3. **Developer Portal**: No API playground
4. **Monitoring**: No APM or error tracking
5. **CI/CD Pipeline**: No automated testing/deployment