import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

// ─── Initialize tRPC ──────────────────────────────────────────────────────────
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ─── Router & Caller factory ──────────────────────────────────────────────────
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// ─── Middleware: logging ──────────────────────────────────────────────────────
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development") {
    const status = result.ok ? "ok" : "fail";
    console.log(`${status} tRPC ${type} ${path} - ${duration}ms`);
  }

  return result;
});

// ─── Middleware: auth guard ───────────────────────────────────────────────────
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado para acessar este recurso.",
    });
  }
  return next({ ctx: { user: ctx.user } });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acesso restrito a administradores.",
    });
  }
  return next({ ctx: { user: ctx.user } });
});

// ─── Exported procedures ──────────────────────────────────────────────────────

/** Public procedure - no auth required */
export const publicProcedure = t.procedure.use(loggerMiddleware);

/** Protected procedure - requires any authenticated user */
export const protectedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(isAuthenticated);

/** Admin procedure - requires role === 'admin' */
export const adminProcedure = t.procedure
  .use(loggerMiddleware)
  .use(isAdmin);
