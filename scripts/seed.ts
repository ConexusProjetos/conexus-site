/**
 * Seed script - run once after first deploy:
 *   npm run seed
 *
 * Creates:
 *   - Admin user (change password after first login!)
 *   - 5 services from the Conexus Kit Fundação
 *   - Sample project categories
 *   - Sample blog categories
 *   - Herbênia S. testimonial (from repo B)
 */

import { config } from "dotenv";
// Carrega .env.local (prioridade) e depois .env
config({ path: ".env.local" });
config({ path: ".env" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import * as schema from "../src/server/db/schema";
import { getSsl, usePreparedStatements } from "../src/server/db/options";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Crie o arquivo .env.local com base no .env.example.");
}

const connection = postgres(process.env.DATABASE_URL, {
  max: 1,
  // Match the app: SSL on for Supabase/Neon/Railway, off for local.
  ssl: getSsl(process.env.DATABASE_URL),
  prepare: usePreparedStatements(process.env.DATABASE_URL),
});
const db = drizzle(connection, { schema });

async function main() {
  console.log("Iniciando seed...\n");

  // ─── Admin user ─────────────────────────────────────────────────────────
  console.log("Criando usuário admin...");
  // Senha vem de variável de ambiente (não fica hardcoded no repositório).
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "trocar-no-primeiro-acesso";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await db
    .insert(schema.users)
    .values({
      name: "Admin Conexus",
      email: "admin@conexus.com.br",
      password: hashedPassword,
      role: "admin",
    })
    .onConflictDoNothing();
  console.log("   admin@conexus.com.br (senha definida em SEED_ADMIN_PASSWORD)\n");

  // ─── Services (Kit Fundação - 5 categorias) ───────────────────────────
  console.log("Criando serviços...");
  await db.insert(schema.services).values([
    {
      title: "Controle de Estoque Automatizado",
      slug: "controle-de-estoque",
      shortDescription: "Nunca perca um produto ou duplique um registro.",
      description:
        "Sistema completo de controle de estoque com cadastro de produtos por categorias e variações, entradas e saídas com histórico completo, alertas de estoque mínimo e relatórios de movimentação.",
      icon: "boxes",
      features: [
        "Cadastro com categorias e variações",
        "Entradas e saídas com histórico",
        "Alertas de estoque mínimo",
        "Relatórios de movimentação e giro",
      ],
      basePriceCents: 80000,
      monthlyPriceCents: 15000,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      title: "Sistemas Internos Personalizados",
      slug: "sistemas-internos",
      shortDescription: "CRM, pedidos e tarefas sob medida para o seu time.",
      description:
        "Sistemas internos feitos sob medida: CRM para clientes e contatos, gestão de pedidos e orçamentos, controle de tarefas da equipe e módulos de agendamento ou prestação de serviços.",
      icon: "monitor",
      features: [
        "CRM para clientes e contatos",
        "Gestão de pedidos e orçamentos",
        "Controle de tarefas internas",
        "Agendamentos e prestação de serviços",
      ],
      basePriceCents: 120000,
      monthlyPriceCents: 20000,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      title: "Dashboards e Relatórios Inteligentes",
      slug: "dashboards-e-relatorios",
      shortDescription: "Seus dados em tempo real, sem planilhas manuais.",
      description:
        "Dashboards conectados às suas fontes de dados (planilhas, sistemas, APIs), com visualização em tempo real de indicadores-chave, relatórios automáticos por período e exportação em PDF ou Excel.",
      icon: "bar-chart",
      features: [
        "Conexão com dados existentes",
        "Indicadores em tempo real",
        "Relatórios automáticos por período",
        "Exportação PDF e Excel",
      ],
      basePriceCents: 60000,
      monthlyPriceCents: 10000,
      isActive: true,
      isFeatured: false,
      order: 3,
    },
    {
      title: "Automação de Tarefas Repetitivas",
      slug: "automacao-de-tarefas",
      shortDescription: "Libere sua equipe das tarefas que o sistema pode fazer.",
      description:
        "Automações que eliminam trabalho manual: envio automático de e-mails e WhatsApp, geração de documentos, importação de dados e rotinas de backup e sincronização.",
      icon: "settings",
      features: [
        "Envio automático de e-mail/WhatsApp",
        "Geração automática de documentos",
        "Importação e organização de dados",
        "Backup e sincronização",
      ],
      basePriceCents: 50000,
      monthlyPriceCents: 8000,
      isActive: true,
      isFeatured: false,
      order: 4,
    },
    {
      title: "Integrações entre Sistemas",
      slug: "integracoes",
      shortDescription: "Seus sistemas conversando entre si, sem esforço manual.",
      description:
        "Integrações que conectam o que antes estava separado: e-commerce e financeiro, ERP e ferramentas externas, sincronização entre plataformas e APIs customizadas.",
      icon: "integration",
      features: [
        "E-commerce + financeiro",
        "ERP + ferramentas externas",
        "Sincronização entre plataformas",
        "Webhooks e APIs customizadas",
      ],
      basePriceCents: 70000,
      monthlyPriceCents: 12000,
      isActive: true,
      isFeatured: false,
      order: 5,
    },
  ]).onConflictDoNothing();
  console.log("   5 serviços criados\n");

  // ─── Project categories ────────────────────────────────────────────────
  console.log("Criando categorias de projetos...");
  await db.insert(schema.projectCategories).values([
    { name: "Controle de Estoque", slug: "controle-de-estoque" },
    { name: "Sistema Interno", slug: "sistema-interno" },
    { name: "Dashboard", slug: "dashboard" },
    { name: "Automação", slug: "automacao" },
    { name: "Integração", slug: "integracao" },
  ]).onConflictDoNothing();
  console.log("   5 categorias de projetos\n");

  // ─── Blog categories ───────────────────────────────────────────────────
  console.log("Criando categorias de blog...");
  await db.insert(schema.blogCategories).values([
    { name: "Dicas de Negócio", slug: "dicas-de-negocio", color: "#00A5B7" },
    { name: "Tecnologia", slug: "tecnologia", color: "#7C3AED" },
    { name: "Automação", slug: "automacao", color: "#059669" },
    { name: "Cases", slug: "cases", color: "#D97706" },
  ]).onConflictDoNothing();
  console.log("   4 categorias de blog\n");

  // ─── Testimonial (Herbênia S. - from repo B) ──────────────────────────
  console.log("Adicionando depoimento inicial...");
  await db.insert(schema.testimonials).values({
    authorName: "Herbênia S.",
    authorRole: "Diretora",
    authorCompany: "ONG local",
    content:
      "A Conexus transformou nossa gestão. Antes perdíamos horas em planilhas, agora tudo é automático. Em menos de uma semana já estávamos usando o sistema. Recomendo muito!",
    rating: 5,
    isActive: true,
    isFeatured: true,
    order: 1,
  }).onConflictDoNothing();
  console.log("   Depoimento da Herbênia S. criado\n");

  console.log("Seed concluído com sucesso!");
  console.log("\nLembrete: altere a senha do admin após o primeiro login.");
  console.log("   E-mail: admin@conexus.com.br");
  console.log("   Senha:  (definida em SEED_ADMIN_PASSWORD)\n");

  await connection.end();
}

main().catch((err) => {
  console.error("Seed falhou:", err);
  process.exit(1);
});
