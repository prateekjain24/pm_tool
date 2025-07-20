import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
