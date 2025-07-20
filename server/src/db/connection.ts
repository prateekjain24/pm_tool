import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient, type PoolConfig } from "pg";
import { env } from "../config/env";
import * as schema from "./schema";

// Database connection configuration
const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait when connecting a new client
};

// Connection metrics
interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalConnectionTime: number;
  connectionErrors: number;
  lastError?: Error;
  lastErrorTime?: Date;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool | null = null;
  private isConnecting = false;
  private connectionAttempts = 0;
  private metrics: ConnectionMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    idleConnections: 0,
    waitingRequests: 0,
    totalConnectionTime: 0,
    connectionErrors: 0,
  };

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize database connection with retry logic
   */
  async connect(): Promise<Pool> {
    if (this.pool) {
      return this.pool;
    }

    if (this.isConnecting) {
      // Wait for the current connection attempt to complete
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.pool) {
            clearInterval(checkInterval);
            resolve(this.pool);
          } else if (!this.isConnecting) {
            clearInterval(checkInterval);
            reject(new Error("Connection failed"));
          }
        }, 100);
      });
    }

    this.isConnecting = true;
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    try {
      while (this.connectionAttempts < maxRetries) {
        try {
          const startTime = Date.now();
          this.pool = new Pool(poolConfig);

          // Test the connection
          const client = await this.pool.connect();
          await client.query("SELECT 1");
          client.release();

          // Update metrics
          this.metrics.totalConnectionTime += Date.now() - startTime;
          this.metrics.totalConnections++;

          // Set up event listeners
          this.setupPoolEventListeners();

          console.log("✅ Database connected successfully");
          this.connectionAttempts = 0;
          return this.pool;
        } catch (error) {
          this.connectionAttempts++;
          this.metrics.connectionErrors++;
          this.metrics.lastError = error as Error;
          this.metrics.lastErrorTime = new Date();

          console.error(
            `❌ Database connection attempt ${this.connectionAttempts}/${maxRetries} failed:`,
            error,
          );

          if (this.connectionAttempts >= maxRetries) {
            throw new Error(
              `Failed to connect to database after ${maxRetries} attempts: ${
                (error as Error).message
              }`,
            );
          }

          // Exponential backoff
          const delay = baseDelay * 2 ** (this.connectionAttempts - 1);
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      throw new Error("Failed to connect to database");
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Set up event listeners for pool monitoring
   */
  private setupPoolEventListeners(): void {
    if (!this.pool) return;

    this.pool.on("connect", () => {
      this.metrics.activeConnections++;
    });

    this.pool.on("acquire", () => {
      this.metrics.idleConnections--;
      this.metrics.activeConnections++;
    });

    this.pool.on("release", () => {
      this.metrics.activeConnections--;
      this.metrics.idleConnections++;
    });

    this.pool.on("remove", () => {
      this.metrics.idleConnections--;
    });

    this.pool.on("error", (error) => {
      console.error("Unexpected pool error:", error);
      this.metrics.lastError = error;
      this.metrics.lastErrorTime = new Date();
    });
  }

  /**
   * Get the current pool instance
   */
  getPool(): Pool {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.pool;
  }

  /**
   * Get Drizzle ORM instance
   */
  getDrizzle() {
    const pool = this.getPool();
    const drizzleInstance = drizzle(pool, { schema });
    return drizzleInstance;
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    if (this.pool) {
      const poolMetrics = this.pool as any;
      this.metrics.totalConnections = poolMetrics.totalCount || 0;
      this.metrics.idleConnections = poolMetrics.idleCount || 0;
      this.metrics.waitingRequests = poolMetrics.waitingCount || 0;
    }
    return { ...this.metrics };
  }

  /**
   * Health check for the database connection
   */
  async healthCheck(): Promise<{
    connected: boolean;
    responseTime?: number;
    error?: string;
  }> {
    if (!this.pool) {
      return { connected: false, error: "Pool not initialized" };
    }

    try {
      const startTime = Date.now();
      const client = await this.pool.connect();
      await client.query("SELECT 1");
      client.release();
      const responseTime = Date.now() - startTime;

      return { connected: true, responseTime };
    } catch (error) {
      return {
        connected: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Gracefully shut down the database connection
   */
  async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    console.log("🔌 Closing database connections...");

    try {
      await this.pool.end();
      this.pool = null;
      this.connectionAttempts = 0;
      console.log("✅ Database connections closed");
    } catch (error) {
      console.error("Error closing database connections:", error);
      throw error;
    }
  }

  /**
   * Execute a query with automatic retry on connection errors
   */
  async executeWithRetry<T>(
    queryFn: (client: PoolClient) => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const pool = await this.connect();
        const client = await pool.connect();

        try {
          const result = await queryFn(client);
          return result;
        } finally {
          client.release();
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`Query attempt ${attempt}/${maxRetries} failed:`, error);

        // Check if it's a connection error
        const isConnectionError =
          lastError.message.includes("ECONNREFUSED") ||
          lastError.message.includes("ETIMEDOUT") ||
          lastError.message.includes("connection");

        if (!isConnectionError || attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retry with exponential backoff
        const delay = 1000 * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error("Query failed after retries");
  }
}

// Export singleton instance
export const db = DatabaseConnection.getInstance();

// Export convenience functions
export const getDb = () => db.getDrizzle();
export const getPool = () => db.getPool();
export const connectDb = () => db.connect();
export const disconnectDb = () => db.disconnect();
export const dbHealthCheck = () => db.healthCheck();
export const getDbMetrics = () => db.getMetrics();
