# Nexion — Monorepo

Plataforma SaaS para gestão de documentação e projetos de software (TCC UTFPR).

## Estrutura

```
apps/web          → Next.js (frontend)
packages/database → Schemas Zod e tipos compartilhados
packages/config   → Configurações TypeScript
supabase/         → (próxima etapa) migrations e edge functions
docs/             → Documentação acadêmica (TCC)
```

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

App disponível em `http://localhost:3000`.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Supabase (integração pendente)
- **Forms:** react-hook-form + Zod

## Estado atual

- **Auth:** Supabase Auth (login, registro, sessão via cookies)
- **Projetos:** CRUD conectado ao Postgres com RLS
- **Schema v2:** profiles, projects, project_members, kanban_columns, tasks, documents, notifications

## Variáveis de ambiente

Copie para `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
