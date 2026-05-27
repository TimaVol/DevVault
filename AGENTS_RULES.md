# Agents Development Rules for DevVault

## Before writing any code:
1. Always read DESIGN.md and PROJECT.md first
2. Strictly follow the chosen tech stack (Next.js 15 + Supabase)
3. Check current file structure

## Code Style:
- Use TypeScript strictly
- Prefer Server Components
- Use Server Actions for data mutations
- Create reusable components
- Add proper loading & error states
- Use shadcn/ui components when possible
- Use pnpm for package management

## Supabase Rules:
- Use Supabase client correctly
- Respect Row Level Security (RLS)
- Use Drizzle ORM for database queries

## Never:
- Use Firebase
- Use Prisma or other ORMs (Drizzle only)
- Use npm or yarn (pnpm only)
- Use Pages Router
- Add unnecessary dependencies
- Ignore design from DESIGN.md