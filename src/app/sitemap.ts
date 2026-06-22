import type { MetadataRoute } from "next";
import { db } from "@/server/db";
import { blogPosts, projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://conexus.com.br";

export const revalidate = 3600; // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));

    blogRoutes = posts.map(({ slug, updatedAt }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB may not be ready during build
  }

  // Dynamic portfolio projects
  let portfolioRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeProjects = await db
      .select({ slug: projects.slug, updatedAt: projects.updatedAt })
      .from(projects)
      .where(eq(projects.isActive, true));

    portfolioRoutes = activeProjects.map(({ slug, updatedAt }) => ({
      url: `${BASE_URL}/portfolio/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB may not be ready during build
  }

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
}
