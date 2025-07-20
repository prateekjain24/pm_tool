import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

interface MigrationEntry {
  idx: number;
  version: number;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface MigrationJournal {
  version: string;
  dialect: string;
  entries: MigrationEntry[];
}

async function checkMigrations() {
  console.log("🔍 Checking migration status...\n");
  
  const migrationsDir = path.join(__dirname, "../../drizzle");
  const metaDir = path.join(migrationsDir, "meta");
  const journalPath = path.join(metaDir, "_journal.json");
  
  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.log("❌ No migrations directory found");
    console.log("   Run 'bun run db:generate' to create your first migration");
    process.exit(1);
  }
  
  // Check if journal exists
  if (!fs.existsSync(journalPath)) {
    console.log("❌ No migration journal found");
    console.log("   Run 'bun run db:generate' to create your first migration");
    process.exit(1);
  }
  
  // Read journal
  const journalContent = fs.readFileSync(journalPath, "utf-8");
  const journal: MigrationJournal = JSON.parse(journalContent);
  
  console.log(`📋 Migration Journal`);
  console.log(`   Version: ${journal.version}`);
  console.log(`   Dialect: ${journal.dialect}`);
  console.log(`   Total migrations: ${journal.entries.length}\n`);
  
  // List all migrations
  console.log("📝 Migration History:");
  journal.entries.forEach((entry, index) => {
    const migrationFile = fs.readdirSync(migrationsDir).find(f => f.endsWith(".sql") && f.includes(entry.tag));
    const timestamp = new Date(entry.when).toLocaleString();
    console.log(`   ${index + 1}. ${migrationFile || entry.tag}`);
    console.log(`      Created: ${timestamp}`);
  });
  
  // Check for pending migrations (this is simplified - in a real app you'd check against DB)
  const sqlFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
  console.log(`\n📁 SQL Files: ${sqlFiles.length}`);
  
  if (sqlFiles.length !== journal.entries.length) {
    console.log("\n⚠️  Warning: Mismatch between SQL files and journal entries");
    console.log("   This might indicate corrupted migrations");
    process.exit(1);
  }
  
  console.log("\n✅ All migrations appear to be in order");
  console.log("\nℹ️  To apply migrations, run: bun run db:migrate");
}

// Run check if this file is executed directly
if (import.meta.main) {
  checkMigrations();
}

export { checkMigrations };