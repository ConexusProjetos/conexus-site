import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/routers/_app";
import { db } from "@/server/db";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

const createCaller = createCallerFactory(appRouter);

/**
 * Server-side tRPC caller for use in Server Components.
 * Cached per request to avoid duplicate DB calls in the same render.
 *
 * @example
 * const trpc = await createServerCaller();
 * const services = await trpc.services.list();
 */
export const createServerCaller = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  let user = null;
  if (token) {
    try {
      user = await verifyToken(token);
    } catch {
      // expired or invalid - treat as unauthenticated
    }
  }

  return createCaller({
    db,
    user: user as any,
    req: new Request("http://internal"),
  });
});

/**
 * Anonymous tRPC caller for PUBLIC pages and sections.
 *
 * Unlike `createServerCaller`, this never touches `cookies()`, so it is safe
 * inside statically generated pages (SSG/ISR). Reading cookies during static
 * rendering throws and turns the whole page into a 500 - which is exactly what
 * happened to /blog/[slug] and /portfolio/[slug] when content was created
 * after the build. Public procedures never need the user anyway.
 */
export const createPublicCaller = cache(async () => {
  return createCaller({
    db,
    user: null,
    req: new Request("http://internal"),
  });
});
