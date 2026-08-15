import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Reuse a single postgres connection across hot reloads in development.
const globalForDb = globalThis as unknown as {
  __anchorPgClient?: ReturnType<typeof postgres>;
};

// `postgres()` is lazy — it does not open a connection until the first query.
const client =
  globalForDb.__anchorPgClient ??
  postgres(process.env.DATABASE_URL ?? "", { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__anchorPgClient = client;
}

// Schema is introduced in Phase 2.
export const db = drizzle(client);
