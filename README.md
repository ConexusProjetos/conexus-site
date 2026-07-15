# Conexus Web - Site Institucional

> Stack: Next.js 15 · TypeScript · Tailwind CSS · tRPC v11 · Drizzle ORM · PostgreSQL · Railway · Vercel · Resend

---

## Estrutura do Projeto

```
conexus-web/
├── src/
│   ├── app/
│   │   ├── (public)/               # Landing, blog, portfólio, contato
│   │   ├── (admin)/admin/          # Painel admin (protegido por JWT)
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/        # Handler tRPC
│   │   │   ├── auth/               # set-token, logout
│   │   │   ├── og/                 # Gerador de imagem Open Graph
│   │   │   └── health/             # Healthcheck para Railway
│   │   ├── not-found.tsx           # 404 customizado
│   │   ├── error.tsx               # Error boundary global
│   │   ├── loading.tsx             # Skeleton global
│   │   └── layout.tsx              # Root layout + GA4
│   ├── components/
│   │   ├── sections/               # Hero, Services, Blog cards, etc.
│   │   ├── ui/                     # CategoryFilter, Pagination, Markdown
│   │   ├── layout/                 # Header, Footer
│   │   ├── admin/                  # Sidebar, DataTable, FormField, BlogEditor
│   │   └── analytics/              # GoogleAnalytics tracker
│   ├── server/
│   │   ├── db/schema.ts            # Schema PostgreSQL (7 tabelas)
│   │   ├── db/index.ts             # Conexão Drizzle
│   │   ├── trpc.ts                 # Procedures + middleware
│   │   ├── context.ts              # Auth context
│   │   └── routers/                # auth, services, projects, blog, contact, testimonials
│   ├── lib/
│   │   ├── trpc/                   # Client, Server caller, Provider
│   │   ├── auth.ts                 # JWT (jose)
│   │   ├── email.ts                # Resend templates
│   │   ├── analytics.ts            # GA4 helpers
│   │   └── utils.ts                # cn(), formatters
│   └── middleware.ts               # Auth guard + rate limiting + security headers
├── drizzle/migrations/
├── scripts/seed.ts
├── railway.json
├── vercel.json
└── .env.example
```

---

## Setup Local

### 1. Instalar dependências

```bash
git clone <repo>
cd conexus-web
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

| Variável                        | Obrigatória | Descrição                         |
| ------------------------------- | ----------- | --------------------------------- |
| `DATABASE_URL`                  | ✅          | URL de conexão PostgreSQL         |
| `JWT_SECRET`                    | ✅          | Chave secreta JWT (mín. 32 chars) |
| `RESEND_API_KEY`                | ✅          | Chave da API do Resend            |
| `RESEND_FROM_EMAIL`             | ✅          | E-mail verificado no Resend       |
| `RESEND_NOTIFY_EMAIL`           | ✅          | Para onde chegam os leads         |
| `NEXT_PUBLIC_APP_URL`           | ✅          | URL pública do site               |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⬜          | ID do GA4 (ex: `G-XXXXXXXXXX`)    |

Gerar JWT_SECRET:

```bash
openssl rand -base64 64
```

### 3. Banco de dados

```bash
# Aplicar schema (desenvolvimento - sem migrações)
npm run db:push

# Ou, para produção (com histórico de migrações):
npm run db:generate
npm run db:migrate

# Visualizar o banco localmente
npm run db:studio
```

> **Usando Supabase?** Funciona direto - é PostgreSQL. No painel do Supabase:
> `Connect → Connection string → URI` e cole no `DATABASE_URL`. Recomendado o
> **Session pooler** (porta 5432), que suporta `db:push`, `db:migrate` e `seed`.
> O SSL exigido pelo Supabase é ligado automaticamente (detecção por host em
> `src/server/db/options.ts`); o **Transaction pooler** (6543/`pgbouncer=true`)
> também é suportado - prepared statements são desativados sozinhos.

### 4. Seed inicial

```bash
npm run seed
```

Cria:

- Usuário admin (`admin@conexus.com.br` / `(ver SEED_ADMIN_PASSWORD)`)
- 5 serviços do portfólio
- Categorias de projetos e blog
- Depoimento da Herbênia S.

> ⚠️ **Troque a senha do admin imediatamente após o primeiro login em produção.**

### 5. Rodar em desenvolvimento

```bash
npm run dev
# http://localhost:3000        → Site público
# http://localhost:3000/admin  → Painel admin
# http://localhost:3000/login  → Login admin
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor local
npm run typecheck        # Verificar TypeScript

