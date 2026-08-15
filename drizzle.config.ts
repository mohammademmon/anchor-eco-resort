import type { Config } from "drizzle-kit";

// The SQL migration in supabase/migrations is the source of truth.
// This config exists only for typed introspection / studio — never run
// `drizzle-kit push` (it would try to drop/recreate the SQL-managed tables).
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
