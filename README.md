# nextjs-prisma-clerk-with-skills

A Next.js boilerplate pre-wired with [Prisma](https://prisma.io) (Postgres) and [Clerk](https://clerk.com) authentication, plus a set of agent skills (`.agents/`, `.claude/`, `.windsurf/`) for working with both in AI-assisted editors.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Prisma ORM 7](https://prisma.io) with a Postgres datasource
- [Clerk](https://clerk.com) for authentication (`@clerk/nextjs`, middleware in `proxy.ts`)
- Tailwind CSS 4
- TypeScript

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — a Postgres connection string. Run `npx create-db` to get a free hosted database in seconds.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from your [Clerk dashboard](https://dashboard.clerk.com).

3. Push the Prisma schema to your database:

   ```bash
   npx prisma migrate dev
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project structure

- `app/` — Next.js App Router pages, including Clerk's `sign-in` / `sign-up` routes
- `prisma/schema.prisma` — Prisma schema (Postgres datasource, client output at `app/generated/prisma`)
- `proxy.ts` — Clerk middleware
- `.agents/`, `.claude/`, `.windsurf/` — bundled agent skills for Prisma and Clerk workflows

## Using this as a template

This repo is meant to be cloned/forked as a starting point:

```bash
npx degit matheus98g/nextjs-prisma-clerk-with-skills my-app
cd my-app
pnpm install
cp .env.example .env
```

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Deploying to Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
