import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Metric = { label: string; value: string };

type ProjectCardProps = {
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  client?: string | null;
  clientSector?: string | null;
  categoryName?: string | null;
  tags?: string[];
  resultMetrics?: Metric[];
  isFeatured?: boolean;
  className?: string;
};

export function ProjectCard({
  slug,
  title,
  excerpt,
  imageUrl,
  client,
  clientSector,
  categoryName,
  tags = [],
  resultMetrics = [],
  isFeatured,
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn("cnx-card cnx-card-hover group overflow-hidden flex flex-col", className)}
      style={isFeatured ? { borderColor: "rgba(47, 68, 159,0.25)" } : undefined}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video flex-shrink-0" style={{ background: "var(--cnx-bg-subtle)" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(47, 68, 159,0.04)" }}>
            <div className="font-outfit text-5xl font-bold select-none cnx-grad-text opacity-25">
              {title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {categoryName && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-medium bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full border"
              style={{ color: "var(--cnx-blue)", borderColor: "rgba(47, 68, 159,0.2)" }}
            >
              {categoryName}
            </span>
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-medium text-white px-2.5 py-1 rounded-full" style={{ background: "var(--cnx-grad)" }}>
              Destaque
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {(client || clientSector) && (
          <p className="text-xs cnx-muted mb-2">
            {[client, clientSector].filter(Boolean).join(" · ")}
          </p>
        )}

        <h2 className="font-outfit text-lg font-semibold leading-snug mb-2" style={{ color: "var(--cnx-ink)" }}>
          {title}
        </h2>

        {excerpt && (
          <p className="text-sm cnx-body leading-relaxed mb-4 line-clamp-2 flex-1">{excerpt}</p>
        )}

        {resultMetrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {resultMetrics.slice(0, 4).map((metric, i) => (
              <div key={i} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(31, 175, 176,0.06)", border: "1px solid rgba(31, 175, 176,0.18)" }}>
                <div className="font-outfit text-lg font-bold leading-none mb-0.5" style={{ color: "var(--cnx-blue)" }}>
                  {metric.value}
                </div>
                <div className="text-[10px] cnx-muted leading-tight">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Tecnologias">
            {tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs cnx-muted border px-2 py-0.5 rounded-full" style={{ borderColor: "var(--cnx-line)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/portfolio/${slug}`}
          className="mt-auto flex items-center gap-1.5 text-sm font-medium group/link"
          style={{ color: "var(--cnx-blue)" }}
        >
          Ver case completo
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
