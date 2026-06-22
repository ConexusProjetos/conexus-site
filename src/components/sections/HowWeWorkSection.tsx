import { Check } from "lucide-react";

const PILLARS = [
  { title: "Produto e Negócios", desc: "Traduz o seu problema em requisitos claros antes de uma linha de código." },
  { title: "Engenharia (back e front)", desc: "Constrói o sistema sob medida, com foco em uso real no dia a dia." },
  { title: "Qualidade (QA)", desc: "Testa e valida cada entrega — uma rede de segurança antes de chegar a você." },
  { title: "Dados e BI", desc: "Transforma número em decisão: indicadores e relatórios que fazem sentido." },
];

export function HowWeWorkSection() {
  return (
    <section id="sobre" className="cnx-section cnx-subtle" aria-label="Quem está por trás">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagem */}
          <div className="relative order-2 lg:order-1">
            <div
              className="absolute -inset-6 rounded-[2.5rem]"
              aria-hidden="true"
              style={{ background: "radial-gradient(60% 60% at 40% 40%, rgba(47,68,159,0.14), transparent 70%)" }}
            />
            <div className="relative rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "var(--cnx-line)", boxShadow: "var(--cnx-shadow-lg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/team.webp"
                alt="Equipe da Conexus analisando indicadores e relatórios em uma mesa de trabalho"
                className="w-full block"
                style={{ aspectRatio: "16 / 11", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <span className="cnx-eyebrow mb-5"><span className="dot" />Quem está por trás</span>
            <h2 className="cnx-h2 mb-5">
              Uma equipe estruturada,{" "}
              <span className="cnx-grad-text">não um freelancer</span>
            </h2>
            <p className="cnx-body leading-relaxed mb-8">
              Na Conexus, cada projeto passa por áreas com responsáveis de
              verdade — produto, engenharia, qualidade e dados — coordenadas por
              um conselho de direção. É isso que garante que a solução seja
              pensada, construída, testada e medida. Sem improviso.
            </p>

            <ul className="flex flex-col gap-4 mb-8">
              {PILLARS.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: "linear-gradient(135deg, var(--cnx-blue), var(--cnx-teal))" }}
                    aria-hidden="true"
                  >
                    <Check size={13} />
                  </span>
                  <span className="text-sm">
                    <strong style={{ color: "var(--cnx-ink)" }}>{p.title}.</strong>{" "}
                    <span className="cnx-body">{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a href="#contato" className="cnx-btn cnx-btn-primary">Falar com a equipe</a>
          </div>
        </div>
      </div>
    </section>
  );
}
