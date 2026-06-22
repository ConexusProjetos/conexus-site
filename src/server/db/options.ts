/**
 * Connection options shared by the app (db/index.ts), the seed script and
 * drizzle-kit (drizzle.config.ts).
 *
 * Managed Postgres providers - Supabase, Neon, Railway - require SSL.
 * A local Docker/Postgres on localhost does not. We auto-detect from the URL
 * so the same code works in development and production without touching
 * NODE_ENV.
 */

/** True when DATABASE_URL points at a local Postgres (Docker or native). */
export function isLocalDatabase(url: string): boolean {
  return /@(localhost|127\.0\.0\.1|\[::1\])(:|\/)/.test(url);
}

/**
 * SSL mode for the postgres-js driver.
 * "require" encrypts the connection (Supabase/Neon/Railway); local stays off.
 */
export function getSsl(url: string): "require" | false {
  return isLocalDatabase(url) ? false : "require";
}

/**
 * Supabase's *transaction* pooler (port 6543 / `pgbouncer=true`) does not
 * support prepared statements - they must be disabled there. The direct
 * connection and the *session* pooler (port 5432) support them normally.
 */
export function usePreparedStatements(url: string): boolean {
  return !(url.includes("pgbouncer=true") || /:6543(\/|\?|$)/.test(url));
}

/**
 * Ensures a non-local URL carries `sslmode=require` (used by drizzle-kit,
 * which connects straight from the connection string).
 */
export function withSslMode(url: string): string {
  if (isLocalDatabase(url) || /[?&]sslmode=/.test(url)) return url;
  return url + (url.includes("?") ? "&" : "?") + "sslmode=require";
}
