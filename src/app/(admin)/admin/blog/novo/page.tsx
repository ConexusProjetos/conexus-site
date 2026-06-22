import type { Metadata } from "next";
import { createServerCaller } from "@/lib/trpc/server";
import { BlogPostEditor } from "@/components/admin/BlogPostEditor";

export const metadata: Metadata = { title: "Novo post" };

export default async function NovoBlogPostPage() {
  let categories: Awaited<ReturnType<Awaited<ReturnType<typeof createServerCaller>>["blog"]["categories"]>> = [];
  try {
    const trpc = await createServerCaller();
    categories = await trpc.blog.categories();
  } catch {
    // DB not ready
  }

  return <BlogPostEditor categories={categories} />;
}
