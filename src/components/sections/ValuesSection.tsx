import { MessagesSquare, Target, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const VALUES = [
  {
    icon: MessagesSquare,
    title: "Clareza",
    description:
      "Falamos a língua do cliente, sem jargão técnico desnecessário. Você entende tudo que estamos construindo.",
  },
  {
    icon: Target,
    title: "Resultado",
    description:
      "Entregamos soluções que funcionam na prática, não apenas no papel. O sucesso se mede no dia a dia do cliente.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilidade",
    description:
      "Cumprimos prazos e assumimos o que prometemos. Se surgir algo, comunicamos antes de atrasar.",
  },
  {
    icon: Sparkles,
    title: "Simplicidade",
    description:
      "O melhor sistema é o que o cliente consegue usar. Não complicamos o que pode ser simples.",
  },
  {
    icon: TrendingUp,
    title: "Crescimento conjunto",
    description:
      "Nosso sucesso é consequência do sucesso do cliente. Crescemos juntos: essa é a única forma que faz sentido.",
  },
];

export function ValuesSection() {
  return (
    <section id="valores" className="cnx-section cnx-subtle" aria-label="Nossos valores">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="cnx-eyebrow mb-5"><span className="dot" />O que nos guia</span>
            <h2 className="cnx-h2 mb-6">
              Princípios que definem{" "}
              <span className="cnx-grad-text">como trabalhamos</span>
            </h2>
            <p className="cnx-body leading-relaxed mb-8">
              Não somos uma fábrica de software genérico. Somos parceiros
              tecnológicos que falam o idioma do dono do negócio e entregam
              soluções que o time consegue usar no dia a dia.
            </p>

            <blockquote className="pl-5 py-1" style={{ borderLeft: "2px solid var(--cnx-teal)" }}>
              <p className="text-lg font-outfit italic" style={{ color: "var(--cnx-ink)" }}>
                &ldquo;Economizamos seu tempo, organizamos sua operação e
                eliminamos o erro manual.&rdquo;
              </p>
              <footer className="mt-2 text-sm cnx-muted">
                Conexus, declaração de posicionamento
              </footer>
            </blockquote>
          </div>

          {/* Right: values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className={`cnx-card p-5 ${i === 4 ? "sm:col-span-2 sm:max-w-xs sm:mx-auto w-full" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(47, 68, 159,0.08)", color: "var(--cnx-blue)" }}
                      aria-hidden="true"
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-outfit font-semibold mb-1.5" style={{ color: "var(--cnx-ink)" }}>
                        {value.title}
                      </h3>
                      <p className="cnx-body text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
