import Link from "next/link";
import { ConexusLogo } from "@/components/redesign/ConexusLogo";

const SERVICES_LINKS = [
  { label: "Controle de Estoque", href: "/#servicos" },
  { label: "Sistemas Internos", href: "/#servicos" },
  { label: "Dashboards", href: "/#servicos" },
  { label: "Automação de Tarefas", href: "/#servicos" },
  { label: "Integrações", href: "/#servicos" },
];

const COMPANY_LINKS = [
  { label: "Como funciona", href: "/#processo" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Fale conosco", href: "/#contato" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="cnx-subtle border-t"
      style={{ borderColor: "var(--cnx-line)" }}
      role="contentinfo"
    >
      <div className="section-container py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex mb-4 w-fit" aria-label="Conexus">
              <ConexusLogo className="h-7 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs cnx-muted">
              Software sob medida para pequenas e médias empresas do Ceará,
              construído por uma equipe estruturada de produto, engenharia, QA
              e dados.
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/5585985353536"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm cnx-body hover:opacity-80 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (85) 9 8535-3536
              </a>
              <a
                href="mailto:contato@conexus.com.br"
                className="text-sm cnx-body hover:opacity-80 transition-opacity"
              >
                contato@conexus.com.br
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 cnx-muted">Serviços</h3>
            <ul className="flex flex-col gap-2">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm cnx-body hover:opacity-80 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 cnx-muted">Empresa</h3>
            <ul className="flex flex-col gap-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm cnx-body hover:opacity-80 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA box */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 cnx-muted">Pronto para começar?</h3>
            <p className="text-sm leading-relaxed mb-4 cnx-body">
              Diagnóstico gratuito do seu processo. Proposta em 48h.
            </p>
            <a href="/#contato" className="cnx-btn cnx-btn-primary text-sm py-2.5 px-5 w-full">
              Solicitar diagnóstico
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs cnx-muted"
          style={{ borderColor: "var(--cnx-line)" }}
        >
          <p>© {year} Conexus Tecnologia. Todos os direitos reservados.</p>
          <p>Fortaleza, Ceará - Brasil</p>
        </div>
      </div>
    </footer>
  );
}
