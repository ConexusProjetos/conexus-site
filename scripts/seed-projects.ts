/**
 * Seed de cases de exemplo no portfólio (idempotente via slug único).
 *   npx tsx scripts/seed-projects.ts
 * Usa as imagens otimizadas em /public/images.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../src/server/db/schema";
import { getSsl, usePreparedStatements } from "../src/server/db/options";

const url = process.env.DATABASE_URL!;
const connection = postgres(url, { max: 1, ssl: getSsl(url), prepare: usePreparedStatements(url) });
const db = drizzle(connection, { schema });

type CaseInput = {
  categorySlug: string;
  data: Omit<typeof schema.projects.$inferInsert, "categoryId">;
};

const CASES: CaseInput[] = [
  {
    categorySlug: "sistema-interno",
    data: {
      title: "PDV e agenda para um salão de beleza",
      slug: "pdv-salao-beleza",
      excerpt: "Agendamentos, comandas e caixa num sistema só — fim das anotações em papel.",
      description:
        "O salão controlava agenda, comandas e caixa em papel e planilhas, com retrabalho e furos no faturamento. Construímos um sistema interno sob medida: agendamento online com lembrete por WhatsApp, comanda digital por cliente, controle de profissionais e fechamento de caixa em poucos minutos. A equipe passou a operar tudo de um tablet no balcão.",
      client: "Studio de beleza (Fortaleza)",
      clientSector: "Beleza e estética",
      tags: ["Agendamento", "PDV", "Comandas", "WhatsApp"],
      imageUrl: "/images/pos.webp",
      resultMetrics: [
        { label: "no-show (faltas)", value: "-40%" },
        { label: "fechamento de caixa", value: "5 min" },
      ],
      isFeatured: true,
      isActive: true,
      completedAt: new Date("2026-03-18"),
      metaDescription: "Sistema de agenda, PDV e caixa sob medida para salão de beleza.",
    },
  },
  {
    categorySlug: "dashboard",
    data: {
      title: "Dashboard financeiro em tempo real",
      slug: "dashboard-financeiro",
      excerpt: "Fluxo de caixa, contas a pagar/receber e margem num painel único, atualizado sozinho.",
      description:
        "A diretoria fechava relatórios financeiros manualmente em planilhas, sempre atrasados e sujeitos a erro. Conectamos as fontes de dados existentes (banco, ERP e planilhas) num dashboard único: fluxo de caixa, contas a pagar e receber, margem por produto e indicadores do mês, tudo atualizado automaticamente e exportável em PDF.",
      client: "Distribuidora regional",
      clientSector: "Comércio atacadista",
      tags: ["Dashboard", "BI", "Financeiro", "Automação"],
      imageUrl: "/images/control.webp",
      resultMetrics: [
        { label: "tempo de relatório", value: "horas → min" },
        { label: "erros de planilha", value: "-90%" },
      ],
      isFeatured: true,
      isActive: true,
      completedAt: new Date("2026-02-10"),
      metaDescription: "Dashboard financeiro em tempo real conectado às fontes de dados da empresa.",
    },
  },
  {
    categorySlug: "integracao",
    data: {
      title: "Integração entre e-commerce, ERP e financeiro",
      slug: "integracao-ecommerce-erp",
      excerpt: "Pedidos da loja caindo automático no estoque e no financeiro, sem digitação dupla.",
      description:
        "A loja online e o ERP não conversavam: cada pedido era digitado de novo no estoque e no financeiro, gerando atraso e divergência. Criamos as integrações via API e webhooks para que cada venda do e-commerce atualize automaticamente o estoque, gere o lançamento financeiro e dispare a separação. A digitação dupla acabou.",
      client: "Loja online de moda",
      clientSector: "Varejo / e-commerce",
      tags: ["Integração", "API", "E-commerce", "ERP"],
      imageUrl: "/images/network.webp",
      resultMetrics: [
        { label: "digitação manual", value: "zero" },
        { label: "sincronização", value: "tempo real" },
      ],
      isFeatured: false,
      isActive: true,
      completedAt: new Date("2026-01-22"),
      metaDescription: "Integração de e-commerce, ERP e financeiro com sincronização em tempo real.",
    },
  },
];

async function main() {
  console.log("Inserindo cases de exemplo no portfólio...");
  for (const c of CASES) {
    const cat = await db.query.projectCategories.findFirst({
      where: eq(schema.projectCategories.slug, c.categorySlug),
    });
    await db
      .insert(schema.projects)
      .values({ ...c.data, categoryId: cat?.id })
      .onConflictDoNothing();
    console.log(`  ${c.data.slug} (${c.categorySlug}) -> ok`);
  }
  console.log("Concluído.");
  await connection.end();
}

main().catch((err) => {
  console.error("Seed de projetos falhou:", err);
  process.exit(1);
});
