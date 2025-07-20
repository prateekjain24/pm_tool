import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import { z } from "zod";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { loggingMiddleware, performanceMiddleware } from "./middleware/logger";
import { responseFormatter } from "./middleware/responseFormatter";
import { authMiddleware, optionalAuthMiddleware } from "./middleware/auth";
import { validateBody, validateQuery, getValidated } from "./middleware/validation";

// Import utilities
import { apiSuccess, apiPaginated, parsePaginationParams } from "./utils/apiResponse";
import { getUser, requireUser } from "./utils/auth";
import { logger } from "./utils/logger";

// Import routes
import { workspaceRouter } from "./routes/workspaces";

// Import config and database
import { env } from "./config/env";
import { dbHealthCheck, getDbMetrics } from "./db";
import { initSentry } from "./config/sentry";
import { initializeFileLogging, closeFileLogger } from "./utils/logRotation";

// Initialize Sentry before anything else
initSentry();

// Initialize file logging for production
initializeFileLogging();

const app = new Hono();

/**
 * Global middleware - Order matters!
 */

// 1. Security headers
app.use(secureHeaders());

// 2. CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposeHeaders: ["X-Request-ID", "X-Response-Time"],
  }),
);

// 3. Compression
app.use(compress());

// 4. Request timing
app.use(timing());

// 5. Logging middleware
app.use(loggingMiddleware);
app.use(performanceMiddleware);

// 6. Error handler (wraps all routes)
app.use(errorHandler);

// 7. Response formatter (for successful responses)
app.use(responseFormatter);

/**
 * Public routes
 */
app.get("/", (c) => {
  return c.text("PM Tools API - Ready!");
});

// Health check endpoint
app.get("/health", async (c) => {
  const dbHealth = await dbHealthCheck();
  const dbMetrics = getDbMetrics();

  const health = {
    status: dbHealth.connected ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    service: "pm-tools-api",
    version: "1.0.0",
    environment: env.NODE_ENV,
    database: {
      connected: dbHealth.connected,
      responseTime: dbHealth.responseTime,
      error: dbHealth.error,
      metrics: {
        totalConnections: dbMetrics.totalConnections,
        activeConnections: dbMetrics.activeConnections,
        idleConnections: dbMetrics.idleConnections,
        connectionErrors: dbMetrics.connectionErrors,
      },
    },
  };

  return c.json(health, { status: dbHealth.connected ? 200 : 503 });
});

// Example endpoint with automatic response formatting
app.get("/hello", async (c) => {
  // This will be automatically formatted as ApiSuccessResponse
  return c.json({
    message: "Hello PM Tools!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */

// Mount workspace routes
app.route("/api/workspaces", workspaceRouter);

// Status endpoint - works with or without authentication
app.get("/api/status", optionalAuthMiddleware, async (c) => {
  const user = getUser(c);

  return apiSuccess(c, {
    authenticated: !!user,
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        }
      : null,
  });
});

// User profile - protected route
app.get("/api/user/profile", authMiddleware, async (c) => {
  const user = requireUser(c);

  return apiSuccess(c, {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

// Example validation schemas
const createHypothesisSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  metric: z.string().min(1),
  expectedImpact: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
});

const hypothesisQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "confidence", "expectedImpact"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Create hypothesis - with validation
app.post(
  "/api/hypothesis",
  authMiddleware,
  validateBody(createHypothesisSchema),
  async (c) => {
    const user = requireUser(c);
    const data = getValidated<z.infer<typeof createHypothesisSchema>>(c, "json");

    // TODO: Implement hypothesis creation logic
    logger.info({ userId: user.id, hypothesis: data }, "Creating new hypothesis");

    return apiSuccess(
      c,
      {
        id: "hyp_" + Date.now(),
        ...data,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }
);

// List hypotheses - with pagination
app.get(
  "/api/hypotheses",
  authMiddleware,
  validateQuery(hypothesisQuerySchema),
  async (c) => {
    const user = requireUser(c);
    const pagination = parsePaginationParams(c);

    // TODO: Implement hypothesis listing logic
    const mockData = Array.from({ length: 5 }, (_, i) => ({
      id: `hyp_${i + 1}`,
      title: `Hypothesis ${i + 1}`,
      description: `Description for hypothesis ${i + 1}`,
      metric: "conversion_rate",
      expectedImpact: 10 + i * 5,
      confidence: 70 + i * 2,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return apiPaginated(c, mockData, {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems: 50, // Mock total
    });
  }
);

/**
 * 404 handler
 */
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route ${c.req.method} ${c.req.path} not found`,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
});

/**
 * Graceful shutdown handling
 */
const gracefulShutdown = async () => {
  logger.info("Received shutdown signal, closing connections...");

  try {
    // Close database connection
    const { disconnectDb } = await import("./db");
    await disconnectDb();
    
    // Close file logger
    await closeFileLogger();
    
    logger.info("All connections closed successfully");
    process.exit(0);
  } catch (error) {
    logger.error(error, "Error during shutdown");
    process.exit(1);
  }
};

// Register shutdown handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Log startup
logger.info(
  {
    port: env.PORT,
    environment: env.NODE_ENV,
    clientUrl: env.CLIENT_URL,
  },
  "PM Tools API starting..."
);

export default {
  port: env.PORT,
  fetch: app.fetch,
};