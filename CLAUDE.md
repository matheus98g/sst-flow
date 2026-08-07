# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## Project

Sistema de Gestão de Segurança do Trabalho — see [docs/resumo-projeto.md](docs/resumo-projeto.md) for the full PRD (users/roles, functional/non-functional requirements, data model, roadmap), and [docs/progresso-implementacao.md](docs/progresso-implementacao.md) for a running checklist of what's actually been built (vs. planned in the PRD).

## Idioma

- Responda sempre em português do Brasil (pt-BR).
- Commits e PRs (título e descrição) devem ser escritos em pt-BR.
- Todo conteúdo criado fora do código-fonte (documentação, textos de UI, labels, etc.) deve ser em pt-BR.
- Exceção: o código-fonte em si — nomes de variáveis, funções, classes, arquivos e demais identificadores — permanece em inglês (en-US), seguindo as convenções padrão de código.

## Stack

- Next.js 16 (App Router)
- Prisma ORM 7 with the `@prisma/adapter-pg` driver adapter (required as of Prisma 7 — plain `new PrismaClient()` without an adapter throws), Postgres datasource hosted on Supabase, client output at `app/generated/prisma`
- Better Auth for authentication, email delivery via Resend
- shadcn/ui + Tailwind CSS 4
- TypeScript

## Database

Postgres is hosted on **Supabase**. Prisma connects to it via `DATABASE_URL` (see `.env.example`) — use Supabase's connection pooler URL for the app runtime and the direct connection for migrations if a separate `DIRECT_URL` is configured. Schema changes go through Prisma Migrate (`prisma migrate dev` / `prisma migrate deploy`), not the Supabase dashboard's table editor, so the Prisma schema stays the source of truth.

## Authentication

This project uses **Better Auth**. Better Auth is self-hosted: sessions and user records live in this project's own Supabase Postgres database via the Prisma adapter, not in a third-party auth provider. This is a deliberate choice to keep full control over session and user data (querying, revoking, and joining users/sessions directly against project data — e.g. `setor`/`empresa_id` scoping described in the PRD).

When implementing or touching auth:
- Use the `better-auth-best-practices`, `better-auth-security-best-practices`, `create-auth`, `email-and-password-best-practices`, `organization-best-practices`, and `two-factor-authentication-best-practices` skills under `.claude/skills/` / `.agents/skills/`.
- Server config: `lib/auth.ts`. Client: `lib/auth-client.ts`. Route handler: `app/api/auth/[...all]/route.ts`. Route protection: `proxy.ts` (Next 16's `middleware.ts` replacement — currently only guards `/dashboard`).
- Auth pages live under `app/(auth)/` (`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`), built with shadcn/ui components from `components/ui/`.
- Env vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL` (Supabase pooler URL), `DIRECT_URL` (Supabase direct connection, for migrations), `RESEND_API_KEY`, `RESEND_FROM_EMAIL` — see `.env.example`.
- The PRD's roles (engenheiro de segurança, técnico de segurança, colaborador operacional) and setor-based visibility (RF-17, RF-18, §2) should map onto Better Auth's user/session model plus the Prisma schema — not onto a third-party provider's org/role primitives. **Not implemented yet** — the current `User` model is Better Auth's stock schema with no `role`/`setor` fields; see [docs/progresso-implementacao.md](docs/progresso-implementacao.md) for what's pending.
