const STEPS = [
  {
    number: "01",
    title: "Diagnóstico",
    description:
      "Uma reunião de 30 a 60 minutos para entendermos seu problema a fundo. Sem jargão técnico, sem compromisso. Só conversa.",
    detail: "Reunião online ou presencial em Fortaleza",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Proposta",
    description:
      "Em até 48 horas você recebe uma proposta clara: o que será desenvolvido, quanto custa e em quanto tempo entregamos.",
    detail: "Proposta válida por 10 dias corridos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Desenvolvimento",
    description:
      "Após a aprovação e a entrada de 50%, desenvolvemos com atualizações semanais. Você acompanha cada etapa.",
    detail: "Atualizações semanais via WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Entrega e Suporte",
    description:
      "Demonstração completa, treinamento do seu time e coleta de feedback. Seguimos com manutenção mensal, se quiser.",
    detail: "Check-in 15 dias após a entrega",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export function ProcessSection() {
  return (
    <section id="processo" className="cnx-section" aria-label="Como funciona">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="cnx-eyebrow mb-5"><span className="dot" />Do problema à solução</span>
          <h2 className="cnx-h2 mb-4 max-w-2xl mx-auto">
            Um processo simples que{" "}
            <span className="cnx-grad-text">realmente funciona</span>
          </h2>
          <p className="cnx-body max-w-xl mx-auto">
            Do primeiro contato até a entrega, você sabe exatamente o que
            esperar, e quando esperar.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(to right, transparent, var(--cnx-blue), var(--cnx-teal), transparent)", opacity: 0.35 }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border flex items-center justify-center mb-5" style={{ borderColor: "rgba(47, 68, 159,0.3)", boxShadow: "var(--cnx-shadow-sm)", color: "var(--cnx-blue)" }}>
                  {step.icon}
                </div>
                <span className="text-xs font-mono mb-2 tracking-widest" style={{ color: "var(--cnx-teal)" }}>
                  {step.number}
                </span>
                <h3 className="font-outfit text-xl font-semibold mb-3" style={{ color: "var(--cnx-ink)" }}>
                  {step.title}
                </h3>
                <p className="cnx-body text-sm leading-relaxed mb-3">{step.description}</p>
                <span className="cnx-chip text-xs">
                  <span className="cnx-chip-dot" />
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contato" className="cnx-btn cnx-btn-primary">Iniciar diagnóstico gratuito</a>
          <p className="text-sm cnx-muted">Sem compromisso, sem custo.</p>
        </div>
      </div>
    </section>
  );
}
