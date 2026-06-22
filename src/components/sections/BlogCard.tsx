import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  categoryColor?: string | null;
  authorName?: string | null;
  publishedAt?: Date | string | null;
  readTimeMinutes?: number | null;
  isFeatured?: boolean;
  className?: string;
};

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  categoryName,
  categoryColor,
  authorName,
  publishedAt,
  readTimeMinutes,
  isFeatured,
  className,
}: BlogCardProps) {
  return (
    <article
      className={cn("cnx-card cnx-card-hover group flex flex-col overflow-hidden", className)}
      style={isFeatured ? { borderColor: "rgba(47, 68, 159,0.25)" } : undefined}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${slug}`}
        className="block overflow-hidden aspect-video flex-shrink-0"
        style={{ background: "var(--cnx-bg-subtle)" }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(47, 68, 159,0.05)" }}>
            <div className="font-outfit text-4xl font-bold select-none cnx-grad-text opacity-30">
              {title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {categoryName && (
          <span
            className="text-xs font-semibold uppercase tracking-wider mb-3 w-fit"
            style={{ color: categoryColor ?? "#2f449f" }}
          >
            {categoryName}
          </span>
        )}

        <h2 className="font-outfit text-lg font-semibold leading-snug mb-2" style={{ color: "var(--cnx-ink)" }}>
          <Link href={`/blog/${slug}`} className="line-clamp-2 hover:opacity-70 transition-opacity">
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="text-sm cnx-body leading-relaxed mb-4 line-clamp-3 flex-1">{excerpt}</p>
        )}

        <div className="flex items-center gap-4 mt-auto pt-4 border-t text-xs cnx-muted" style={{ borderColor: "var(--cnx-line)" }}>
          {publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} aria-hidden="true" />
              {formatDate(publishedAt, { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          )}
          {readTimeMinutes && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} aria-hidden="true" />
              {readTimeMinutes} min
            </span>
          )}
          {authorName && <span className="ml-auto truncate">{authorName}</span>}
        </div>
      </div>
    </article>
  );
}
