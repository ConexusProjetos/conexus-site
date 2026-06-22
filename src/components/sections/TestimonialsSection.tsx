import { createServerCaller } from "@/lib/trpc/server";
import type { Testimonial } from "@/server/db/schema";
import { Star, Target } from "lucide-react";

// Fallback - Herbênia S. (mostrado até o banco ter dados)
const STATIC_TESTIMONIALS: Partial<Testimonial>[] = [
  {
    id: 1,
    authorName: "Herbênia S.",
    authorRole: "Diretora",
    authorCompany: "ONG local, Fortaleza",
    content:
      "A Conexus transformou nossa gestão. Antes perdíamos horas em planilhas, agora tudo é automático. Em menos de uma semana já estávamos usando o sistema. Recomendo muito!",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} estrelas de 5`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-amber-400 fill-amber-400" : ""}
          style={i < rating ? undefined : { color: "var(--cnx-line)" }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Partial<Testimonial> }) {
  const initials = (t.authorName ?? "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <figure className="cnx-card p-7 flex flex-col">
      <div className="mb-4">
        <StarRating rating={t.rating ?? 5} />
      </div>

      <blockquote className="flex-1">
        <p className="cnx-body text-sm leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
      </blockquote>

      <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: "var(--cnx-line)" }}>
        {t.authorAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.authorAvatarUrl} alt={t.authorName ?? ""} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white"
            style={{ background: "linear-gradient(135deg, var(--cnx-blue), var(--cnx-teal))" }}
          >
            {initials}
          </div>
        )}
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--cnx-ink)" }}>{t.authorName}</div>
          {(t.authorRole || t.authorCompany) && (
            <div className="text-xs cnx-muted">
              {[t.authorRole, t.authorCompany].filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export async function TestimonialsSection() {
  let testimonials: Partial<Testimonial>[] = STATIC_TESTIMONIALS;
  try {
    const trpc = await createServerCaller();
    const db = await trpc.testimonials.list();
    if (db.length > 0) testimonials = db;
  } catch {
    // Use static fallback
  }

  return (
    <section id="depoimentos" className="cnx-section" aria-label="Depoimentos de clientes">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="cnx-eyebrow mb-5"><span className="dot" />Quem já usa</span>
          <h2 className="cnx-h2 mb-4 max-w-2xl mx-auto">
            Clientes que{" "}
            <span className="cnx-grad-text">confiam na Conexus</span>
          </h2>
          <p className="cnx-body max-w-lg mx-auto">
            Resultados reais de empresas que resolveram seus problemas
            operacionais com a nossa ajuda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}

          {/* "Be the next" card */}
          <div
            className="cnx-card p-7 flex flex-col items-center justify-center text-center"
            style={{ borderStyle: "dashed" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(47, 68, 159,0.07)", color: "var(--cnx-blue)" }}
            >
              <Target size={22} aria-hidden="true" />
            </div>
            <h3 className="font-outfit font-semibold mb-2" style={{ color: "var(--cnx-ink)" }}>Seu case aqui</h3>
            <p className="cnx-body text-sm mb-5">
              Resolva seu problema operacional e compartilhe o resultado com
              outras empresas.
            </p>
            <a href="#contato" className="cnx-btn cnx-btn-primary text-sm py-2 px-5">Começar agora</a>
          </div>
        </div>
      </div>
    </section>
  );
}
