import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { connectDb, disconnectDb, getDb } from "./connection";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

async function runMigrations() {
  console.log("🚀 Starting database migrations...");

  try {
    // Connect to database
    await connectDb();
    const db = getDb();

    // Run migrations
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../../drizzle"),
    });

    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await disconnectDb();
  }
}

// Run migrations if this file is executed directly
if (import.meta.main) {
  runMigrations();
}
