"use client";

import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-conexus-dark-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "Nenhum item encontrado.",
  emptyIcon,
  rowKey,
  onRowClick,
}: Props<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-conexus-dark-border">
      <table className="w-full text-sm min-w-[600px]">
        {/* Head */}
        <thead>
          <tr className="border-b border-conexus-dark-border bg-white/[0.02]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-medium text-conexus-text-muted text-xs uppercase tracking-wider",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-16 text-center text-conexus-text-muted">
                  {emptyIcon && <div className="mb-3 opacity-40">{emptyIcon}</div>}
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-conexus-dark-border last:border-0 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-white/[0.03]"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3.5 text-conexus-text-secondary align-top",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
