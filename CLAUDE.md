# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PM Tool Suite - An AI-powered toolkit for Product Managers to enforce scientific rigor in experimentation through hypothesis validation, pre-test checks, and documentation generation.

**Tech Stack**: BHVR (Bun + Hono + Vite + React) monorepo with TypeScript

## Common Development Commands

```bash
# Initial setup
bun install

# Development (runs all workspaces)
bun run dev

# Individual workspace development
bun run dev:client   # Frontend only (Vite + React)
bun run dev:server   # Backend only (Hono API)
bun run dev:shared   # Shared types only

# Building
bun run build        # Build all workspaces
bun run start        # Start production server

# Code quality
cd client && bun run lint

# Deployment
bun run railway-build
```

## Architecture Overview

### Monorepo Structure
- **client/**: React frontend with Vite, Tailwind CSS v4, and shadcn/ui components
- **server/**: Hono backend API with type-safe endpoints
- **shared/**: Shared TypeScript types ensuring full-stack type safety

### Key Technical Patterns
1. **Type-Safe API**: All API responses use shared types from `@shared/types`
2. **Path Aliases**: Use `@client`, `@server`, `@shared` for clean imports
3. **Build Order**: shared → server → client (automatic with `bun run build`)
4. **Hot Reload**: All workspaces support hot module replacement in development

### API Structure
Server runs on port 3000 by default. Current endpoints:
- `GET /` - Health check
- `GET /hello` - Example typed endpoint

Client connects to `http://localhost:3000` in development.

## Project Features (To Be Implemented)

1. **Hypothesis Builder**: AI-powered hypothesis creation with quality scoring
2. **Pre-Test Validator**: Automated experiment design validation
3. **Sample Size Calculator**: Interactive statistical planning tools
4. **Timeline Predictor**: Calendar-based experiment duration planning
5. **Documentation Generator**: Auto-formatted PRDs and test plans

## Development Guidelines

### Adding New Features
1. Define types in `shared/src/types/`
2. Implement API endpoints in `server/src/index.ts`
3. Create UI components in `client/src/components/`
4. Use shadcn/ui components when possible (already configured)

### Working with the Stack
- **Bun**: JavaScript runtime and package manager
- **Hono**: Lightweight, fast web framework for APIs
- **Vite**: Frontend tooling with HMR and optimized builds
- **React 19**: Latest React with improved performance
- **Tailwind CSS v4**: Utility-first CSS with Vite plugin
- **TypeScript**: Strict mode enabled across all workspaces

### Planned Integrations
- PostgreSQL for data persistence
- Redis for caching
- OpenAI/Claude/Gemini for AI features
- Lucia Auth for authentication
- WebSockets for real-time collaboration

## Key Project Goals
- Reduce experiment planning time from 2 hours to 8 minutes
- Increase experiment success rate by 25%
- Build PM expertise through AI-powered coaching
- Support 80% of top PM use cases out-of-the-box

## AI Capabilities

### Available MCPs (Model Coordination Primitives)
- Sequential thinking for complex reasoning and multi-step problem solving
- Playwright for automated testing and browser interaction
- Context7 for advanced documentation generation
- Replicate for AI image generation

## Frontend Design Guidelines
- Use minimalistic aesthetics for frontend and use Shadcn as much as possible

## Websearch Guidelines
- When doing websearch use latest vs year. current year is 2025.