/**
 * Loading skeleton for all (public) routes.
 * Shown during SSR / navigation inside the public layout group.
 * Header and Footer are already rendered by the layout - this fills the <main> slot.
 */
export default function PublicLoading() {
  return (
    <div className="section-container py-32 animate-pulse" aria-hidden="true">
      {/* Hero skeleton */}
      <div className="max-w-3xl mb-16">
        <div className="h-4 w-28 bg-white/5 rounded-full mb-6" />
        <div className="h-12 bg-white/5 rounded-xl mb-3" />
        <div className="h-12 w-3/4 bg-white/5 rounded-xl mb-8" />
        <div className="h-5 bg-white/[0.04] rounded-lg mb-2 max-w-lg" />
        <div className="h-5 w-1/2 bg-white/[0.04] rounded-lg mb-10 max-w-md" />
        <div className="flex gap-3">
          <div className="h-11 w-36 bg-conexus-cyan/10 rounded-lg" />
          <div className="h-11 w-36 bg-white/[0.04] rounded-lg" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-conexus-dark-border overflow-hidden"
            style={{ opacity: 1 - i * 0.1 }}
          >
            <div className="aspect-video bg-white/[0.03]" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-white/[0.04] rounded-full" />
              <div className="h-5 bg-white/[0.06] rounded-lg" />
              <div className="h-5 w-4/5 bg-white/[0.04] rounded-lg" />
              <div className="h-4 w-2/3 bg-white/[0.03] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
