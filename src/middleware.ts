import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

// ─── Simple in-memory rate limiter for the contact endpoint ──────────────────
// Note: this works per-edge-instance. For multi-instance production use,
// replace with Upstash Redis: https://upstash.com/docs/redis/sdks/ratelimit-ts
const contactRateMap = new Map<string, { count: number; resetAt: number }>();
const CONTACT_LIMIT = 5;         // max 5 submissions
const CONTACT_WINDOW_MS = 60_000; // per 60 seconds per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    contactRateMap.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return false;
  }

  if (entry.count >= CONTACT_LIMIT) return true;

  entry.count += 1;
  return false;
}

// ─── Security headers added to every response ────────────────────────────────
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Rate-limit the contact tRPC procedure ──────────────────────────────
  if (
    pathname.startsWith("/api/trpc") &&
    request.nextUrl.searchParams.get("batch") === "1" &&
    request.method === "POST"
  ) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    // Only rate-limit the contact.submit procedure
    const body = request.headers.get("content-type")?.includes("application/json");
    if (body && pathname.includes("contact")) {
      if (isRateLimited(ip)) {
        return withSecurityHeaders(
          NextResponse.json(
            { error: "Muitas requisições. Tente novamente em alguns minutos." },
            { status: 429, headers: { "Retry-After": "60" } }
          )
        );
      }
    }
  }

  // ─── Protect /admin routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("conexus-token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      const { payload } = await jwtVerify(token, secret, { issuer: "conexus" });

      if (payload.role !== "admin") {
        return withSecurityHeaders(NextResponse.redirect(new URL("/", request.url)));
      }

      const response = NextResponse.next();
      response.headers.set("x-user-id", String(payload.id ?? ""));
      response.headers.set("x-user-role", String(payload.role ?? ""));
      return withSecurityHeaders(response);
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // ─── Redirect logged-in users away from /login ──────────────────────────
  if (pathname === "/login") {
    const token = request.cookies.get("conexus-token")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret, { issuer: "conexus" });
        if (payload.role === "admin") {
          return withSecurityHeaders(
            NextResponse.redirect(new URL("/admin", request.url))
          );
        }
      } catch {
        // ignore expired token
      }
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/api/trpc/:path*",
  ],
};
