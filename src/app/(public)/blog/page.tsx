import type { Metadata } from "next";
import { Suspense } from "react";
import { createServerCaller } from "@/lib/trpc/server";
import { BlogCard } from "@/components/sections/BlogCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Pagination } from "@/components/ui/Pagination";
import { getAbsoluteUrl } from "@/lib/utils";
import { Search } from "lucide-react";
import { EmptyStateArt } from "@/components/illustrations/Illustrations";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dicas, tutoriais e cases sobre tecnologia, automação e gestão para pequenas e médias empresas.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog - Conexus",
    description: "Conteúdo sobre tecnologia e gestão para PMEs.",
    url: getAbsoluteUrl("/blog"),
  },
};

// Revalidate every hour for fresh content
export const revalidate = 3600;

type Props = {
  searchParams: Promise<{
    pagina?: string;
    categoria?: string;
    busca?: string;
  }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { pagina, categoria, busca } = await searchParams;
  const page = Math.max(1, parseInt(pagina ?? "1"));

  const trpc = await createServerCaller();
  const [result, categories] = await Promise.all([
    trpc.blog
      .list({ page, limit: 9, categorySlug: categoria, search: busca })
      .catch(() => ({ posts: [], total: 0, pages: 0, page: 1 })),
    trpc.blog.categories().catch(() => []),
  ]);

  const { posts, pages, total } = result;

  // Featured post - only show on first page, no filter
  const featuredPost = !categoria && !busca && page === 1
    ? posts.find((p) => p.isFeatured) ?? posts[0]
    : null;
  const regularPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 section-container">
        <span className="cnx-eyebrow mb-5"><span className="dot" />Conhecimento gratuito</span>
        <h1 className="cnx-display text-4xl md:text-5xl mb-4 max-w-2xl">
          Blog da{" "}
          <span className="cnx-grad-text">Conexus</span>
        </h1>
        <p className="cnx-lead max-w-xl mb-8">
          Conteúdo prático sobre tecnologia, automação e gestão para quem
          quer crescer sem complicar.
        </p>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {categories.length > 0 && (
            <Suspense>
              <CategoryFilter categories={categories} paramKey="categoria" />
            </Suspense>
          )}

          {/* Search - links to same page with busca param */}
          <form method="GET" className="flex items-center gap-2 ml-auto">
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 cnx-muted pointer-events-none z-10"
                aria-hidden="true"
              />
              <input
                name="busca"
                type="search"
                defaultValue={busca}
                placeholder="Buscar posts..."
                className="cnx-input pl-9 py-2 text-sm w-48 focus:w-64 transition-all duration-200"
              />
            </div>
          </form>
        </div>
      </section>

      <section className="section-container pb-24">
        {total === 0 ? (
          <div className="py-24 text-center">
            <EmptyStateArt className="w-44 sm:w-52 mx-auto mb-4" />
            <p className="cnx-body mb-2">
              {busca
                ? `Nenhum post encontrado para "${busca}".`
                : categoria
                  ? "Nenhum post nesta categoria ainda."
                  : "Nenhum post publicado ainda."}
            </p>
            {(busca || categoria) && (
              <a href="/blog" className="text-sm hover:underline" style={{ color: "var(--cnx-blue)" }}>
                Ver todos os posts →
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Featured post - full-width card */}
            {featuredPost && (
              <div className="mb-10">
                <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-4">
                  Em destaque
                </p>
                <BlogCard
                  slug={featuredPost.slug}
                  title={featuredPost.title}
                  excerpt={featuredPost.excerpt}
                  coverImageUrl={featuredPost.coverImageUrl}
                  categoryName={featuredPost.category?.name}
                  categoryColor={featuredPost.category?.color}
                  publishedAt={featuredPost.publishedAt}
                  readTimeMinutes={featuredPost.readTimeMinutes}
                  isFeatured
                  className="sm:flex-row sm:max-h-64"
                />
              </div>
            )}

            {/* Grid */}
            {regularPosts.length > 0 && (
              <>
                {featuredPost && (
                  <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-4">
                    Artigos recentes
                  </p>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {regularPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      slug={post.slug}
                      title={post.title}
                      excerpt={post.excerpt}
                      coverImageUrl={post.coverImageUrl}
                      categoryName={post.category?.name}
                      categoryColor={post.category?.color}
                      publishedAt={post.publishedAt}
                      readTimeMinutes={post.readTimeMinutes}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <Suspense>
                <Pagination currentPage={page} totalPages={pages} paramKey="pagina" />
              </Suspense>
            )}
          </>
        )}
      </section>
    </>
  );
}
