# Server Middleware Documentation

This directory contains all middleware for the PM Tools API server. The middleware provides comprehensive functionality for authentication, validation, logging, error handling, and response formatting.

## Middleware Overview

### 1. Error Handler (`errorHandler.ts`)
Catches all errors and formats them according to the `ApiErrorResponse` type.

**Features:**
- Global error catching
- Standardized error responses
- Different handling for HTTPException, ZodError, and generic errors
- Stack traces in development mode only
- Error logging with request IDs

**Usage:**
```typescript
app.use(errorHandler);

// Throw errors using helper functions
throw errors.notFound("Hypothesis");
throw errors.validationError("Invalid input", { fields: { title: ["Required"] } });
```

### 2. Logger Middleware (`logger.ts`)
Provides structured logging for all requests and responses.

**Features:**
- Request/response logging with timing
- Request ID generation and tracking
- Sensitive header sanitization
- Performance monitoring for slow requests
- Structured log format with levels

**Usage:**
```typescript
app.use(loggingMiddleware);
app.use(performanceMiddleware);
```

### 3. Validation Middleware (`validation.ts`)
Validates request data using Zod schemas.

**Features:**
- Validates body, query, params, headers, and form data
- Type-safe validation with Zod
- Stores validated data in context
- Integrates with error handler for validation errors

**Usage:**
```typescript
const schema = z.object({
  title: z.string().min(1).max(200),
  confidence: z.number().min(0).max(100),
});

app.post(
  "/api/hypothesis",
  validateBody(schema),
  async (c) => {
    const data = getValidated<z.infer<typeof schema>>(c, "json");
    // data is fully typed
  }
);
```

### 4. Response Formatter (`responseFormatter.ts`)
Ensures all successful responses follow the standardized format.

**Features:**
- Automatic formatting of successful responses
- Support for paginated responses
- Consistent metadata (timestamp, version)
- Helper functions for common response types

**Usage:**
```typescript
app.use(responseFormatter);

// Use helper functions
return apiSuccess(c, { message: "Success" });
return apiPaginated(c, items, { page: 1, pageSize: 20, totalItems: 100 });
```

### 5. Auth Middleware (`auth.ts`)
Handles authentication using Clerk JWT tokens.

**Features:**
- JWT token verification
- User context injection
- Optional authentication support
- Integration with Clerk backend

**Usage:**
```typescript
// Require authentication
app.get("/protected", authMiddleware, handler);

// Optional authentication
app.get("/public", optionalAuthMiddleware, handler);

// Access user in handler
const user = requireUser(c); // throws if not authenticated
const user = getUser(c);     // returns null if not authenticated
```

## Middleware Order

The order of middleware application is important:

```typescript
// 1. Security headers
app.use(secureHeaders());

// 2. CORS
app.use(cors({ /* config */ }));

// 3. Compression
app.use(compress());

// 4. Request timing
app.use(timing());

// 5. Logging
app.use(loggingMiddleware);
app.use(performanceMiddleware);

// 6. Error handler (wraps all routes)
app.use(errorHandler);

// 7. Response formatter
app.use(responseFormatter);
```

## Utilities

### API Response Helpers (`utils/apiResponse.ts`)
- `apiSuccess()` - Create success response
- `apiError()` - Create error response
- `apiPaginated()` - Create paginated response
- `apiBatchResult()` - Create batch operation response
- `apiErrors` - Common error response factories
- `parsePaginationParams()` - Parse pagination from query

### Logger Utility (`utils/logger.ts`)
- `getLogger(namespace)` - Create namespaced logger
- Log levels: DEBUG, INFO, WARN, ERROR
- Structured logging with metadata
- Environment-based log levels

### Request Context (`utils/requestContext.ts`)
- Request ID tracking
- Request timing
- Request metadata for logging

## Type Safety

All middleware is fully typed with TypeScript. Custom Hono context properties are defined in `types/hono.d.ts`:

```typescript
declare module "hono" {
  interface ContextVariableMap {
    user?: AuthUser;
    requestId?: string;
    requestStartTime?: number;
    validatedJson?: any;
    // ... other properties
  }
}
```

## Error Codes

Standard error codes are defined in the shared types:

- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `VALIDATION_ERROR` - 422
- `CONFLICT` - 409
- `INTERNAL_ERROR` - 500
- `SERVICE_UNAVAILABLE` - 503
- `RATE_LIMITED` - 429

## Examples

### Creating a Protected Endpoint with Validation

```typescript
const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
});

app.post(
  "/api/items",
  authMiddleware,
  validateBody(createItemSchema),
  async (c) => {
    const user = requireUser(c);
    const data = getValidated<z.infer<typeof createItemSchema>>(c, "json");
    
    try {
      const item = await createItem({ ...data, userId: user.id });
      return apiSuccess(c, item, { status: 201 });
    } catch (error) {
      if (error.code === "DUPLICATE") {
        throw errors.conflict("Item already exists");
      }
      throw error;
    }
  }
);
```

### Creating a Paginated List Endpoint

```typescript
app.get(
  "/api/items",
  authMiddleware,
  validateQuery(paginationSchema),
  async (c) => {
    const user = requireUser(c);
    const { page, pageSize, sortBy, sortOrder } = parsePaginationParams(c);
    
    const { items, total } = await getItems({
      userId: user.id,
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
    
    return apiPaginated(c, items, {
      page,
      pageSize,
      totalItems: total,
    });
  }
);
```