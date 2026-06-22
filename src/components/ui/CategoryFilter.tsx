"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  categories: Category[];
  paramKey?: string;
  allLabel?: string;
  className?: string;
};

/**
 * Pill-style category filter.
 * Updates URL search params on click - works with SSR because the parent
 * page reads `searchParams` server-side and re-renders the filtered list.
 */
export function CategoryFilter({
  categories,
  paramKey = "categoria",
  allLabel = "Todos",
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(paramKey) ?? "";

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set(paramKey, slug);
    } else {
      params.delete(paramKey);
    }
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const pills = [{ id: 0, name: allLabel, slug: "" }, ...categories];

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Filtrar por categoria">
      {pills.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => select(cat.slug)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
              isActive ? "text-white" : "cnx-body hover:opacity-80"
            )}
            style={
              isActive
                ? { background: "var(--cnx-grad)", borderColor: "transparent", boxShadow: "0 8px 18px -10px rgba(47, 68, 159,0.5)" }
                : { background: "#fff", borderColor: "var(--cnx-line)" }
            }
            aria-pressed={isActive}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
