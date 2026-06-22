import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "../trpc";
import { services } from "../db/schema";
import slugify from "slugify";

const serviceInput = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  icon: z.string().max(100).optional(),
  features: z.array(z.string()).default([]),
  basePriceCents: z.number().int().positive().optional(),
  monthlyPriceCents: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const servicesRouter = createTRPCRouter({
  /** Public - all active services ordered for landing page */
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: asc(services.order),
    });
  }),

  /** Public - single service by slug (for future /servicos/[slug] page) */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.query.services.findFirst({
        where: eq(services.slug, input.slug),
      });
      if (!service) throw new TRPCError({ code: "NOT_FOUND" });
      return service;
    }),

  /** Admin - all services (including inactive) */
  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.services.findMany({
      orderBy: asc(services.order),
    });
  }),

  /** Admin - create service */
  create: adminProcedure
    .input(serviceInput)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.title, { lower: true, strict: true });
      const [created] = await ctx.db
        .insert(services)
        .values({ ...input, slug })
        .returning();
      return created;
    }),

  /** Admin - update service */
  update: adminProcedure
    .input(z.object({ id: z.number(), data: serviceInput.partial() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(services)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(services.id, input.id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  /** Admin - delete service */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),

  /** Admin - reorder (drag & drop) */
  reorder: adminProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.map(({ id, order }) =>
          ctx.db
            .update(services)
            .set({ order, updatedAt: new Date() })
            .where(eq(services.id, id))
        )
      );
      return { success: true };
    }),
});
