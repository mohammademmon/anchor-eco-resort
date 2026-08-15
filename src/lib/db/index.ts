import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Reuse a single postgres connection across hot reloads in development.
const globalForDb = globalThis as unknown as {
  __anchorPgClient?: ReturnType<typeof postgres>;
};

// `postgres()` is lazy — no connection until the first query. Use the Supabase
// transaction pooler URL in serverless; `prepare: false` is required for it.
const client =
  globalForDb.__anchorPgClient ??
  postgres(process.env.DATABASE_URL ?? "", { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__anchorPgClient = client;
}

export const db = drizzle(client, { schema });
export { schema };
