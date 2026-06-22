"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  paramKey?: string;
};

export function Pagination({ currentPage, totalPages, paramKey = "pagina" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete(paramKey);
    else params.set(paramKey, String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const navBtn = "border bg-white cnx-body hover:opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginação">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn("p-2 rounded-lg", navBtn)}
        style={{ borderColor: "var(--cnx-line)" }}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) =>
        page === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 cnx-muted text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={cn("w-9 h-9 rounded-lg text-sm font-medium border transition-all", page === currentPage ? "text-white" : navBtn)}
            style={page === currentPage ? { background: "var(--cnx-grad)", borderColor: "transparent" } : { borderColor: "var(--cnx-line)" }}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn("p-2 rounded-lg", navBtn)}
        style={{ borderColor: "var(--cnx-line)" }}
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
