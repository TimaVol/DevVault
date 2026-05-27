# DevVault - Project Context

## What is DevVault?
DevVault is a personal all-in-one workspace for web developers. 
It helps developers organize code snippets, track projects, use built-in tools, and manage checklists.

Target audience: Web developers, freelancers, indie hackers.

## Core Goal
Build a beautiful, fast, and actually useful developer tool that feels premium.

## Tech Stack (Strictly Follow This)

- **Framework**: Next.js 15.2+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL + Row Level Security)
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Other**: Sonner (toast notifications), date-fns
- **Package Manager**: pnpm

## Design & UI Rules
- Follow the design specifications in DESIGN.md
- Dark theme by default
- Modern, clean, minimal aesthetic (inspired by Linear.app, Raycast, Notion)
- High attention to detail, smooth interactions
- Fully responsive

## Project Structure
/app
/components
/lib          # supabase client, utils, drizzle
/hooks
/types
/utils

## Important Rules
- Use pnpm only for package management (no npm or yarn)
- Always use App Router
- Prefer Server Components when possible
- Use Server Actions for mutations
- Implement proper Row Level Security in Supabase
- Keep code clean, well-typed and maintainable

## Authentication
- Email + Password
- Google OAuth (via Supabase)
- Protected routes

## Current Status
This is an MVP project. Focus on quality and clean architecture.