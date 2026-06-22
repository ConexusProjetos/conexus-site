import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerCaller } from "@/lib/trpc/server";
import { BlogPostEditor } from "@/components/admin/BlogPostEditor";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const trpc = await createServerCaller();
    const post = await trpc.blog.adminById({ id: parseInt(id) });
    return { title: `Editar - ${post.title}` };
  } catch {
    return { title: "Editar post" };
  }
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id);

  if (isNaN(numId)) notFound();

  const trpc = await createServerCaller();

  const [post, categories] = await Promise.all([
    trpc.blog.adminById({ id: numId }).catch(() => null),
    trpc.blog.categories().catch(() => []),
  ]);

  if (!post) notFound();

  return <BlogPostEditor post={post} categories={categories} />;
}
