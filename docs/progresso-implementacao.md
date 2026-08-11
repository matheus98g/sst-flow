# Progresso de implementação

Checklist do que já foi feito no projeto, fora do PRD (ver [resumo-projeto.md](resumo-projeto.md)). Atualizar conforme o desenvolvimento avança.

## Autenticação (Better Auth)

- [x] Remoção completa do Clerk (`@clerk/nextjs`, middleware, páginas `sign-in`/`sign-up`, skills de agente `clerk-*`, variáveis de ambiente)
- [x] Banco de dados migrado para Postgres hospedado no Supabase (`DATABASE_URL` via connection pooler, `DIRECT_URL` para migrations)
- [x] Prisma 7 configurado com driver adapter (`@prisma/adapter-pg`), exigido a partir dessa versão
- [x] Better Auth instalado e configurado (`lib/auth.ts`), adapter Prisma, autenticação por e-mail/senha com verificação obrigatória
- [x] Client React do Better Auth (`lib/auth-client.ts`)
- [x] Route handler (`app/api/auth/[...all]/route.ts`)
- [x] Schema Prisma gerado (`User`, `Session`, `Account`, `Verification`) e migration aplicada no Supabase
- [x] Envio de e-mail transacional via Resend (`lib/email.ts`) — verificação de conta e redefinição de senha
- [x] shadcn/ui inicializado no projeto (`components.json`, `components/ui/*`)
- [x] Páginas de autenticação com shadcn/ui: `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`
- [x] Proteção de rota via `proxy.ts` (convenção do Next.js 16, substitui `middleware.ts`) — atualmente protege `/dashboard`
- [x] Página `/dashboard` de demonstração (protegida, mostra usuário logado, botão de sair)
- [x] Fluxo testado ponta a ponta no navegador: cadastro → e-mail de verificação → confirmação → login automático → acesso ao dashboard
- [x] Fluxo de "esqueci minha senha" testado ponta a ponta: solicitação → e-mail de redefinição enviado
- [x] Bloqueio de login para conta com e-mail não verificado, testado
- [x] Bloqueio de acesso não autenticado a `/dashboard` (redireciona para `/sign-in?redirect=...`), testado

### Pendências conhecidas

- [x] Corrigido warning "Base URL is not set" do Better Auth em produção — `lib/auth.ts` agora deriva `baseURL` das variáveis de sistema da Vercel (`VERCEL_PROJECT_PRODUCTION_URL` em produção, `VERCEL_URL` em previews, com fallback para `BETTER_AUTH_URL` em dev local), cobrindo também os preview deployments, que têm URL dinâmica
- [ ] Campos `role` (papel) e `setor` no modelo de usuário — adiado deliberadamente; schema do Better Auth está no formato padrão (sem esses campos)
- [ ] CRUD de administração de usuários e setores (RF-17)
- [ ] Autenticação social/2FA/organizations — fora de escopo por enquanto
- [ ] SSO/LDAP — fora de escopo do MVP (ver §1.4 do PRD)
