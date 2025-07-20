# Code Map: PM Tool Suite

## Overview

PM Tool Suite is an AI-powered toolkit designed for Product Managers to enforce scientific rigor in experimentation through hypothesis validation, pre-test checks, and documentation generation. The project aims to reduce experiment planning time from 2 hours to 8 minutes while increasing experiment success rates by 25%.

## Technology Stack

- **Languages**: TypeScript, JavaScript
- **Runtime**: Bun (v1.1.1)
- **Frontend**: React 19, Vite 6, Tailwind CSS v4, shadcn/ui
- **Backend**: Hono 4.6.14 (lightweight web framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Monorepo**: Bun workspaces
- **Code Quality**: Biome (linting & formatting)
- **Testing**: Planned (framework not yet implemented)
- **Deployment**: Railway-ready build configuration

## Project Structure

```
pm-tools/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── dashboard/# Dashboard UI
│   │   │   ├── layout/   # Layout components
│   │   │   ├── settings/ # Settings management
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── config/       # Frontend configuration
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and API client
│   │   ├── pages/        # Page components
│   │   ├── providers/    # React context providers
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── server/                # Hono backend API
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   │   ├── settings.ts
│   │   │   └── workspaces.ts
│   │   ├── index.ts      # Main server entry
│   │   └── db.ts         # Database connection
│   ├── drizzle/          # Database migrations
│   └── package.json      # Backend dependencies
│
├── shared/                # Shared types and utilities
│   ├── src/
│   │   ├── types/        # TypeScript type definitions
│   │   │   ├── api.ts
│   │   │   ├── settings.ts
│   │   │   └── workspaces.ts
│   │   └── schemas/      # Zod validation schemas
│   │       ├── database.ts
│   │       └── env.ts
│   └── package.json      # Shared dependencies
│
├── md/                    # Documentation
├── scripts/              # Build and utility scripts
├── bun.lockb            # Lock file
├── package.json         # Root monorepo configuration
├── tsconfig.json        # TypeScript configuration
├── drizzle.config.ts    # Drizzle ORM configuration
├── biome.json           # Code quality configuration
└── CLAUDE.md            # AI assistant instructions
```

## Core Components

### Frontend (Client)

#### App Component
- **Location**: `client/src/App.tsx`
- **Purpose**: Main application router and layout provider
- **Key Features**:
  - Route configuration with protected routes
  - Authentication state management
  - Layout persistence

#### API Client
- **Location**: `client/src/lib/api.ts`
- **Purpose**: Type-safe API client for backend communication
- **Key Functions**:
  - `apiClient<T>()`: Generic fetch wrapper with error handling
  - Automatic JSON parsing and type inference
  - Base URL configuration

#### Dashboard Layout
- **Location**: `client/src/components/layout/DashboardLayout.tsx`
- **Purpose**: Main application layout with navigation
- **Features**:
  - Responsive sidebar navigation
  - User profile integration
  - Route-based active state

#### Settings Management
- **Location**: `client/src/components/settings/`
- **Purpose**: User preferences and configuration
- **Components**:
  - `SettingsDialog`: Modal for settings access
  - `SettingsForm`: Form with tabs for different settings
  - `GeneralSettings`: General preferences management

### Backend (Server)

#### Main Server
- **Location**: `server/src/index.ts`
- **Purpose**: Hono server setup with middleware stack
- **Middleware Stack**:
  1. CORS configuration
  2. Logger middleware
  3. Clerk authentication
  4. Request timing
  5. Pretty JSON responses
  6. Compression
- **API Routes**:
  - `/api/settings/*` - User settings management
  - `/api/workspaces/*` - Workspace CRUD operations
  - `/api/health` - Database health check

#### Database Connection
- **Location**: `server/src/db.ts`
- **Purpose**: PostgreSQL connection with pooling
- **Features**:
  - Connection pooling (max 10 connections)
  - SSL configuration for production
  - Health check endpoint
  - Graceful shutdown handling

#### Settings Routes
- **Location**: `server/src/routes/settings.ts`
- **Purpose**: User settings persistence
- **Endpoints**:
  - `GET /` - Retrieve user settings
  - `PUT /` - Update user settings
- **Dependencies**: Clerk auth, database connection

#### Workspaces Routes
- **Location**: `server/src/routes/workspaces.ts`
- **Purpose**: Workspace management
- **Endpoints**:
  - `GET /` - List user workspaces
  - `POST /` - Create new workspace
  - `PUT /:id` - Update workspace
  - `DELETE /:id` - Delete workspace

### Shared Types

#### Database Schema
- **Location**: `shared/src/schemas/database.ts`
- **Purpose**: Drizzle ORM schema definitions
- **Tables**:
  - `users`: User profiles with Clerk integration
  - `settings`: User preferences (theme, language, etc.)
  - `workspaces`: Team/project workspaces

#### API Types
- **Location**: `shared/src/types/`
- **Purpose**: Type-safe API contracts
- **Key Types**:
  - `ApiResponse<T>`: Standard API response wrapper
  - `Settings`: User settings interface
  - `Workspace`: Workspace data structure

## Architecture Patterns

1. **Monorepo Architecture**
   - Shared types ensure full-stack type safety
   - Independent workspace builds
   - Centralized dependency management

2. **API-First Design**
   - RESTful endpoints with consistent structure
   - Type-safe client-server communication
   - Standardized error handling

3. **Component-Based UI**
   - Atomic design with shadcn/ui
   - Reusable component library
   - Consistent styling with Tailwind

4. **Authentication Flow**
   - Clerk integration for user management
   - Middleware-based auth checks
   - User context propagation

5. **Database Design**
   - User-centric data model
   - Foreign key relationships
   - Optimistic locking with timestamps

## Data Flow

1. **User Authentication**
   ```
   Client → Clerk → Server Middleware → Database → Response
   ```

2. **Settings Management**
   ```
   UI Form → API Client → Server Route → Database → UI Update
   ```

3. **Workspace Operations**
   ```
   Dashboard → API Request → Auth Check → CRUD Operation → State Update
   ```

## Entry Points

- **Frontend**: `client/src/main.tsx`
  - Initializes React app with providers
  - Sets up routing and Clerk authentication
  
- **Backend**: `server/src/index.ts`
  - Starts Hono server on port 3000
  - Configures middleware pipeline
  - Mounts API routes

- **Database**: Auto-connects on server start
  - Connection string from environment
  - Health check available at `/api/health`

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 19 with concurrent features
- **Styling**: Tailwind CSS v4 with Vite plugin
- **Components**: shadcn/ui (Radix UI based)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Authentication**: @clerk/clerk-react

### Backend Dependencies
- **Web Framework**: Hono (lightweight, fast)
- **Database**: PostgreSQL with @neondatabase/serverless
- **ORM**: Drizzle ORM
- **Validation**: Zod schemas
- **Authentication**: @clerk/backend
- **Environment**: dotenv for config

### Development Dependencies
- **Build Tool**: Vite for frontend
- **Type Checking**: TypeScript strict mode
- **Code Quality**: Biome for linting/formatting
- **Database Tooling**: drizzle-kit for migrations

## Testing Strategy

Currently, no testing framework is implemented. Planned testing approach includes:
- Unit tests for utility functions
- Integration tests for API endpoints
- Component testing for UI elements
- E2E tests for critical user flows

## Development Notes

### Setup Instructions
1. Install Bun runtime
2. Run `bun install` to install dependencies
3. Set up PostgreSQL database
4. Configure environment variables (see `.env.example`)
5. Run `bun run dev` to start all services

### Common Tasks
- **Start Development**: `bun run dev`
- **Build for Production**: `bun run build`
- **Run Linting**: `cd client && bun run lint`
- **Database Migrations**: `bun run db:generate && bun run db:migrate`
- **Deploy to Railway**: `bun run railway-build`

### Environment Variables
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `CLERK_PUBLISHABLE_KEY`: Clerk frontend key
- `CLERK_SECRET_KEY`: Clerk backend key
- `VITE_API_URL`: Backend API URL (defaults to http://localhost:3000)

### Gotchas
- Ensure Bun version 1.1.1+ for workspace support
- Database SSL is required in production
- CORS must be configured for frontend-backend communication
- Build order matters: shared → server → client

## Areas for Improvement

### Technical Debt
1. **Testing Infrastructure**: No tests implemented yet
2. **Error Handling**: Need comprehensive error boundaries
3. **Logging**: Production-ready logging system needed
4. **API Documentation**: OpenAPI/Swagger specs missing
5. **Type Safety**: Some `any` types in API client

### Missing Features
1. **Core PM Tools**: 
   - Hypothesis Builder
   - Pre-Test Validator
   - Sample Size Calculator
   - Timeline Predictor
   - Documentation Generator

2. **Infrastructure**:
   - Redis caching layer
   - WebSocket support for real-time features
   - File upload handling
   - Email notifications

3. **User Experience**:
   - Onboarding flow
   - Team collaboration features
   - Export functionality
   - Mobile responsiveness improvements

### Documentation Gaps
1. API endpoint documentation
2. Component storybook
3. Deployment guide
4. Contributing guidelines
5. Security best practices

### Performance Optimizations
1. Implement React.lazy for code splitting
2. Add service worker for offline support
3. Optimize bundle size with tree shaking
4. Implement database query optimization
5. Add response caching strategies

## Future Architecture Considerations

1. **Microservices**: Consider splitting AI features into separate services
2. **Event-Driven**: Implement event sourcing for audit trails
3. **Multi-Tenancy**: Design for enterprise team isolation
4. **API Gateway**: Add rate limiting and API key management
5. **Observability**: Integrate OpenTelemetry for monitoring

## Security Considerations

1. **Authentication**: Clerk handles auth, but need authorization rules
2. **Data Privacy**: Implement data encryption at rest
3. **API Security**: Add rate limiting and request validation
4. **Secrets Management**: Move to proper secret management service
5. **Audit Logging**: Track all data modifications

This code map provides a comprehensive overview of the PM Tool Suite architecture, making it easier for LLMs and developers to understand and work with the codebase effectively.