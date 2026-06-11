# DevVault - Project Context

## What is DevVault?
DevVault is a personal all-in-one workspace for web developers. 
It helps developers organize code snippets, track projects, use built-in tools, and manage checklists.

Target audience: Web developers, freelancers, indie hackers.

## Core Goal
Build a beautiful, fast, and actually useful developer tool that feels premium.

## Tech Stack (Strictly Follow This)

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL + Row Level Security)
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Forms**: Controlled state in client components + Zod validation in server actions
- **Other**: Sonner (toast notifications)
- **Package Manager**: pnpm

## Design & UI Rules
- Follow the design specifications in DESIGN.md
- Dark theme by default
- Modern, clean, minimal aesthetic (inspired by Linear.app, Raycast, Notion)
- High attention to detail, smooth interactions
- Fully responsive

## Project Structure

```
app/           # Routes only — thin pages that fetch data and render feature clients
features/      # Domain modules (UI, server queries, server actions, types)
shared/        # Client-safe contracts (ActionResult types, ROUTES)
server/        # Shared server patterns (actions, auth, pagination, validation)
components/    # Shared UI primitives (shadcn) and app shell layout
lib/           # Infrastructure — Supabase clients, Drizzle, env
hooks/         # Shared client hooks
utils/         # Pure helpers (cn, errors)
drizzle/       # Database migrations
```

### Import rules

- Client components and hooks → `@/shared/*` (types, constants)
- Feature mutations → `@/server/actions` (+ `@/server/validation/*` as needed)
- Feature reads → `@/server/auth/require-user` + `@/lib/db`
- List pagination → `@/server/pagination`
- DB / Supabase wiring → `@/lib/db`, `@/lib/supabase`, `@/lib/env`

### Feature module template

Each domain lives under `features/<name>/`:

```
features/<name>/
  components/       # "use client" UI
  server/
    queries.ts      # reads (Server Components)
    actions.ts      # mutations (Server Actions)
  types.ts          # derived from query return types
  constants.ts      # optional
```

## Important Rules
- Use pnpm only for package management (no npm or yarn)
- Always use App Router
- Prefer Server Components when possible
- Put reads in `features/*/server/queries.ts`, mutations in `features/*/server/actions.ts`
- Derive feature types from query return types (avoid hand-written duplicates)
- Implement proper Row Level Security in Supabase
- Keep code clean, well-typed and maintainable

## Authentication
- Email + Password
- Google OAuth (via Supabase)
- Protected routes

## Current Status
This is an MVP project. Focus on quality and clean architecture.

## Dependencies

### Drizzle ORM (beta)

This project uses `drizzle-orm` and `drizzle-kit` at **exact** beta versions (`1.0.0-beta.22`) for `pgPolicy` / Supabase RLS support.

- Do **not** bump drizzle packages casually — read release notes first
- After upgrading `drizzle-kit`, run `pnpm db:up` to migrate the snapshots folder format
- Re-run `pnpm db:migrate` after schema/policy changes
- Wait for Drizzle 1.0 stable with RLS APIs before moving off beta