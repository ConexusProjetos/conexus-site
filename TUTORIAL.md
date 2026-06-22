# 🎓 Tutorial Completo: Rodando o Conexus Web do Zero

> Um guia passo a passo, pensado para você **aprender enquanto faz**. Cada comando vem com uma explicação do *porquê*. Ao final, o site estará rodando na sua máquina.
>
> ⏱️ Tempo estimado: 40 a 60 minutos na primeira vez.

---

## 📑 Índice

0. [Mapa mental: como esse projeto funciona](#parte-0)
1. [Preparando seu ambiente](#parte-1)
2. [Pegando e abrindo o código](#parte-2)
3. [O banco de dados (PostgreSQL)](#parte-3)
4. [Variáveis de ambiente](#parte-4)
5. [Instalando as dependências](#parte-5)
6. [Preparando o banco (schema + dados)](#parte-6)
7. [Rodando o projeto](#parte-7)
8. [Explorando o que está rodando](#parte-8)
9. [Entendendo o fluxo de uma requisição](#parte-9)
10. [Solução de problemas](#parte-10)

---

<a name="parte-0"></a>
## Parte 0 - Mapa mental: como esse projeto funciona

Antes de digitar qualquer comando, vamos entender **as peças**. Isso vai fazer todo o resto fazer sentido.

Imagine o projeto como uma cozinha de restaurante:

| Peça | O que é | Analogia na cozinha |
|---|---|---|
| **Next.js** | O framework que monta as páginas e organiza tudo | A cozinha inteira, com suas estações |
| **React** | A biblioteca que desenha a interface | O prato montado que vai à mesa |
| **TypeScript** | JavaScript com "tipos" (avisa erros antes de rodar) | A ficha técnica que evita errar a receita |
| **Tailwind CSS** | Sistema de estilos via classes | Os temperos e a apresentação visual |
| **tRPC** | A ponte type-safe entre frontend e backend | O garçom que leva pedidos e traz pratos |
| **Drizzle ORM** | Traduz código TypeScript em comandos SQL | O tradutor que fala com a despensa |
| **PostgreSQL** | O banco de dados onde tudo é guardado | A despensa/geladeira |
| **Resend** | Serviço que envia e-mails | O entregador que leva o recado |

### O caminho de uma informação

Quando alguém preenche o formulário de contato no site:

```
Navegador (React)
   ↓  o usuário clica "Enviar"
tRPC client  ──→  /api/trpc  ──→  tRPC router (contact.submit)
                                        ↓ valida com Zod
                                   Drizzle ORM
                                        ↓ vira SQL
                                   PostgreSQL  (salva o lead)
                                        ↓
                                   Resend (envia e-mail de aviso)
```

Você **não precisa decorar isso agora**. Mas guarde a imagem: o frontend pede, o tRPC valida, o Drizzle conversa com o banco. Vamos ver isso vivo na [Parte 9](#parte-9).

---

<a name="parte-1"></a>
## Parte 1 - Preparando seu ambiente

Você precisa de **três ferramentas** instaladas: Node.js, um editor de código e (recomendado) o Docker.

### 1.1 - Node.js (obrigatório)

O Node.js é o que permite rodar JavaScript fora do navegador. Este projeto exige **versão 20 ou superior**.

**Verifique se já tem:**

```bash
node --version
```

- Se aparecer `v20.x.x` ou maior → ✅ pule para 1.2
- Se aparecer `v18` ou menor, ou "command not found" → instale abaixo

**Instalando o Node.js 20:**

A forma mais segura é usando o **nvm** (Node Version Manager), que permite ter várias versões:

```bash
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# feche e reabra o terminal, depois:
nvm install 20
nvm use 20
```

No **Windows**, baixe o instalador direto em [nodejs.org](https://nodejs.org) (escolha a versão **LTS**) ou use o [nvm-windows](https://github.com/coreybutler/nvm-windows).

**Confirme:**

```bash
node --version   # deve mostrar v20.x.x ou superior
npm --version    # vem junto com o Node - deve mostrar 10.x.x ou superior
```

> 💡 **O que é o `npm`?** É o "gerenciador de pacotes" do Node. Ele baixa e organiza as bibliotecas que o projeto usa (React, Next.js, etc.). Pense nele como uma loja de ingredientes.

### 1.2 - Editor de código (recomendado: VS Code)

Baixe o [Visual Studio Code](https://code.visualstudio.com). Ao abrir o projeto, instale as extensões recomendadas quando ele perguntar. Especialmente úteis:

- **ESLint** - aponta erros de código
- **Tailwind CSS IntelliSense** - autocompleta classes do Tailwind
- **Prettier** - formata o código automaticamente

### 1.3 - Docker (recomendado para o banco)

O Docker permite rodar o PostgreSQL **sem instalar nada permanente** na sua máquina - é como uma "caixa" isolada. Explico o porquê na [Parte 3](#parte-3).

Baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop/). Após instalar, confirme:

```bash
docker --version   # deve mostrar algo como "Docker version 27.x.x"
```

> Se não quiser usar Docker, sem problema - a [Parte 3](#parte-3) traz alternativas.

---

<a name="parte-2"></a>
## Parte 2 - Pegando e abrindo o código

### 2.1 - Descompacte o projeto

Pegue o arquivo `conexus-web-fase5-FINAL.zip` e extraia. Você terá uma pasta `conexus-web`.

### 2.2 - Abra no terminal e no editor

```bash
# Navegue até a pasta (ajuste o caminho conforme onde você extraiu)
cd caminho/para/conexus-web

# Abra no VS Code
code .
```

> 💡 **O ponto (`.`)** significa "a pasta atual". `code .` abre o VS Code já na pasta do projeto.

### 2.3 - Tour pela estrutura

Abra a pasta `src/` no editor. Aqui está o que cada coisa faz:

```
src/
├── app/              → As PÁGINAS e ROTAS do site
│   ├── (public)/     → Páginas que todo mundo vê (blog, portfólio...)
│   ├── (admin)/      → Painel administrativo (protegido por login)
│   ├── api/          → Endpoints de backend (tRPC, health, og)
│   ├── layout.tsx    → "Moldura" que envolve todas as páginas
│   └── page.tsx      → A página inicial (a landing page)
│
├── components/       → Pedaços reutilizáveis de interface
│   ├── sections/     → Seções da landing (Hero, Serviços...)
│   ├── ui/           → Botões, filtros, modais genéricos
│   └── layout/       → Header e Footer
│
├── server/           → O BACKEND
│   ├── db/schema.ts  → Define as TABELAS do banco
│   └── routers/      → A lógica da API (o que cada endpoint faz)
│
└── lib/              → Utilitários (auth, e-mail, helpers)
```

> 💡 **Os parênteses em `(public)` e `(admin)`** são "route groups" do Next.js. Eles organizam pastas **sem** aparecer na URL. Ou seja, `(public)/blog` vira só `/blog` no navegador.

---

<a name="parte-3"></a>
## Parte 3 - O banco de dados (PostgreSQL)

Aqui é onde a maioria dos iniciantes trava. Vou explicar com calma.

### Por que preciso de um banco?

O site guarda **dados que mudam**: mensagens de contato, posts do blog, projetos do portfólio. Tudo isso precisa de um lugar permanente - o banco de dados. Escolhemos o **PostgreSQL**, um dos bancos mais robustos e usados no mundo.

Você tem **três caminhos**. Escolha UM:

| Caminho | Dificuldade | Recomendado para |
|---|---|---|
| **A - Docker** | Fácil | Quem quer algo limpo e que "só funciona" |
| **B - Instalação local** | Média | Quem não pode usar Docker |
| **C - Nuvem (Neon)** | Fácil | Quem não quer instalar nada |

> ⭐ **Recomendo o Caminho A (Docker)**. Ele funciona perfeitamente com a configuração do projeto, é isolado (não bagunça sua máquina) e você pode apagar tudo com um comando.

---

### 🅰️ Caminho A - PostgreSQL com Docker (recomendado)

Com o Docker Desktop **aberto e rodando**, execute na pasta do projeto:

```bash
docker run --name conexus-db \
  -e POSTGRES_USER=conexus \
  -e POSTGRES_PASSWORD=conexus123 \
  -e POSTGRES_DB=conexus \
  -p 5432:5432 \
  -d postgres:16
```

**Decifrando o comando:**

- `docker run` → cria e inicia um container
- `--name conexus-db` → dá um nome a ele (para você gerenciar depois)
- `-e POSTGRES_USER=...` → define usuário, senha e nome do banco
- `-p 5432:5432` → conecta a porta 5432 do container à sua máquina (5432 é a porta padrão do Postgres)
- `-d` → roda em segundo plano (*detached*)
- `postgres:16` → usa a imagem oficial do PostgreSQL versão 16

**Confirme que está rodando:**

```bash
docker ps
```

Você deve ver `conexus-db` na lista. Sua `DATABASE_URL` será:

```
postgresql://conexus:conexus123@localhost:5432/conexus
```

> 💡 **Comandos úteis para depois:**
> - `docker stop conexus-db` → pausa o banco
> - `docker start conexus-db` → liga de novo
> - `docker rm -f conexus-db` → apaga tudo (recomeça do zero)

---

### 🅱️ Caminho B - Instalação local do PostgreSQL

**macOS** (com Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
createdb conexus
```
Sua URL: `postgresql://SEU_USUARIO@localhost:5432/conexus` (no macOS, o usuário costuma ser seu nome de usuário do sistema, sem senha).

**Windows / Linux:** baixe em [postgresql.org/download](https://www.postgresql.org/download/). Durante a instalação, anote o usuário (`postgres`) e a senha que você definir. Depois, crie o banco `conexus` usando o pgAdmin (que vem junto) ou:
```bash
psql -U postgres -c "CREATE DATABASE conexus;"
```
Sua URL: `postgresql://postgres:SUA_SENHA@localhost:5432/conexus`

---

### 🅲 Caminho C - PostgreSQL na nuvem (Neon, grátis)

1. Crie conta grátis em [neon.tech](https://neon.tech)
2. Crie um projeto → ele te dá uma **connection string**
3. Copie a URL (parece com `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)

> ⚠️ **Atenção importante (SSL):** O Neon **exige conexão SSL**, mas a configuração de desenvolvimento do projeto desliga o SSL (`ssl: false` quando `NODE_ENV` não é `production`). Para usar Neon em desenvolvimento, abra o arquivo `src/server/db/index.ts` e troque a linha:
> ```ts
> ssl: process.env.NODE_ENV === "production" ? "require" : false,
> ```
> por:
> ```ts
> ssl: "require",
> ```
> Por isso o Docker é mais simples para aprender: funciona sem mexer em nada.

---

<a name="parte-4"></a>
## Parte 4 - Variáveis de ambiente

### O que são e por que existem

Variáveis de ambiente são **configurações secretas ou que mudam entre máquinas** - senhas, chaves de API, URL do banco. Elas ficam fora do código (e fora do Git) por segurança. Imagine que são as chaves da casa: você não deixa coladas na porta.

O Next.js lê automaticamente um arquivo chamado **`.env.local`**.

### 4.1 - Crie o arquivo

Na raiz do projeto, copie o exemplo:

```bash
cp .env.example .env.local
```

> 💡 No Windows (PowerShell): `Copy-Item .env.example .env.local`

### 4.2 - Edite o `.env.local`

Abra o `.env.local` no editor e preencha. Aqui está cada variável explicada:

```bash
# OBRIGATÓRIA - onde o banco está (use a URL do seu Caminho na Parte 3)
DATABASE_URL="postgresql://conexus:conexus123@localhost:5432/conexus"

# OBRIGATÓRIA - chave secreta para criptografar logins (vamos gerar abaixo)
JWT_SECRET="cole-aqui-a-chave-gerada"

# OPCIONAIS no desenvolvimento - o site roda sem elas
# (sem elas, o formulário SALVA o lead no banco, mas não envia e-mail)
RESEND_API_KEY="re_deixe_assim_por_enquanto"
RESEND_FROM_EMAIL="contato@conexus.com.br"
RESEND_NOTIFY_EMAIL="seu@email.com"

# OBRIGATÓRIA - URL onde o site roda localmente
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Conexus"

# Mantenha em development para rodar local
NODE_ENV="development"
```

### 4.3 - Gere o `JWT_SECRET`

Essa chave assina os "crachás" de login (tokens JWT). Precisa ser longa e aleatória:

```bash
# macOS / Linux
openssl rand -base64 64
```

No **Windows** (PowerShell):
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copie o resultado e cole no `JWT_SECRET` do `.env.local`.

> ⚠️ **Sobre o Resend:** Você **não precisa** de uma conta no Resend para rodar o projeto agora. O código foi feito para **pular o envio de e-mail** se a chave não estiver configurada. O formulário de contato vai funcionar e salvar no banco normalmente - você verá o lead no painel admin. Quando quiser ativar e-mails de verdade, crie conta grátis em [resend.com](https://resend.com).

---

<a name="parte-5"></a>
## Parte 5 - Instalando as dependências

Agora vamos baixar todas as bibliotecas que o projeto usa.

```bash
npm install
```

**O que acontece aqui:** o `npm` lê o arquivo `package.json` (a lista de ingredientes), baixa cada biblioteca e guarda tudo numa pasta chamada `node_modules`. Isso pode levar 1 a 3 minutos e baixar centenas de pacotes - é normal.

> 💡 **A pasta `node_modules` é gigante e descartável.** Ela não vai pro Git (está no `.gitignore`). Se algo der muito errado, você pode apagá-la e rodar `npm install` de novo.

> ⚠️ Se aparecerem **warnings** (avisos amarelos), ignore. Só se preocupe com **errors** (vermelhos). Se houver conflito de versões, tente: `npm install --legacy-peer-deps`

---

<a name="parte-6"></a>
## Parte 6 - Preparando o banco (schema + dados)

O banco existe (Parte 3), mas está **vazio** - sem tabelas. Vamos criar a estrutura e popular com dados iniciais.

### 6.1 - Criar as tabelas (push do schema)

```bash
npm run db:push
```

**O que acontece:** o Drizzle lê o arquivo `src/server/db/schema.ts` (onde as tabelas estão definidas em TypeScript) e cria essas tabelas no PostgreSQL. É como entregar a planta da casa e o pedreiro construir os cômodos.

Você deve ver mensagens de criação de tabelas (`users`, `services`, `projects`, `blog_posts`, etc.) e no final algo como `Changes applied`.

> 💡 **`db:push` vs `db:migrate`:** O `push` aplica o schema direto, ideal para desenvolvimento. O `migrate` gera arquivos de histórico de mudanças, ideal para produção. Por enquanto, `push` é o que você quer.

### 6.2 - Popular com dados iniciais (seed)

```bash
npm run seed
```

**O que acontece:** o script `scripts/seed.ts` insere dados de exemplo no banco:
- Um **usuário admin** para você logar
- Os **5 serviços** da Conexus
- Categorias de blog e portfólio
- Um depoimento de cliente

No final, ele mostra as credenciais do admin:

```
E-mail: admin@conexus.com.br
Senha:  (ver SEED_ADMIN_PASSWORD)
```

**Anote essas credenciais** - você vai usar para entrar no painel.

> 💡 Se rodar o seed duas vezes, não tem problema: ele usa `onConflictDoNothing()`, ou seja, ignora dados que já existem.

---

<a name="parte-7"></a>
## Parte 7 - Rodando o projeto 🚀

Chegou a hora:

```bash
npm run dev
```

**O que acontece:** o Next.js inicia um servidor de desenvolvimento. Você verá algo como:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  ✓ Ready in 2.3s
```

Abra o navegador em **[http://localhost:3000](http://localhost:3000)** 🎉

> 💡 **O servidor fica "preso" no terminal** - isso é normal, ele precisa continuar rodando. Para parar, aperte `Ctrl + C`. Para mexer no código, abra **outro terminal**.

> 💡 **Hot reload:** Edite qualquer arquivo e salve - a página atualiza sozinha. Experimente trocar um texto na landing page!

---

<a name="parte-8"></a>
## Parte 8 - Explorando o que está rodando

Agora a parte divertida: navegue e entenda.

### 8.1 - O site público

| Página | URL | O que olhar |
|---|---|---|
| Início | http://localhost:3000 | A landing com animação de circuito, serviços vindos do banco |
| Portfólio | http://localhost:3000/portfolio | Vazio por enquanto (sem projetos) |
| Blog | http://localhost:3000/blog | Vazio (sem posts publicados) |
| Contato | http://localhost:3000/contato | Teste enviar o formulário! |

**Experimento:** Preencha e envie o formulário de contato. Mesmo sem o Resend configurado, o lead será salvo. Vamos vê-lo no admin.

### 8.2 - O painel admin

1. Acesse http://localhost:3000/login
2. Entre com `admin@conexus.com.br` / `(ver SEED_ADMIN_PASSWORD)`
3. Você cai no **Dashboard**

Explore:
- **Mensagens** → veja o lead que você acabou de enviar
- **Serviços** → os 5 serviços do seed; tente editar um
- **Blog** → crie um post! Clique em "Novo post", escreva, e clique em "Publicar"
- Volte em http://localhost:3000/blog → seu post aparece publicado

> 🎓 **Isso é o ciclo completo funcionando:** você criou conteúdo no admin (que salvou no PostgreSQL via tRPC + Drizzle) e ele apareceu no site público. Essa é a essência do projeto.

### 8.3 - Visualizando o banco direto (Drizzle Studio)

Quer ver os dados crus no banco? Em **outro terminal**:

```bash
npm run db:studio
```

Isso abre uma interface visual (geralmente em https://local.drizzle.studio) onde você navega pelas tabelas como numa planilha. Ótimo para entender o que está guardado.

---

<a name="parte-9"></a>
## Parte 9 - Entendendo o fluxo de uma requisição

Agora que tudo roda, vamos **rastrear** o que acontece quando você envia o formulário de contato. Abra estes arquivos no editor e siga o caminho:

**1. O formulário (frontend)** - `src/components/sections/ContactSection.tsx`

Procure por:
```tsx
const submitMutation = api.contact.submit.useMutation({ ... });
```
Isso é o tRPC client. `api.contact.submit` aponta para um endpoint no backend, **com tipos garantidos** - se você errar o nome de um campo, o TypeScript reclama na hora.

**2. A ponte** - `src/app/api/trpc/[trpc]/route.ts`

Toda chamada `api.*` passa por aqui. É o "garçom" que recebe o pedido do navegador.

**3. A lógica (backend)** - `src/server/routers/contact.ts`

Procure por `submit:`. Veja que ele:
```ts
.input(contactInput)        // valida os dados com Zod
.mutation(async ({ ctx, input }) => {
  // salva no banco com Drizzle:
  const [message] = await ctx.db.insert(contactMessages).values({...})
  // tenta enviar e-mail (pula se não tiver Resend):
  sendLeadNotification(message).catch(...)
})
```

**4. A tabela** - `src/server/db/schema.ts`

Procure por `contactMessages`. É a definição da tabela onde o lead foi salvo.

> 🎓 **A grande sacada do tRPC:** O frontend e o backend compartilham os **mesmos tipos**. Quando você muda um campo no `schema.ts`, o autocompletar do editor já sabe no formulário. Isso elimina uma classe inteira de bugs.

---

<a name="parte-10"></a>
## Parte 10 - Solução de problemas

Erros são parte do aprendizado. Aqui estão os mais comuns e como resolver.

### ❌ `DATABASE_URL não está definida`

**Causa:** o arquivo `.env.local` não existe ou está sem a variável.
**Solução:** confirme que você criou `.env.local` (não `.env.example`) na **raiz** do projeto e que tem a linha `DATABASE_URL="..."`.

### ❌ `ECONNREFUSED` ou `connection refused` ao rodar `db:push`

**Causa:** o banco não está rodando ou a porta está errada.
**Solução:**
- Docker: rode `docker ps` - o `conexus-db` está na lista? Se não, `docker start conexus-db`.
- Confirme que a porta na `DATABASE_URL` é `5432`.

### ❌ `password authentication failed`

**Causa:** usuário/senha na `DATABASE_URL` não batem com os do banco.
**Solução:** revise a `DATABASE_URL`. No Docker do nosso exemplo, é exatamente `conexus:conexus123`.

### ❌ `no pg_hba.conf entry` ou erro de SSL (com Neon)

**Causa:** Neon exige SSL, mas o dev está com `ssl: false`.
**Solução:** veja o aviso do [Caminho C na Parte 3](#parte-3) - troque para `ssl: "require"` em `src/server/db/index.ts`.

### ❌ `Cannot find module 'dotenv'` ao rodar o seed

**Causa:** dependências não instaladas.
**Solução:** rode `npm install` de novo.

### ❌ A porta 3000 já está em uso

**Causa:** outro processo (ou outra aba do `npm run dev`) está usando a porta.
**Solução:** o Next.js geralmente oferece a porta 3001 automaticamente. Ou pare o processo antigo com `Ctrl+C`. Para forçar outra porta: `npm run dev -- -p 3001`.

### ❌ O login não funciona / dá "Credenciais inválidas"

**Causa:** o seed não rodou, ou o `JWT_SECRET` mudou depois do login.
**Solução:** confirme que rodou `npm run seed`. Use exatamente `admin@conexus.com.br` / `(ver SEED_ADMIN_PASSWORD)`.

### ❌ Mudei um arquivo e o site quebrou com tela vermelha

**Causa:** erro de sintaxe no código que você editou.
**Solução:** leia a mensagem de erro (ela aponta o arquivo e a linha). Desfaça a última mudança com `Ctrl+Z` se não souber resolver.

### 🆘 "Quero recomeçar do zero"

```bash
# 1. Apaga o banco e recria (Docker)
docker rm -f conexus-db
docker run --name conexus-db -e POSTGRES_USER=conexus -e POSTGRES_PASSWORD=conexus123 -e POSTGRES_DB=conexus -p 5432:5432 -d postgres:16

# 2. Recria tabelas e dados
npm run db:push
npm run seed

# 3. Roda de novo
npm run dev
```

---

## ✅ Checklist final

Marque conforme avança:

- [ ] `node --version` mostra v20+
- [ ] Banco PostgreSQL rodando (Docker `docker ps`, ou local, ou Neon)
- [ ] Arquivo `.env.local` criado e preenchido
- [ ] `JWT_SECRET` gerado e colado
- [ ] `npm install` rodou sem erros vermelhos
- [ ] `npm run db:push` criou as tabelas
- [ ] `npm run seed` populou os dados
- [ ] `npm run dev` iniciou o servidor
- [ ] http://localhost:3000 abre a landing page
- [ ] Consegui logar no `/admin` e criar um post no blog

Se todos estão marcados: **parabéns, você subiu uma aplicação full-stack completa!** 🎉

---

## 🚀 Próximos passos para continuar aprendendo

1. **Mexa na landing page** - edite textos em `src/components/sections/HeroSection.tsx` e veja mudar ao vivo.
2. **Crie um projeto no portfólio** - pelo admin, e veja ele aparecer em `/portfolio`.
3. **Estude um router** - abra `src/server/routers/blog.ts` e veja como cada operação (listar, criar, editar) é definida.
4. **Entenda o Tailwind** - passe o mouse sobre classes como `text-conexus-cyan` no editor (com a extensão instalada) para ver o que fazem.
5. **Quando estiver confortável** - siga o `README.md` para fazer o **deploy** em produção (Railway + Vercel).

> Dúvida sobre qualquer parte? Volte ao [mapa mental da Parte 0](#parte-0) - quase todo problema faz sentido quando você lembra qual peça é responsável por quê.
