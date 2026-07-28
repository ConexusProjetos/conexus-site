import { cache } from "react";
import { createPublicCaller } from "@/lib/trpc/server";

export type NavService = {
  title: string;
  slug: string;
  icon: string | null;
};

/**
 * Fallback usado quando o banco está indisponível (ex.: build Docker sem DB).
 * Slugs iguais aos do seed para que as âncoras /#slug funcionem nos dois casos.
 */
const FALLBACK_SERVICES: NavService[] = [
  { title: "Controle de Estoque", slug: "controle-de-estoque", icon: "boxes" },
  { title: "Sistemas Internos", slug: "sistemas-internos", icon: "monitor" },
  { title: "Dashboards e Relatórios", slug: "dashboards-e-relatorios", icon: "bar-chart" },
  { title: "Automação de Tarefas", slug: "automacao-de-tarefas", icon: "settings" },
  { title: "Integrações", slug: "integracoes", icon: "integration" },
];

/**
 * Serviços ATIVOS do banco, no formato usado pela navegação (menu dropdown e
 * rodapé). Uma única consulta por request (React cache), compartilhada entre
 * layout e rodapé. Sempre reflete o que está publicado: serviço desativado no
 * admin some daqui também.
 */
export const getServicesNav = cache(async (): Promise<NavService[]> => {
  try {
    const trpc = await createPublicCaller();
    const services = await trpc.services.list();
    if (services.length === 0) return FALLBACK_SERVICES;
    return services.map((s) => ({
      title: s.title,
      slug: s.slug,
      icon: s.icon ?? null,
    }));
  } catch {
    return FALLBACK_SERVICES;
  }
});
