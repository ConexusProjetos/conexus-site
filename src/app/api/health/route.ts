import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Railway healthcheck endpoint.
 * Returns 200 if the app + DB are healthy, 503 otherwise.
 * Monitored by Railway to decide if the deploy is healthy.
 */
export async function GET() {
  const start = Date.now();

  try {
    // Ping the database
    await db.execute(sql`SELECT 1`);

    const latencyMs = Date.now() - start;

    return Response.json(
      {
        status: "ok",
        db: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? "unknown",
        environment: process.env.NODE_ENV,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("[healthcheck] DB ping failed:", error);

    return Response.json(
      {
        status: "error",
        db: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
