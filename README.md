# DevVault

Personal all-in-one workspace for web developers — snippets, projects, tools, and checklists.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn-style UI primitives
- Supabase (Auth + Postgres + RLS)
- Drizzle ORM
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Drizzle Studio |

## Project structure

```
app/           # Routes (marketing, auth, dashboard)
components/    # UI and layout components
lib/           # Supabase clients, Drizzle, utils
hooks/         # Client hooks
types/         # Shared TypeScript types
utils/         # Constants and helpers
```

## Design

See [DESIGN.md](./DESIGN.md) for tokens, typography, and layout rules.
