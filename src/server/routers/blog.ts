import { z } from "zod";
import { eq, desc, asc, and, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { blogPosts, blogCategories } from "../db/schema";
import slugify from "slugify";

const postInput = z.object({
  title: z.string().min(5).max(255),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(100),
  coverImageUrl: z.string().url().optional(),
  categoryId: z.number().int().optional(),
  tags: z.array(z.string()).default([]),
  readTimeMinutes: z.number().int().min(1).default(5),
  // SEO
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImageUrl: z.string().url().optional(),
  // Status
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export const blogRouter = createTRPCRouter({
  // ─── Public endpoints ────────────────────────────────────────────────────

  /** Published posts - paginated, optional category filter */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(20).default(9),
        categorySlug: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 9;
      const offset = (page - 1) * limit;

      const filters = [eq(blogPosts.isPublished, true)];

      if (input?.categorySlug) {
        const cat = await ctx.db.query.blogCategories.findFirst({
          where: eq(blogCategories.slug, input.categorySlug),
        });
        if (cat) filters.push(eq(blogPosts.categoryId, cat.id));
      }

      if (input?.search) {
        filters.push(ilike(blogPosts.title, `%${input.search}%`));
      }

      const [posts, [{ count }]] = await Promise.all([
        ctx.db.query.blogPosts.findMany({
          where: and(...filters),
          with: { category: true, author: { columns: { id: true, name: true, avatarUrl: true } } },
          orderBy: [desc(blogPosts.isFeatured), desc(blogPosts.publishedAt)],
          limit,
          offset,
          columns: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImageUrl: true,
            tags: true,
            readTimeMinutes: true,
            isFeatured: true,
            publishedAt: true,
          },
        }),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(blogPosts)
          .where(and(...filters)),
      ]);

      return {
        posts,
        total: count,
        pages: Math.ceil(count / limit),
        page,
      };
    }),

  /** Single published post by slug */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.blogPosts.findFirst({
        where: and(
          eq(blogPosts.slug, input.slug),
          eq(blogPosts.isPublished, true)
        ),
        with: {
          category: true,
          author: { columns: { id: true, name: true, avatarUrl: true } },
        },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  /** All published slugs - for generateStaticParams */
  allSlugs: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
    return rows.map((r) => r.slug);
  }),

  /** Featured post for homepage */
  featured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.blogPosts.findFirst({
      where: and(
        eq(blogPosts.isPublished, true),
        eq(blogPosts.isFeatured, true)
      ),
      with: { category: true },
      orderBy: desc(blogPosts.publishedAt),
    });
  }),

  /** All blog categories */
  categories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.blogCategories.findMany({
      orderBy: asc(blogCategories.name),
    });
  }),

  // ─── Admin endpoints ─────────────────────────────────────────────────────

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.blogPosts.findMany({
      with: { category: true, author: { columns: { id: true, name: true } } },
      orderBy: desc(blogPosts.createdAt),
    });
  }),

  adminById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, input.id),
        with: { category: true },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  create: adminProcedure
    .input(postInput)
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.title, { lower: true, strict: true });
      const publishedAt =
        input.isPublished ? (input.publishedAt ?? new Date()) : null;

      const [post] = await ctx.db
        .insert(blogPosts)
        .values({
          ...input,
          slug,
          publishedAt: publishedAt ?? undefined,
          authorId: ctx.user.id,
        })
        .returning();
      return post;
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), data: postInput.partial() }))
    .mutation(async ({ ctx, input }) => {
      const publishedAt =
        input.data.isPublished && !input.data.publishedAt
          ? new Date()
          : input.data.publishedAt;

      const [updated] = await ctx.db
        .update(blogPosts)
        .set({ ...input.data, publishedAt, updatedAt: new Date() })
        .where(eq(blogPosts.id, input.id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),

  // Category CRUD
  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name, { lower: true, strict: true });
      const [cat] = await ctx.db
        .insert(blogCategories)
        .values({ ...input, slug })
        .returning();
      return cat;
    }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(blogCategories).where(eq(blogCategories.id, input.id));
      return { success: true };
    }),
});