# Banco de dados
npm run db:push          # Aplicar schema (dev)
npm run db:generate      # Gerar migração
npm run db:migrate       # Executar migrações
npm run db:studio        # Interface visual do banco
npm run seed             # Popular dados iniciais

# Build
npm run build            # Build de produção
npm start                # Iniciar em produção
```

---

## Credenciais Padrão (após seed)

| Campo | Valor                     |
| ----- | ------------------------- |
| URL   | /login                    |
| Email | admin@conexus.com.br      |
| Senha | (ver SEED_ADMIN_PASSWORD) |

> ⚠️ **Mude a senha após o primeiro login em produção.**

---

## Fases de Desenvolvimento

| Fase | Status | Descrição                                               |
| ---- | ------ | ------------------------------------------------------- |
| 1    | ✅     | Setup, banco de dados, tRPC, auth, shell Next.js        |
| 2    | ✅     | Landing page completa (porte do design do repo B)       |
| 3    | ✅     | Painel admin completo (CRUD + login + blog editor)      |
| 4    | ✅     | Páginas públicas (blog, portfólio, contato) com SSG/SSR |
| 5    | ✅     | Deploy, OG dinâmico, analytics, segurança, produção     |

---

## Tecnologias

| Camada    | Tecnologia                    |
| --------- | ----------------------------- |
| Framework | Next.js 15 (App Router)       |
| Linguagem | TypeScript 5.7                |
| Estilo    | Tailwind CSS 3.4              |
| API       | tRPC v11 + Zod                |
| ORM       | Drizzle ORM                   |
| Banco     | PostgreSQL                    |
| Auth      | JWT (jose) + httpOnly cookies |
| E-mail    | Resend                        |
| Markdown  | react-markdown + remark-gfm   |
| Analytics | Google Analytics 4            |
| Deploy    | Vercel (frontend)             |

---

## Deploy na VPS com Docker e Traefik

Este projeto Ã© um Ãºnico app Next.js: o site e as rotas de API (`/api/*` e
tRPC) sÃ£o servidos pelo mesmo container. O Compose publica os dois hosts no
Traefik: `conexusprojects.tech` (e `www`) e `api.conexusprojects.tech`.

Na VPS, dentro da pasta do projeto:

```bash
cp .env.production.example .env.production
cp .env.docker.example .env
# Edite os dois arquivos e informe a string do novo banco em DATABASE_URL.
docker compose up -d --build
```

`TRAEFIK_NETWORK` e `TRAEFIK_CERTRESOLVER`, no arquivo `.env`, devem ter os
mesmos nomes empregados pelo Compose do Traefik jÃ¡ instalado na VPS. A rede
precisa existir antes do deploy (`docker network ls`). NÃ£o hÃ¡ `ports` no
Compose porque o acesso externo Ã© exclusivamente pelo Traefik.

Quando o PostgreSQL estiver no mesmo Docker host e na rede `traefik-public`,
use `postgres` como host em `DATABASE_URL` (por exemplo,
`postgresql://usuario:senha@postgres:5432/conexus_site`). O domÃ­nio do
pgAdmin nÃ£o Ã© o endereÃ§o de conexÃ£o do PostgreSQL.

O serviÃ§o `migrate` aplica as migrations Drizzle antes de iniciar o app. As
migrations sÃ£o registradas no banco e podem rodar novamente em novo deploy.
O seed Ã© propositalmente manual, caso seja necessÃ¡rio:

```bash
docker compose run --rm migrate npm run seed
```

### Teste local com banco em Docker

Com o Docker Desktop em execuÃ§Ã£o, este comando sobe o app e um PostgreSQL
local, executando as migrations automaticamente. Ele nÃ£o usa Traefik nem o
banco da VPS:

```bash
docker compose -f docker-compose.local.yml up --build
```

Abra `http://localhost:3000` e confirme a saÃºde em
`http://localhost:3000/api/health`. Para criar o usuÃ¡rio e dados iniciais em
um banco local vazio, abra outro terminal e execute:

```bash
docker compose -f docker-compose.local.yml run --rm migrate npm run seed
```

O login local criado pelo seed Ã© `admin@conexus.com.br`, com a senha
`trocar-esta-senha-local`.

Para encerrar, use `docker compose -f docker-compose.local.yml down`. Para
apagar tambÃ©m os dados locais do PostgreSQL e reiniciar do zero, use
`docker compose -f docker-compose.local.yml down -v`.
