import { z } from "zod";
import { eq, asc, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "../trpc";
import { projects, projectCategories } from "../db/schema";
import slugify from "slugify";

const projectInput = z.object({
  title: z.string().min(3).max(255),
  excerpt: z.string().max(400).optional(),
  description: z.string().min(10),
  client: z.string().max(255).optional(),
  clientSector: z.string().max(255).optional(),
  categoryId: z.number().int().optional(),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  projectUrl: z.string().url().optional(),
  resultMetrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  completedAt: z.date().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
});

export const projectsRouter = createTRPCRouter({
  // ─── Public endpoints ────────────────────────────────────────────────────

  /** All active projects - ordered by featured first, then newest */
  list: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const filters = [eq(projects.isActive, true)];

      if (input?.featured !== undefined) {
        filters.push(eq(projects.isFeatured, input.featured));
      }

      if (input?.categorySlug) {
        const category = await ctx.db.query.projectCategories.findFirst({
          where: eq(projectCategories.slug, input.categorySlug),
        });
        if (category) {
          filters.push(eq(projects.categoryId, category.id));
        }
      }

      return ctx.db.query.projects.findMany({
        where: and(...filters),
        with: { category: true },
        orderBy: [desc(projects.isFeatured), desc(projects.completedAt)],
        limit: input?.limit ?? 20,
      });
    }),

  /** Single project by slug - used for SSG generateStaticParams */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: and(
          eq(projects.slug, input.slug),
          eq(projects.isActive, true)
        ),
        with: { category: true },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),

  /** All active slugs - for Next.js generateStaticParams */
  allSlugs: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({ slug: projects.slug })
      .from(projects)
      .where(eq(projects.isActive, true));
    return rows.map((r) => r.slug);
  }),

  /** All categories */
  categories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.projectCategories.findMany({
      orderBy: asc(projectCategories.name),
    });
  }),

  // ─── Admin endpoints ─────────────────────────────────────────────────────

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.projects.findMany({
      with: { category: true },
      orderBy: desc(projects.createdAt),
    });
  }),

  create: adminProcedure
    .input(projectInput)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.title, { lower: true, strict: true });
      const [created] = await ctx.db
        .insert(projects)
        .values({ ...input, slug })
        .returning();
      return created;
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), data: projectInput.partial() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(projects)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(projects.id, input.id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),

  // Category CRUD
  createCategory: adminProcedure
    .input(z.object({ name: z.string().min(2), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name, { lower: true, strict: true });
      const [cat] = await ctx.db
        .insert(projectCategories)
        .values({ ...input, slug })
        .returning();
      return cat;
    }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projectCategories)
        .where(eq(projectCategories.id, input.id));
      return { success: true };
    }),
});
