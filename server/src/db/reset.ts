import { execSync } from "child_process";
import * as dotenv from "dotenv";
import path from "path";
import readline from "readline";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function reset() {
  console.log("⚠️  WARNING: Database Reset ⚠️");
  console.log("This will:");
  console.log("1. Drop the database 'pm_tools_dev'");
  console.log("2. Recreate the database");
  console.log("3. Run all migrations");
  console.log("4. Run seed data (optional)");
  console.log("\n⚠️  ALL DATA WILL BE LOST! ⚠️\n");
  
  const response = await askQuestion("Are you sure you want to continue? (yes/no): ");
  
  if (response.toLowerCase() !== "yes") {
    console.log("❌ Reset cancelled");
    rl.close();
    return;
  }
  
  console.log("\n🔄 Starting database reset...");
  
  try {
    // Drop database (ignore error if it doesn't exist)
    console.log("📦 Dropping database...");
    try {
      execSync("/opt/homebrew/opt/postgresql@16/bin/dropdb pm_tools_dev", { stdio: 'inherit' });
    } catch (error) {
      console.log("ℹ️  Database doesn't exist, continuing...");
    }
    
    // Create database
    console.log("📦 Creating database...");
    execSync("/opt/homebrew/opt/postgresql@16/bin/createdb pm_tools_dev", { stdio: 'inherit' });
    
    // Run migrations
    console.log("🚀 Running migrations...");
    execSync("bun run db:migrate", { stdio: 'inherit' });
    
    // Ask about seeding
    const seedResponse = await askQuestion("\nDo you want to run seed data? (yes/no): ");
    
    if (seedResponse.toLowerCase() === "yes") {
      console.log("🌱 Running seed data...");
      execSync("bun run db:seed", { stdio: 'inherit' });
    }
    
    console.log("\n✅ Database reset completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Reset failed:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run reset if this file is executed directly
if (import.meta.main) {
  reset();
}

export { reset };