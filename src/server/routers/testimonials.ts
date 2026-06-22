import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { testimonials } from "../db/schema";

const testimonialInput = z.object({
  authorName: z.string().min(2).max(255),
  authorRole: z.string().max(255).optional(),
  authorCompany: z.string().max(255).optional(),
  authorAvatarUrl: z.string().url().optional(),
  content: z.string().min(20).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const testimonialsRouter = createTRPCRouter({
  /** Public - active testimonials for landing page */
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.testimonials.findMany({
      where: eq(testimonials.isActive, true),
      orderBy: asc(testimonials.order),
    });
  }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.testimonials.findMany({
      orderBy: asc(testimonials.order),
    });
  }),

  create: adminProcedure
    .input(testimonialInput)
    .mutation(async ({ ctx, input }) => {
      const [t] = await ctx.db.insert(testimonials).values(input).returning();
      return t;
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), data: testimonialInput.partial() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(testimonials)
        .set(input.data)
        .where(eq(testimonials.id, input.id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(testimonials).where(eq(testimonials.id, input.id));
      return { success: true };
    }),
});
