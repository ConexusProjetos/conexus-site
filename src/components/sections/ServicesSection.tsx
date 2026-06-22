import { createServerCaller } from "@/lib/trpc/server";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/server/db/schema";
import { ServiceIcon } from "@/lib/service-icons";
import { ArrowRight } from "lucide-react";

// Fallback static services in case DB is empty (before seed runs)
const STATIC_SERVICES: Partial<Service>[] = [
  {
    id: 1,
    title: "Controle de Estoque",
    icon: "boxes",
    shortDescription: "Nunca perca um produto ou duplique um registro.",
    features: ["Cadastro com categorias e variações", "Entradas/saídas com histórico", "Alertas de estoque mínimo", "Relatórios de movimentação"],
    basePriceCents: 80000,
    monthlyPriceCents: 15000,
  },
  {
    id: 2,
    title: "Sistemas Internos",
    icon: "monitor",
    shortDescription: "CRM, pedidos e tarefas sob medida para o seu time.",
    features: ["CRM para clientes e contatos", "Gestão de pedidos e orçamentos", "Controle de tarefas internas", "Módulo de agendamentos"],
    basePriceCents: 120000,
    monthlyPriceCents: 20000,
  },
  {
    id: 3,
    title: "Dashboards Inteligentes",
    icon: "bar-chart",
    shortDescription: "Seus dados em tempo real, sem planilhas manuais.",
    features: ["Conexão com dados existentes", "Indicadores em tempo real", "Relatórios automáticos", "Exportação PDF/Excel"],
    basePriceCents: 60000,
    monthlyPriceCents: 10000,
  },
  {
    id: 4,
    title: "Automação de Tarefas",
    icon: "settings",
    shortDescription: "Libere sua equipe do trabalho repetitivo.",
    features: ["Envio automático de e-mail/WhatsApp", "Geração de documentos", "Importação automática de dados", "Backup e sincronização"],
    basePriceCents: 50000,
    monthlyPriceCents: 8000,
  },
  {
    id: 5,
    title: "Integrações",
    icon: "integration",
    shortDescription: "Seus sistemas conversando, sem esforço manual.",
    features: ["E-commerce + financeiro", "ERP + ferramentas externas", "Sincronização de plataformas", "APIs customizadas"],
    basePriceCents: 70000,
    monthlyPriceCents: 12000,
  },
];

function ServiceCard({ service }: { service: Partial<Service> }) {
  const features = (service.features ?? []) as string[];
  const base = service.basePriceCents
    ? `A partir de ${formatCurrency(service.basePriceCents)}`
    : "Sob consulta";
  const monthly = service.monthlyPriceCents
    ? `${formatCurrency(service.monthlyPriceCents)}/mês`
    : null;

  return (
    <article className="cnx-card cnx-card-hover p-7 flex flex-col">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(47, 68, 159,0.07)", color: "var(--cnx-blue)" }}
      >
        <ServiceIcon icon={service.icon} size={22} />
      </div>

      <h3 className="font-outfit text-xl font-semibold mb-2" style={{ color: "var(--cnx-ink)" }}>
        {service.title}
      </h3>

      {service.shortDescription && (
        <p className="cnx-body text-sm mb-5">{service.shortDescription}</p>
      )}

      <ul className="flex flex-col gap-2 mb-6 flex-1" role="list">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm cnx-body">
            <span
              className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "rgba(31, 175, 176,0.12)", border: "1px solid rgba(31, 175, 176,0.35)" }}
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--cnx-teal)" }} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 mt-auto" style={{ borderColor: "var(--cnx-line)" }}>
        <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--cnx-blue)" }}>{base}</div>
        {monthly && <div className="text-xs cnx-muted">Manutenção: {monthly}</div>}
      </div>
    </article>
  );
}

export async function ServicesSection() {
  let services: Partial<Service>[] = STATIC_SERVICES;
  try {
    const trpc = await createServerCaller();
    const dbServices = await trpc.services.list();
    if (dbServices.length > 0) services = dbServices;
  } catch {
    // DB not ready yet - use static fallback
  }

  return (
    <section id="servicos" className="cnx-section" aria-label="Serviços">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="cnx-eyebrow mb-5"><span className="dot" />O que entregamos</span>
          <h2 className="cnx-h2 mb-4 max-w-2xl mx-auto">
            Soluções sob medida,{" "}
            <span className="cnx-grad-text">sem tamanho único</span>
          </h2>
          <p className="cnx-body max-w-xl mx-auto">
            Para cada cliente, montamos um pacote baseado no problema real a
            ser resolvido. Você não compra código: você compra resultado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="cnx-body text-sm mb-4">
            Não sabe qual serviço se aplica ao seu caso?
          </p>
          <a href="#contato" className="cnx-btn cnx-btn-ghost inline-flex items-center gap-2">
            Fale com a gente e descobrimos juntos
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
