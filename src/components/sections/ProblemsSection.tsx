const PROBLEMS = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="rgba(47, 68, 159,0.08)" />
        <path d="M14 16h20M14 24h20M14 32h12" stroke="#2f449f" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 28l4 4-4 4" stroke="#1fafb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Planilhas que tomam horas",
    description:
      "Sua equipe perde tempo precioso atualizando planilhas manualmente, cometendo erros e retrabalho que poderiam ser automatizados.",
    example: "Ex: controle de estoque, relatórios mensais, cobranças.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="rgba(47, 68, 159,0.08)" />
        <rect x="10" y="14" width="12" height="20" rx="2" stroke="#2f449f" strokeWidth="2" />
        <rect x="26" y="14" width="12" height="20" rx="2" stroke="#1fafb0" strokeWidth="2" />
        <path d="M22 24h4" stroke="#21a9d2" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Sistemas que não se falam",
    description:
      "Seu e-commerce não conversa com o financeiro, o CRM não atualiza o estoque. Cada área trabalha numa ilha de informação.",
    example: "Ex: loja online + ERP + WhatsApp + financeiro separados.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="rgba(47, 68, 159,0.08)" />
        <circle cx="24" cy="20" r="6" stroke="#2f449f" strokeWidth="2" />
        <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#1fafb0" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 14l4-4M34 14l-4-4" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Falta de histórico e controle",
    description:
      "Você não sabe quem comprou o quê, quando um produto acabou, ou quanto de fato foi faturado no mês. A informação existe, mas não está organizada.",
    example: "Ex: histórico de clientes, giro de estoque, fluxo de caixa.",
  },
];

export function ProblemsSection() {
  return (
    <section id="problemas" className="cnx-section cnx-subtle" aria-label="Problemas que resolvemos">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-14">
          <div>
            <span className="cnx-eyebrow mb-5"><span className="dot" />Você se identifica?</span>
            <h2 className="cnx-h2 mb-4">
              Problemas que custam tempo e dinheiro{" "}
              <span className="cnx-grad-text">todo dia</span>
            </h2>
            <p className="cnx-body max-w-xl">
              Se você reconhece algum desses cenários, a Conexus pode resolver.
              Rápido, sem jargão técnico, sem contratos longos.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "var(--cnx-line)", boxShadow: "var(--cnx-shadow)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/spreadsheet.webp"
                alt="Planilha cheia de dados e gráficos aberta em um laptop"
                className="w-full block"
                style={{ aspectRatio: "16 / 10", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map((problem, i) => (
            <div key={i} className="cnx-card cnx-card-hover p-7">
              <div className="mb-5">{problem.icon}</div>
              <h3 className="font-outfit text-xl font-semibold mb-3" style={{ color: "var(--cnx-ink)" }}>
                {problem.title}
              </h3>
              <p className="cnx-body text-sm leading-relaxed mb-4">{problem.description}</p>
              <p className="text-xs cnx-muted italic">{problem.example}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="cnx-body mb-4">
            A Conexus transforma esses problemas em soluções que o seu time
            consegue usar no dia a dia.
          </p>
          <a href="#servicos" className="cnx-btn cnx-btn-primary inline-flex">
            Ver como resolvemos →
          </a>
        </div>
      </div>
    </section>
  );
}
