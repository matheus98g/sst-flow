# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## Project

Sistema de Gestão de Segurança do Trabalho — see [docs/resumo-projeto.md](docs/resumo-projeto.md) for the full PRD (users/roles, functional/non-functional requirements, data model, roadmap).

## Stack

- Next.js 16 (App Router)
- Prisma ORM 7, Postgres datasource hosted on Supabase, client output at `app/generated/prisma`
- Better Auth for authentication
- Tailwind CSS 4
- TypeScript

## Database

Postgres is hosted on **Supabase**. Prisma connects to it via `DATABASE_URL` (see `.env.example`) — use Supabase's connection pooler URL for the app runtime and the direct connection for migrations if a separate `DIRECT_URL` is configured. Schema changes go through Prisma Migrate (`prisma migrate dev` / `prisma migrate deploy`), not the Supabase dashboard's table editor, so the Prisma schema stays the source of truth.

## Authentication

This project uses **Better Auth**. Better Auth is self-hosted: sessions and user records live in this project's own Supabase Postgres database via the Prisma adapter, not in a third-party auth provider. This is a deliberate choice to keep full control over session and user data (querying, revoking, and joining users/sessions directly against project data — e.g. `setor`/`empresa_id` scoping described in the PRD).

When implementing or touching auth:
- Use the `better-auth-best-practices`, `better-auth-security-best-practices`, `create-auth`, `email-and-password-best-practices`, `organization-best-practices`, and `two-factor-authentication-best-practices` skills under `.claude/skills/` / `.agents/skills/`.
- Auth config lives in `auth.ts` (server) once scaffolded.
- Env vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL` (Supabase pooler URL), `DIRECT_URL` (Supabase direct connection, for migrations) — see `.env.example`.
- The PRD's roles (engenheiro de segurança, técnico de segurança, colaborador operacional) and setor-based visibility (RF-17, RF-18, §2) should map onto Better Auth's user/session model plus the Prisma schema — not onto a third-party provider's org/role primitives.
