/**
 * Logotipo Conexus — artwork oficial da marca (multicolor), com viewBox já
 * recortado em public/brand/logo-mark.svg. Usado no Header/Footer.
 * Mantém a API anterior (apenas `className`) para não mudar os callers.
 */
export function ConexusLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo-mark.svg" alt="Conexus" className={className} />
  );
}

/**
 * Mark compacto da Conexus — ícone de app (quadrado em gradiente + órbita branca).
 * Para espaços onde o wordmark não cabe: sidebar recolhida, login, header mobile.
 */
export function ConexusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Conexus" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cnxMarkG" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#2f449f" />
          <stop offset="55%" stopColor="#21a9d2" />
          <stop offset="100%" stopColor="#1fafb0" />
        </linearGradient>
      </defs>
      {/* Órbita da marca: swoosh elíptico aberto no gradiente azul→teal */}
      <ellipse
        cx="24" cy="24" rx="19.5" ry="11"
        fill="none" stroke="url(#cnxMarkG)" strokeWidth="3.4" strokeLinecap="round"
        strokeDasharray="70 30" transform="rotate(-18 24 24)"
      />
      {/* Núcleo (nexus) */}
      <circle cx="24" cy="24" r="4.2" fill="url(#cnxMarkG)" />
    </svg>
  );
}
