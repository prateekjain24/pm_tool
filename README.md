# BHVR App 🦫

A full-stack TypeScript monorepo built with Bun, Hono, Vite, React, and shadcn/ui - ready for Railway deployment.

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Shared Types**: Common type definitions shared between client and server
- **Monorepo Structure**: Organized as a workspaces-based monorepo
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime
  - [Hono](https://hono.dev) as the backend framework
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [shadcn/ui](https://ui.shadcn.com) for UI components
- **Railway Ready**: Pre-configured for seamless Railway deployment

## Project Structure

```
.
├── client/               # React frontend with shadcn/ui
├── server/               # Hono backend API
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by both client and server
└── package.json          # Root package.json with workspaces
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine
- [Git](https://git-scm.com) for version control
- [Railway CLI](https://docs.railway.app/reference/cli) (optional, for deployment)

### Development

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` files to `.env` in both `client/` and `server/` directories
   - Update the values as needed

3. **Run the development servers:**
   ```bash
   # Run everything (shared types, server, and client)
   bun run dev

   # Or run individual parts
   bun run dev:shared  # Watch and compile shared types
   bun run dev:server  # Run the Hono backend (port 3000)
   bun run dev:client  # Run the Vite dev server (port 5173)
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Building

```bash
# Build everything
bun run build

# Or build individual parts
bun run build:shared  # Build the shared types package
bun run build:server  # Build the server
bun run build:client  # Build the React frontend
```

## Railway Deployment

This project is pre-configured for Railway deployment.

### Automatic Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway will automatically detect the configuration and deploy

### Manual Deployment with Railway CLI

1. **Install Railway CLI:**
   ```bash
   bun install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize and deploy:**
   ```bash
   railway init
   railway up
   ```

### Environment Variables on Railway

Set these environment variables in your Railway project:

**Required:**
- `PORT` - Automatically set by Railway
- `NODE_ENV` - Set to `production`

**Optional (add as needed):**
- `DATABASE_URL` - Your database connection string
- `REDIS_URL` - Your Redis connection string
- Any other API keys or secrets

### Railway Configuration

The project includes Railway-specific configurations:

- **Server Export**: The server exports a Railway-compatible format in `server/src/index.ts`
- **Build Script**: `railway-build` script in root `package.json`
- **Start Script**: `start` script configured to run the server

## API Endpoints

- `GET /` - Health check, returns "Hello Hono!"
- `GET /hello` - Example API endpoint, returns JSON response

## Adding Features

### Adding a new API endpoint

1. Edit `server/src/index.ts`
2. Add your route handler
3. Use shared types from `shared/types`

### Adding UI components

1. Use shadcn/ui CLI:
   ```bash
   cd client
   bunx shadcn-ui@latest add button
   ```

2. Import and use in your React components

### Adding shared types

1. Create/edit files in `shared/src/types/`
2. Export from `shared/src/index.ts`
3. Run `bun run build:shared`
4. Import in client or server: `import { YourType } from 'shared'`

## Scripts Reference

**Root package.json:**
- `dev` - Run all development servers
- `build` - Build all packages
- `start` - Start the production server (Railway)
- `railway-build` - Railway build command

**Client package.json:**
- `dev` - Start Vite dev server
- `build` - Build the React app
- `preview` - Preview production build

**Server package.json:**
- `dev` - Start Hono dev server with hot reload
- `build` - Build the server (if needed)

## Troubleshooting

### Port conflicts
If port 3000 or 5173 are in use, you can change them:
- Server: Update `PORT` in `server/.env`
- Client: Update Vite config in `client/vite.config.ts`

### Type errors
Run `bun run build:shared` to ensure shared types are compiled.

### Railway deployment issues
- Ensure all environment variables are set in Railway dashboard
- Check Railway logs: `railway logs`
- Verify build command runs successfully locally: `bun run railway-build`

## Learn More

- [BHVR Documentation](https://github.com/stevedylandev/bhvr)
- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Railway Documentation](https://docs.railway.app)

## License

MIT