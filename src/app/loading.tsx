/**
 * Root-level loading UI.
 * Shown while the initial page chunk is loading (rare, but covers edge cases).
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-conexus-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo pulse */}
        <div className="w-10 h-10 rounded-xl bg-conexus-cyan animate-pulse" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-conexus-cyan/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
