import type { Metadata } from "next";
import { Suspense } from "react";
import { createServerCaller } from "@/lib/trpc/server";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { getAbsoluteUrl } from "@/lib/utils";
import { EmptyStateArt, GrowthArt } from "@/components/illustrations/Illustrations";
import type { Project, ProjectCategory } from "@/server/db/schema";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Cases reais de sistemas, automações e dashboards entregues pela Conexus para pequenas e médias empresas no Ceará.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfólio - Conexus",
    description: "Cases reais entregues para pequenas e médias empresas.",
    url: getAbsoluteUrl("/portfolio"),
  },
};

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function PortfolioPage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const trpc = await createServerCaller();
  const [projects, categories] = await Promise.all([
    trpc.projects.list({ categorySlug: categoria, limit: 50 }).catch(() => []),
    trpc.projects.categories().catch(() => []),
  ]);

  const featured = projects.filter((p) => p.isFeatured);
  const rest = projects.filter((p) => !p.isFeatured);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfólio - Conexus",
            description: "Cases de projetos entregues pela Conexus Tecnologia.",
            url: getAbsoluteUrl("/portfolio"),
          }),
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 section-container">
        <span className="cnx-eyebrow mb-5"><span className="dot" />Resultados reais</span>
        <h1 className="cnx-display text-4xl md:text-5xl mb-4 max-w-2xl">
          Projetos que{" "}
          <span className="cnx-grad-text">transformaram operações</span>
        </h1>
        <p className="cnx-lead max-w-xl mb-8">
          Cada case aqui resolveu um problema real de uma empresa real.
          Sem enrolação, com resultado mensurável.
        </p>

        {/* Filter */}
        {categories.length > 0 && (
          <Suspense>
            <CategoryFilter categories={categories} paramKey="categoria" />
          </Suspense>
        )}
      </section>

      {/* Grid */}
      <section className="section-container pb-24">
        {projects.length === 0 ? (
          <div className="py-24 text-center">
            <EmptyStateArt className="w-44 sm:w-52 mx-auto mb-4" />
            <p className="cnx-body mb-2">
              Nenhum projeto encontrado
              {categoria ? ` na categoria "${categoria}"` : ""}.
            </p>
            {categoria && (
              <a href="/portfolio" className="text-sm hover:underline" style={{ color: "var(--cnx-blue)" }}>
                Ver todos os projetos →
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Featured projects - larger cards */}
            {featured.length > 0 && !categoria && (
              <div className="mb-10">
                <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-4">
                  Em destaque
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {featured.map((project) => (
                    <ProjectCard
                      key={project.id}
                      slug={project.slug}
                      title={project.title}
                      excerpt={project.excerpt}
                      imageUrl={project.imageUrl}
                      client={project.client}
                      clientSector={project.clientSector}
                      categoryName={project.category?.name}
                      tags={(project.tags ?? []) as string[]}
                      resultMetrics={(project.resultMetrics ?? []) as { label: string; value: string }[]}
                      isFeatured
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All other projects */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && !categoria && (
                  <p className="text-xs font-medium uppercase tracking-wider text-conexus-text-muted mb-4">
                    Todos os projetos
                  </p>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(categoria ? projects : rest).map((project) => (
                    <ProjectCard
                      key={project.id}
                      slug={project.slug}
                      title={project.title}
                      excerpt={project.excerpt}
                      imageUrl={project.imageUrl}
                      client={project.client}
                      clientSector={project.clientSector}
                      categoryName={project.category?.name}
                      tags={(project.tags ?? []) as string[]}
                      resultMetrics={(project.resultMetrics ?? []) as { label: string; value: string }[]}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA section */}
      <section className="section bg-conexus-dark-2">
        <div className="section-container text-center">
          <GrowthArt className="w-40 sm:w-48 mx-auto mb-6" />
          <h2 className="font-outfit text-3xl font-bold mb-4">
            Quer seu projeto aqui?
          </h2>
          <p className="text-conexus-text-secondary mb-8 max-w-md mx-auto">
            Diagnóstico gratuito para entender seu problema. Proposta em 48h.
          </p>
          <a href="/#contato" className="btn-primary inline-flex">
            Solicitar diagnóstico gratuito
          </a>
        </div>
      </section>
    </>
  );
}
