/**
 * Ilustrações SVG da marca — line-art no gradiente azul→teal, tema órbita/nexus.
 * Reutilizáveis em estados vazios, 404 e acentos de seção (preencher vácuo visual).
 */

const STOPS = (
  <>
    <stop offset="0%" stopColor="#2f449f" />
    <stop offset="55%" stopColor="#21a9d2" />
    <stop offset="100%" stopColor="#1fafb0" />
  </>
);

/** "Conteúdo em órbita" — card aguardando conteúdo. Para estados vazios. */
export function EmptyStateArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 190" className={className} fill="none" role="img" aria-label="Ainda sem conteúdo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cnxIlloA" x1="0" y1="0" x2="1" y2="1">{STOPS}</linearGradient>
        <filter id="cnxIlloShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b1020" floodOpacity="0.12" />
        </filter>
      </defs>
      <ellipse cx="130" cy="100" rx="112" ry="62" stroke="url(#cnxIlloA)" strokeWidth="1.4" strokeOpacity="0.3" transform="rotate(-12 130 100)" />
      <ellipse cx="130" cy="100" rx="86" ry="86" stroke="url(#cnxIlloA)" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="2 8" />
      <g filter="url(#cnxIlloShadow)">
        <rect x="94" y="52" width="72" height="92" rx="11" fill="#ffffff" stroke="url(#cnxIlloA)" strokeWidth="1.5" />
      </g>
      <rect x="104" y="62" width="52" height="30" rx="6" fill="url(#cnxIlloA)" fillOpacity="0.12" />
      <circle cx="119" cy="77" r="5" fill="url(#cnxIlloA)" fillOpacity="0.5" />
      <path d="M110 88l8-7 7 5 9-9 12 11" stroke="url(#cnxIlloA)" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="104" y="102" width="52" height="5" rx="2.5" fill="url(#cnxIlloA)" fillOpacity="0.55" />
      <rect x="104" y="113" width="38" height="5" rx="2.5" fill="#6b7488" fillOpacity="0.3" />
      <rect x="104" y="124" width="46" height="5" rx="2.5" fill="#6b7488" fillOpacity="0.25" />
      <g transform="translate(160 50)">
        <circle r="13" fill="#ffffff" stroke="url(#cnxIlloA)" strokeWidth="1.5" />
        <path d="M0 -6V6M-6 0H6" stroke="url(#cnxIlloA)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="34" cy="92" r="5" fill="url(#cnxIlloA)" />
      <circle cx="226" cy="116" r="4" fill="url(#cnxIlloA)" fillOpacity="0.8" />
      <circle cx="130" cy="14" r="3.5" fill="url(#cnxIlloA)" fillOpacity="0.7" />
      <circle cx="64" cy="160" r="3" fill="url(#cnxIlloA)" fillOpacity="0.6" />
    </svg>
  );
}

/** "Nó fora de órbita" — algo se perdeu. Para o 404. */
export function NotFoundArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 190" className={className} fill="none" role="img" aria-label="Página fora de órbita" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cnxIlloB" x1="0" y1="0" x2="1" y2="1">{STOPS}</linearGradient>
        <filter id="cnxIlloGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="120" cy="104" rx="104" ry="58" stroke="url(#cnxIlloB)" strokeWidth="1.5" strokeOpacity="0.4" transform="rotate(-10 120 104)" />
      <circle cx="120" cy="104" r="7" fill="url(#cnxIlloB)" filter="url(#cnxIlloGlow)" />
      <circle cx="120" cy="104" r="20" stroke="url(#cnxIlloB)" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="40" cy="120" r="5" fill="url(#cnxIlloB)" />
      <path d="M196 64 C 232 46, 244 34, 236 22" stroke="url(#cnxIlloB)" strokeWidth="1.4" strokeOpacity="0.55" strokeDasharray="2 7" strokeLinecap="round" />
      <g transform="translate(236 20)">
        <circle r="9" fill="url(#cnxIlloB)" filter="url(#cnxIlloGlow)" />
        <circle r="16" stroke="url(#cnxIlloB)" strokeWidth="1.2" strokeOpacity="0.45" />
      </g>
      <circle cx="60" cy="40" r="2" fill="url(#cnxIlloB)" fillOpacity="0.6" />
      <circle cx="206" cy="150" r="2.5" fill="url(#cnxIlloB)" fillOpacity="0.5" />
      <circle cx="150" cy="166" r="1.8" fill="url(#cnxIlloB)" fillOpacity="0.5" />
    </svg>
  );
}

