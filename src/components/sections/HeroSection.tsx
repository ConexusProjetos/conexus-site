import { ArrowRight, Boxes, LayoutDashboard, Workflow, Plug, Database } from "lucide-react";

const TEAM = [
  { initials: "K", from: "#2f449f", to: "#21a9d2" },
  { initials: "G", from: "#21a9d2", to: "#2790c4" },
  { initials: "E", from: "#2790c4", to: "#1fafb0" },
  { initials: "A", from: "#2f449f", to: "#1fafb0" },
  { initials: "W", from: "#263a86", to: "#21a9d2" },
  { initials: "Gl", from: "#21a9d2", to: "#1fafb0" },
  { initials: "N", from: "#2790c4", to: "#23bcc0" },
];

const CAPABILITIES = [
  { label: "Controle de estoque", icon: Boxes },
  { label: "Sistemas internos", icon: Workflow },
  { label: "Dashboards & BI", icon: LayoutDashboard },
  { label: "Automações", icon: Database },
  { label: "Integrações", icon: Plug },
];

function Orbit() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cnxHeroG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f449f" />
          <stop offset="55%" stopColor="#21a9d2" />
          <stop offset="100%" stopColor="#1fafb0" />
        </linearGradient>
        <filter id="cnxHeroGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="cnx-orbit">
        <ellipse className="cnx-draw" cx="300" cy="300" rx="250" ry="150" stroke="url(#cnxHeroG)" strokeWidth="1.6" strokeOpacity="0.85" transform="rotate(-18 300 300)" />
        <ellipse cx="300" cy="300" rx="250" ry="150" stroke="url(#cnxHeroG)" strokeWidth="1" strokeOpacity="0.25" transform="rotate(42 300 300)" />
      </g>
      <g className="cnx-orbit-rev">
        <ellipse className="cnx-draw" cx="300" cy="300" rx="180" ry="180" stroke="url(#cnxHeroG)" strokeWidth="1.3" strokeOpacity="0.5" />
      </g>
      <circle cx="300" cy="300" r="9" fill="url(#cnxHeroG)" filter="url(#cnxHeroGlow)" />
      <circle cx="300" cy="300" r="74" stroke="url(#cnxHeroG)" strokeWidth="1" strokeOpacity="0.35" />
      {[[300, 150, 0.6], [520, 360, 0.9], [110, 250, 1.1], [300, 480, 1.3], [470, 230, 1.5], [150, 420, 1.7]].map(([cx, cy, d], i) => (
        <circle key={i} className="cnx-node" cx={cx} cy={cy} r={i % 2 ? 4 : 6} fill="url(#cnxHeroG)" filter="url(#cnxHeroGlow)" style={{ animationDelay: `${d}s` }} />
      ))}
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-label="Apresentação">
      {/* Fundo: gradiente suave + grão + órbita (assinatura da marca). Sem grade. */}
      <div className="cnx-mesh" />
      <div className="cnx-grain" />

      {/* Órbita (glow atrás do visual, lado direito) */}
      <div className="pointer-events-none absolute -right-[10%] -top-[8%] w-[640px] h-[640px] max-w-[80vw] opacity-50 hidden lg:block">
        <Orbit />
      </div>

      <div className="section-container relative z-10 pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Esquerda: conteúdo */}
          <div>
            <div className="cnx-eyebrow mb-7">
              <span className="dot" />
              Tecnologia para PMEs · Fortaleza, CE
            </div>

            <h1 className="cnx-display mb-7">
              A sua operação,{" "}
              <span className="cnx-grad-text">conectada</span> e sob controle.
            </h1>

            <p className="cnx-lead max-w-xl mb-10">
              Construímos software sob medida (controle de estoque, sistemas
              internos, dashboards e automações) com uma equipe estruturada de
              produto, engenharia, QA e dados. Sem template, sem contrato longo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
              <a href="#contato" className="cnx-btn cnx-btn-primary">
                Quero uma solução
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="#servicos" className="cnx-btn cnx-btn-ghost">
                Ver o que fazemos
              </a>
            </div>

            {/* Prova: time real + capacidades */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3.5">
                <div className="flex">
                  {TEAM.map((m, i) => (
                    <div key={i} className="cnx-ava" style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})` }}>
                      {m.initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm cnx-muted">
                  Equipe estruturada · Produto · Engenharia · QA · Dados/BI
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {CAPABILITIES.map(({ label, icon: Icon }) => (
                  <span key={label} className="cnx-chip">
                    <Icon size={14} style={{ color: "var(--cnx-blue)" }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Direita: visual de produto (desktop) */}
          <div className="relative hidden lg:block">
            <div
              className="absolute -inset-8 rounded-[2.5rem]"
              aria-hidden="true"
              style={{ background: "radial-gradient(60% 60% at 65% 35%, rgba(33,169,210,0.20), transparent 70%)" }}
            />
            <div
              className="relative rounded-2xl overflow-hidden border bg-white"
              style={{ borderColor: "var(--cnx-line)", boxShadow: "var(--cnx-shadow-lg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/dashboard.webp"
                alt="Painel de indicadores aberto em um laptop, em um escritório"
                className="w-full block"
                style={{ aspectRatio: "4 / 5", objectFit: "cover" }}
                loading="eager"
              />
            </div>

            {/* Chip flutuante */}
            <div className="absolute -left-5 bottom-7 cnx-card px-3.5 py-2.5 flex items-center gap-2.5" style={{ boxShadow: "var(--cnx-shadow)" }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(47, 68, 159, 0.08)", color: "var(--cnx-blue)" }}>
                <LayoutDashboard size={16} />
              </span>
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--cnx-ink)" }}>Indicadores em tempo real</div>
                <div className="text-[11px] cnx-muted">sem planilha manual</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
