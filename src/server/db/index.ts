import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getSsl, usePreparedStatements } from "./options";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Copy .env.example to .env.local and fill in the values."
  );
}

const databaseUrl = process.env.DATABASE_URL;

// ─── Prevent multiple connections in development (HMR creates new modules) ───
const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined;
};

const connection =
  globalForDb.connection ??
  postgres(databaseUrl, {
    max: process.env.NODE_ENV === "production" ? 10 : 3,
    idle_timeout: 20,
    connect_timeout: 10,
    // SSL is required by Supabase/Neon/Railway, off for local - auto-detected.
    ssl: getSsl(databaseUrl),
    // Disabled automatically on Supabase's transaction pooler (pgbouncer).
    prepare: usePreparedStatements(databaseUrl),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
}

export const db = drizzle(connection, { schema, logger: false });

export type Database = typeof db;