/** Nexus de nós conectados — "vamos conversar / conectar". Para a seção de contato. */
export function ConnectionArt({ className }: { className?: string }) {
  const sats: [number, number, number][] = [
    [42, 44, 9],
    [206, 52, 8],
    [34, 138, 7],
    [212, 140, 9],
    [120, 18, 6],
  ];
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" role="img" aria-label="Conexão entre pessoas e sistemas" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cnxIlloC" x1="0" y1="0" x2="1" y2="1">{STOPS}</linearGradient>
        <filter id="cnxIlloCglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="120" cy="92" rx="98" ry="72" stroke="url(#cnxIlloC)" strokeWidth="1.2" strokeOpacity="0.22" transform="rotate(-8 120 92)" />
      {/* Links centro -> satélites */}
      {sats.map(([x, y], i) => (
        <line key={i} x1="120" y1="92" x2={x} y2={y} stroke="url(#cnxIlloC)" strokeWidth="1.3" strokeOpacity="0.4" />
      ))}
      {/* Satélites */}
      {sats.map(([x, y, r], i) => (
        <g key={`s${i}`}>
          <circle cx={x} cy={y} r={r + 4} fill="#ffffff" stroke="url(#cnxIlloC)" strokeWidth="1.3" />
          <circle cx={x} cy={y} r={r - 3} fill="url(#cnxIlloC)" fillOpacity="0.6" />
        </g>
      ))}
      {/* Hub central */}
      <circle cx="120" cy="92" r="26" fill="#ffffff" stroke="url(#cnxIlloC)" strokeWidth="1.6" />
      <circle cx="120" cy="92" r="11" fill="url(#cnxIlloC)" filter="url(#cnxIlloCglow)" />
      <circle cx="120" cy="92" r="38" stroke="url(#cnxIlloC)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 7" />
    </svg>
  );
}

/** Trajetória ascendente — "seu projeto aqui / vamos crescer". Para CTAs. */
export function GrowthArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 170" className={className} fill="none" role="img" aria-label="Trajetória de crescimento" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cnxIlloD" x1="0" y1="1" x2="1" y2="0">{STOPS}</linearGradient>
        <filter id="cnxIlloDglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Barras de crescimento */}
      {[[40, 110, 28], [70, 92, 46], [100, 72, 66]].map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width="20" height={h} rx="5" fill="url(#cnxIlloD)" fillOpacity={0.18 + i * 0.12} />
      ))}
      {/* Trajetória */}
      <path d="M30 138 C 96 132, 150 104, 206 36" stroke="url(#cnxIlloD)" strokeWidth="1.8" strokeLinecap="round" />
      {/* pontos na trajetória */}
      <circle cx="96" cy="124" r="3" fill="url(#cnxIlloD)" />
      <circle cx="150" cy="98" r="3" fill="url(#cnxIlloD)" />
      {/* nó no topo (alvo) */}
      <g transform="translate(206 36)">
        <circle r="10" fill="url(#cnxIlloD)" filter="url(#cnxIlloDglow)" />
        <circle r="18" stroke="url(#cnxIlloD)" strokeWidth="1.2" strokeOpacity="0.4" />
      </g>
      {/* faísca */}
      <path d="M220 18l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="url(#cnxIlloD)" fillOpacity="0.8" />
    </svg>
  );
}

/** Fundo da tela de login — apenas a aurora de gradiente da marca (limpo). */
export function LoginBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(40% 48% at 15% 10%, rgba(47,68,159,0.20), transparent 66%), radial-gradient(46% 54% at 86% 24%, rgba(31,175,176,0.20), transparent 66%), radial-gradient(64% 52% at 50% 112%, rgba(33,169,210,0.14), transparent 62%)",
      }}
    />
  );
}
