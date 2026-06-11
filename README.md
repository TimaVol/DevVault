# DevVault

Personal all-in-one workspace for web developers — snippets, projects, tools, and checklists.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn-style UI primitives
- Supabase (Auth + Postgres + RLS)
- Drizzle ORM (1.0 beta — RLS policies in schema)
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database URLs

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Drizzle `client` pool | App queries inside `db.rls()` — must use a role subject to RLS (e.g. `rls_client` with `GRANT anon, authenticated`) |
| `ADMIN_DATABASE_URL` | Drizzle `admin` pool, `pnpm db:*` | Migrations and trusted bypass; typically the `postgres` user |

Server data access uses `createDrizzleSupabaseClient()` from [`lib/db/create-drizzle-supabase-client.ts`](lib/db/create-drizzle-supabase-client.ts): Supabase validates the session, then each transaction sets JWT claims and `SET LOCAL ROLE` so Postgres RLS applies. See [Drizzle RLS + Supabase](https://orm.drizzle.team/docs/rls#using-with-supabase).

### RLS database user (`rls_client`)

Migration [`drizzle/20260528100001_rls_client/migration.sql`](drizzle/20260528100001_rls_client/migration.sql) creates a Postgres login that can assume `anon` / `authenticated` so RLS policies apply to Drizzle queries (unlike the `postgres` superuser).

**1. Set admin URL in `.env.local`**

```env
ADMIN_DATABASE_URL=postgresql://postgres.[ref]:[password]@...supabase.com:5432/postgres
```

Use the **postgres** connection string from Supabase → **Connect** (direct or session pooler).

**2. Run migrations**

```bash
pnpm db:migrate
```

This applies pending folder migrations (including `rls_client`). Default password for a new user is `dev-vault-rls-client-change-me`.

**3. Set a strong password (required for production)**

In Supabase **SQL Editor** (as postgres):

```sql
ALTER ROLE rls_client WITH PASSWORD 'your-strong-password';
```

**4. Point `DATABASE_URL` at `rls_client`**

Same host/port as your Supabase URI, different user/password:

```env
DATABASE_URL=postgresql://rls_client:your-strong-password@db.[project-ref].supabase.co:5432/postgres
```

Keep `ADMIN_DATABASE_URL` on **postgres** for `pnpm db:migrate` and the Drizzle `admin` pool.

**Pooler:** `DATABASE_URL` must use **Session** mode or **Direct** connection. Transaction pooler (port 6543) does not support `SET LOCAL ROLE` reliably.

**Re-run / idempotent:** If `rls_client` already exists, the migration skips `CREATE` and only re-applies grants.

**Hosted Supabase without migrate:** You can paste the contents of `drizzle/20260528100001_rls_client/migration.sql` into the SQL Editor instead of `pnpm db:migrate`.

### RLS policies

Policies are defined in [`lib/db/schema.ts`](lib/db/schema.ts) via `pgPolicy` and applied with migration [`drizzle/20260528100002_rls_policies/migration.sql`](drizzle/20260528100002_rls_policies/migration.sql). Run `pnpm db:migrate` after pulling schema changes.

> **Note:** `drizzle-orm@beta` is required for `pgPolicy` / `drizzle-orm/supabase`. `pnpm db:generate` may ask you to run `drizzle-kit up` first to upgrade the migrations folder format.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:up` | Upgrade migration snapshots to Kit 1.x format |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Drizzle Studio |

## Project structure

```
app/           # Routes only (marketing, auth, dashboard)
features/      # Domain modules — components, server queries/actions, types
components/    # Shared UI primitives (shadcn) and app shell layout
lib/           # Supabase clients, Drizzle, auth helpers
hooks/         # Shared client hooks
utils/         # Pure helpers (cn, errors)
drizzle/       # Database migrations
```

See [PROJECT.md](./PROJECT.md) for the per-feature module template.

## Design

See [DESIGN.md](./DESIGN.md) for tokens, typography, and layout rules.

### UI (shadcn/ui)

Initialized with the [shadcn CLI](https://ui.shadcn.com) (`base-nova` style). Add primitives:

```bash
pnpm dlx shadcn@latest add <component> -y -o
```

| Area | Path |
|------|------|
| Primitives | `components/ui/*` |
| App shell | `DashboardLayout`, `AppSidebar` in `components/layout/` |
| Page chrome | `PageHeader`, `SiteHeader` |

Dashboard routes use `SidebarProvider` + `SidebarInset`; page content is `flex flex-col gap-6` with shadcn `Card`, `Empty`, `Dialog`, etc. Links styled as buttons use `buttonVariants` + `Link` (not `Button` + `render={<Link />}` — Base UI expects a real `<button>` unless `nativeButton={false}`).
