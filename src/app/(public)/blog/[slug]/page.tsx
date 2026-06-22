import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerCaller } from "@/lib/trpc/server";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { BlogCard } from "@/components/sections/BlogCard";
import { formatDate, getAbsoluteUrl } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, User, Target } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

// ─── SSG ─────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const trpc = await createServerCaller();
    const slugs = await trpc.blog.allSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ─── Dynamic metadata + Open Graph ───────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const trpc = await createServerCaller();
    const post = await trpc.blog.bySlug({ slug });
    const title = post.metaTitle ?? post.title;
    const description =
      post.metaDescription ?? post.excerpt ?? post.content.slice(0, 160);
    const image = post.ogImageUrl ?? post.coverImageUrl;

    return {
      title,
      description,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title,
        description,
        url: getAbsoluteUrl(`/blog/${slug}`),
        publishedTime: post.publishedAt?.toISOString(),
        authors: post.author?.name ? [post.author.name] : ["Conexus"],
        images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: "Blog - Conexus" };
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const trpc = await createServerCaller();
  const post = await trpc.blog.bySlug({ slug }).catch(() => null);

  if (!post) notFound();

  // Fetch related posts (same category, excluding current)
  const relatedResult = await trpc.blog
    .list({
      limit: 3,
      categorySlug: post.category?.slug,
    })
    .catch(() => ({ posts: [] }));
  const relatedPosts = relatedResult.posts.filter((p) => p.slug !== slug).slice(0, 3);

  const tags = (post.tags ?? []) as string[];

  return (
    <>
      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt ?? post.metaDescription,
            image: post.ogImageUrl ?? post.coverImageUrl,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: {
              "@type": "Person",
              name: post.author?.name ?? "Equipe Conexus",
            },
            publisher: {
              "@type": "Organization",
              name: "Conexus Tecnologia",
              logo: {
                "@type": "ImageObject",
                url: getAbsoluteUrl("/assets/logo.png"),
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": getAbsoluteUrl(`/blog/${slug}`),
            },
          }),
        }}
      />

      <article itemScope itemType="https://schema.org/BlogPosting">
        {/* Hero */}
        <header className="bg-conexus-dark-2 border-b border-conexus-dark-border">
          <div className="section-container pt-28 pb-10">
            {/* Breadcrumb */}
            <nav aria-label="Navegação" className="flex items-center gap-2 text-sm text-conexus-text-muted mb-6">
              <Link href="/blog" className="hover:text-conexus-cyan transition-colors flex items-center gap-1.5">
                <ArrowLeft size={14} />
                Blog
              </Link>
              {post.category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={`/blog?categoria=${post.category.slug}`}
                    className="hover:text-conexus-cyan transition-colors"
                    style={{ color: post.category.color ?? "#00A5B7" }}
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>

            {/* Category label */}
            {post.category && (
              <span
                className="text-xs font-semibold uppercase tracking-wider mb-4 block"
                style={{ color: post.category.color ?? "#00A5B7" }}
              >
                {post.category.name}
              </span>
            )}

            {/* Title */}
            <h1
              itemProp="headline"
              className="font-outfit text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl leading-tight"
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-conexus-text-muted">
              {post.author && (
                <span className="flex items-center gap-2" itemProp="author">
                  <div className="w-6 h-6 rounded-full bg-conexus-cyan/10 border border-conexus-cyan/20 flex items-center justify-center text-xs font-semibold text-conexus-cyan">
                    {post.author.name?.charAt(0).toUpperCase()}
                  </div>
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5" itemProp="datePublished">
                  <Calendar size={13} aria-hidden="true" />
                  {formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {post.readTimeMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} aria-hidden="true" />
                  {post.readTimeMinutes} min de leitura
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="section-container py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.title}
              itemProp="image"
              className="w-full rounded-2xl border border-conexus-dark-border object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Content */}
        <div className="section-container py-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main content */}
            <div className="lg:col-span-3" itemProp="articleBody">
              {post.excerpt && (
                <p className="text-xl text-conexus-text-secondary leading-relaxed mb-8 pb-8 border-b border-conexus-dark-border font-medium">
                  {post.excerpt}
                </p>
              )}

              <MarkdownRenderer content={post.content} />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-conexus-dark-border flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-conexus-text-muted border border-conexus-dark-border px-3 py-1 rounded-full bg-white/[0.02]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - sticky ToC placeholder + CTA */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <div className="card-glass p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-conexus-cyan/10 border border-conexus-cyan/20 flex items-center justify-center mx-auto mb-3" style={{ color: "var(--cnx-blue)" }}>
                    <Target size={18} aria-hidden="true" />
                  </div>
                  <h3 className="font-outfit font-semibold text-sm mb-2">
                    Precisa de ajuda?
                  </h3>
                  <p className="text-xs text-conexus-text-muted mb-4 leading-relaxed">
                    A Conexus pode implementar isso para você em dias.
                  </p>
                  <a
                    href="/#contato"
                    className="btn-primary w-full justify-center text-xs py-2"
                  >
                    Falar com a equipe
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="section-container pb-8 lg:hidden">
          <div className="card-glass p-5 flex items-center gap-4">
            <div style={{ color: "var(--cnx-blue)" }}><Target size={22} aria-hidden="true" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Precisa implementar isso?</p>
              <a href="/#contato" className="text-conexus-cyan text-sm hover:underline">
                Falar com a Conexus →
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="section bg-conexus-dark-2" aria-label="Posts relacionados">
          <div className="section-container">
            <h2 className="font-outfit text-2xl font-semibold mb-8">
              Continue lendo
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <BlogCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  excerpt={p.excerpt}
                  coverImageUrl={p.coverImageUrl}
                  categoryName={p.category?.name}
                  categoryColor={p.category?.color}
                  publishedAt={p.publishedAt}
                  readTimeMinutes={p.readTimeMinutes}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
