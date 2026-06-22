import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerCaller } from "@/lib/trpc/server";
import { formatDate, getAbsoluteUrl } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Tag, Calendar } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

// ─── Static params for SSG ──────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const trpc = await createServerCaller();
    const slugs = await trpc.projects.allSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ─── Dynamic metadata ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const trpc = await createServerCaller();
    const project = await trpc.projects.bySlug({ slug });
    const title = project.metaTitle ?? `${project.title} - Portfólio Conexus`;
    const description =
      project.metaDescription ??
      project.excerpt ??
      project.description.slice(0, 160);

    return {
      title,
      description,
      alternates: { canonical: `/portfolio/${slug}` },
      openGraph: {
        title,
        description,
        url: getAbsoluteUrl(`/portfolio/${slug}`),
        images: project.imageUrl
          ? [{ url: project.imageUrl, width: 1200, height: 630, alt: project.title }]
          : [],
      },
    };
  } catch {
    return { title: "Projeto - Conexus" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const trpc = await createServerCaller();
  const project = await trpc.projects.bySlug({ slug }).catch(() => null);

  if (!project) notFound();

  const tags = (project.tags ?? []) as string[];
  const metrics = (project.resultMetrics ?? []) as { label: string; value: string }[];

  return (
    <>
      {/* JSON-LD: CreativeWork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.excerpt ?? project.description,
            url: getAbsoluteUrl(`/portfolio/${slug}`),
            creator: {
              "@type": "Organization",
              name: "Conexus Tecnologia",
              url: "https://conexus.com.br",
            },
            ...(project.completedAt && { dateCreated: project.completedAt }),
            ...(project.imageUrl && { image: project.imageUrl }),
          }),
        }}
      />

      <article>
        {/* Hero */}
        <div className="relative bg-conexus-dark-2 border-b border-conexus-dark-border">
          <div className="section-container pt-28 pb-12">
            {/* Breadcrumb */}
            <nav aria-label="Navegação" className="flex items-center gap-2 text-sm text-conexus-text-muted mb-6">
              <Link href="/portfolio" className="hover:text-conexus-cyan transition-colors flex items-center gap-1.5">
                <ArrowLeft size={14} />
                Portfólio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white truncate">{project.title}</span>
            </nav>

            {/* Category + client */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.category && (
                <span className="section-label text-xs">{project.category.name}</span>
              )}
              {project.client && (
                <span className="text-sm text-conexus-text-muted">
                  Cliente: <strong className="text-white">{project.client}</strong>
                  {project.clientSector && ` · ${project.clientSector}`}
                </span>
              )}
              {project.completedAt && (
                <span className="flex items-center gap-1.5 text-sm text-conexus-text-muted">
                  <Calendar size={13} />
                  {formatDate(project.completedAt, { month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            <h1 className="font-outfit text-4xl md:text-5xl font-bold mb-4 max-w-3xl leading-tight">
              {project.title}
            </h1>

            {project.excerpt && (
              <p className="text-xl text-conexus-text-secondary max-w-2xl">
                {project.excerpt}
              </p>
            )}

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm text-conexus-cyan hover:text-conexus-cyan-light transition-colors"
              >
                Ver projeto <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Cover image */}
        {project.imageUrl && (
          <div className="section-container py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={`Screenshot do projeto ${project.title}`}
              className="w-full rounded-2xl border border-conexus-dark-border object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Main content */}
        <div className="section-container py-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="font-outfit text-2xl font-semibold mb-5">Sobre o projeto</h2>
              <div className="text-conexus-text-secondary leading-relaxed whitespace-pre-wrap text-base">
                {project.description}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Result metrics */}
              {metrics.length > 0 && (
                <div className="card-glass p-5">
                  <h3 className="font-outfit font-semibold mb-4 text-sm uppercase tracking-wider text-conexus-text-muted">
                    Resultados
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {metrics.map((metric, i) => (
                      <div key={i} className="text-center p-3 bg-conexus-cyan/[0.06] border border-conexus-cyan/15 rounded-xl">
                        <div className="font-outfit text-2xl font-bold text-conexus-cyan leading-none mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-conexus-text-muted leading-tight">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="card-glass p-5">
                  <h3 className="font-outfit font-semibold mb-3 text-sm uppercase tracking-wider text-conexus-text-muted flex items-center gap-2">
                    <Tag size={13} />
                    Tecnologias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-conexus-text-secondary border border-conexus-dark-border px-3 py-1 rounded-full bg-white/[0.02]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="card-glass p-5 text-center border-conexus-cyan/20">
                <p className="text-sm text-conexus-text-secondary mb-4">
                  Precisa de uma solução similar?
                </p>
                <a href="/#contato" className="btn-primary w-full justify-center text-sm py-2.5">
                  Falar com a Conexus
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="section-container pb-16">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-conexus-text-muted hover:text-conexus-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao portfólio
          </Link>
        </div>
      </article>
    </>
  );
}
