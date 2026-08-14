# Tarefas: Módulo de Criação de Checklists

Plano: [plan.md](plan.md) · Spec: [SPEC.md](../SPEC.md)

**Definição de pronto (vale para toda tarefa):** `pnpm lint` limpo, `pnpm build` passando, textos de UI em pt-BR, identificadores em inglês, nenhuma query sem filtro de `companyId`.

---

## Fase 1 — Alicerce

### T1: Schema Prisma e migration

**Descrição:** Criar os modelos `Company`, `Sector`, `ChecklistTemplate`, `ChecklistTemplateItem` e os enums `Criticality`, `AnswerType`, `RegulatoryStandard`. Adicionar `companyId String?` + relação em `User`.

**Critérios de aceitação:**
- [ ] Migration gerada e aplicada no Supabase criando as quatro tabelas, os enums e a coluna `user.company_id`.
- [ ] `user.company_id` é anulável e sem default; o `companyId` **não** é declarado em `additionalFields` do Better Auth.
- [ ] `pnpm exec prisma generate` produz o client com os novos tipos.

**Verificação:**
- [ ] `pnpm exec prisma migrate dev --name add_checklist_templates` — revisar o SQL gerado antes de aplicar.
- [ ] `pnpm build`
- [ ] **Manual, crítico:** fazer login no preview após aplicar a migration, confirmando que a alteração em `user` não quebrou o Better Auth.

**Dependências:** nenhuma · **Escopo:** S (2 arquivos)

**Arquivos:** `database/prisma/schema.prisma`, `database/prisma/migrations/*/migration.sql`

---

### T2: Seed da empresa piloto e setores

**Descrição:** Script de seed que cria a empresa piloto, seus setores e vincula os usuários já existentes a ela.

**Critérios de aceitação:**
- [ ] Cria a empresa piloto (nome confirmado com o time antes de rodar).
- [ ] Cria os setores iniciais via `upsert`, de forma que rodar o seed duas vezes não duplique nada.
- [ ] Usuários com `companyId` nulo passam a apontar para a empresa piloto.

**Verificação:**
- [ ] `pnpm exec tsx database/prisma/seed.ts` duas vezes seguidas — segunda execução não altera contagens.
- [ ] Conferir as linhas no Supabase.

**Dependências:** T1 · **Escopo:** S (1–2 arquivos)

**Arquivos:** `database/prisma/seed.ts`, `package.json` (script `db:seed`)

---

### T3: Resolução da empresa ativa e constantes

**Descrição:** `lib/company.ts` resolve a empresa da sessão (usa `user.companyId`; se nulo, cai para a empresa única; erro explícito se houver zero ou várias). `lib/checklists/constants.ts` com labels pt-BR de NR e criticidade.

**Critérios de aceitação:**
- [ ] `getActiveCompanyId()` retorna o id ou lança erro descritivo — nunca `null` silencioso.
- [ ] Labels cobrem todos os valores dos enums, sem string solta na UI.

**Verificação:**
- [ ] `pnpm build` (checagem de tipos cobre a exaustividade dos labels).
- [ ] Manual: consumido por T4.

**Dependências:** T1 · **Escopo:** S (2 arquivos)

**Arquivos:** `lib/company.ts`, `lib/checklists/constants.ts`

---

### ✅ Checkpoint — Alicerce

- [ ] `pnpm build` limpo.
- [ ] Login funcionando no preview **depois** da migration.
- [ ] Empresa e setores visíveis no Supabase.
- [ ] Revisar comigo antes da Fase 2.

---

## Fase 2 — Leitura

### T4: Listagem de templates

**Descrição:** Rota `/dashboard/inspecoes/checklists` listando os templates ativos da empresa, com estado vazio. Trocar o `ComingSoon` de `/dashboard/inspecoes` por um ponto de entrada que leve até aqui.

**Critérios de aceitação:**
- [ ] Tabela com título, NR, setor, nº de itens e data de criação.
- [ ] Query filtra por `companyId` da sessão e `archivedAt: null`.
- [ ] Estado vazio com chamada para criar o primeiro template.
- [ ] Botão "Novo checklist" apontando para `/novo` (rota ainda inexistente nesta tarefa).

**Verificação:**
- [ ] Manual no preview: com o banco vazio aparece o estado vazio; inserindo um template à mão no Supabase, ele aparece na tabela.
- [ ] Manual: usuário deslogado é redirecionado para `/sign-in`.

**Dependências:** T2, T3 · **Escopo:** M (3–4 arquivos)

**Arquivos:** `app/dashboard/inspecoes/checklists/page.tsx`, `components/checklists/checklist-template-list.tsx`, `app/dashboard/inspecoes/page.tsx`

---

## Fase 3 — Escrita

### T5: Validação e tipos compartilhados

**Descrição:** `lib/checklists/schema.ts` com schema Zod (`checklistDraftSchema`) e os tipos inferidos (`DraftItem`, `ChecklistDraft`).

**Critérios de aceitação:**
- [ ] `pnpm add zod`.
- [ ] Rejeita: título vazio ou só espaços, zero itens, item com texto vazio, enum inválido.
- [ ] Erros do `safeParse` mapeados por campo, consumíveis tanto pelo formulário quanto pela action.
- [ ] Mesmo schema usado no cliente e no servidor — sem regra duplicada.

**Verificação:**
- [ ] `pnpm build`
- [ ] Manual: coberto pelos casos de erro em T6.

**Dependências:** T1 · **Escopo:** XS (1 arquivo)

**Arquivos:** `lib/checklists/schema.ts`

---

### T6: Criação de template

**Descrição:** Rota `/novo` com o formulário completo (configuração geral + lista de itens) e a server action de criação. Reordenação nesta tarefa é por botões subir/descer.

**Critérios de aceitação:**
- [ ] Adicionar, editar e remover itens antes de salvar; numeração sempre sequencial na tela.
- [ ] Cada item tem texto e criticidade; tipo de resposta fixo em Conforme/Não conforme/N.A.
- [ ] Action revalida no servidor, resolve `companyId` da sessão e grava template + itens em `$transaction`.
- [ ] Erro de validação exibido no formulário sem perder o que foi digitado; nada persistido.
- [ ] Sucesso redireciona para a listagem, com o novo template visível.

**Verificação:**
- [ ] Manual, itens 1 e 5 do roteiro da spec.
- [ ] Manual: viewport de 375px utilizável.

**Dependências:** T4, T5 · **Escopo:** M (4 arquivos)

**Arquivos:** `components/checklists/checklist-form.tsx`, `components/checklists/checklist-item-row.tsx`, `app/dashboard/inspecoes/checklists/actions.ts`, `app/dashboard/inspecoes/checklists/novo/page.tsx`

---

### T7: Edição e arquivamento

**Descrição:** Rota `/[id]` reaproveitando o formulário de T6, mais as actions de update e archive.

**Critérios de aceitação:**
- [ ] Carrega o template com os itens na ordem correta; 404 se o template for de outra empresa.
- [ ] Update apaga e recria os itens dentro de `$transaction`, sem violar `@@unique([templateId, position])`.
- [ ] Arquivar preenche `archivedAt` (sem hard delete) e o template some da lista ativa.
- [ ] Arquivar pede confirmação.

**Verificação:**
- [ ] Manual, itens 2, 3 e 6 do roteiro da spec.
- [ ] Manual: acessar o `/[id]` de um template de outra empresa retorna 404.

**Dependências:** T6 · **Escopo:** M (3 arquivos)

**Arquivos:** `app/dashboard/inspecoes/checklists/[id]/page.tsx`, `app/dashboard/inspecoes/checklists/actions.ts`, `components/checklists/checklist-form.tsx`

---

### ✅ Checkpoint — Módulo funcional

- [ ] Criar, listar, editar e arquivar funcionando de ponta a ponta no preview.
- [ ] Todos os critérios de sucesso da spec atendidos, exceto o arraste.
- [ ] Revisar comigo antes da Fase 4.

---

## Fase 4 — Aprimoramento e fechamento

### T8: Reordenação por arraste

**Descrição:** Substituir os botões subir/descer pelo `@dnd-kit`, mantendo o suporte a teclado.

**Critérios de aceitação:**
- [ ] `pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.
- [ ] Arraste pela alça reordena os itens; a numeração acompanha.
- [ ] Reordenação por teclado funciona (Tab até a alça, Espaço, setas, Espaço) e é anunciada.
- [ ] Itens do rascunho usam id de cliente estável (`crypto.randomUUID()`) como key — nunca o índice.

**Verificação:**
- [ ] Manual, itens 3, 4 e 7 do roteiro da spec — incluindo arraste por toque no mobile.

**Dependências:** T7 · **Escopo:** S (2 arquivos)

**Arquivos:** `components/checklists/checklist-form.tsx`, `components/checklists/checklist-item-row.tsx`

---

### T9: Verificação completa e documentação

**Descrição:** Rodar o roteiro manual inteiro no preview e atualizar a documentação do projeto.

**Critérios de aceitação:**
- [ ] Os 8 itens do roteiro da seção 7 da spec executados, com evidência no PR.
- [ ] Item 8 (isolamento entre empresas) executado com uma segunda `Company` criada à mão — e desfeito depois.
- [ ] `docs/progresso-implementacao.md` atualizado com o módulo e com a pendência de `role`/autorização (R2).
- [ ] `CLAUDE.md` menciona o contrato de snapshot (D6) como restrição para o módulo de inspeções.

**Verificação:**
- [ ] Roteiro completo no preview da Vercel.
- [ ] `pnpm lint` e `pnpm build`.

**Dependências:** T8 · **Escopo:** S (2 arquivos + verificação)

**Arquivos:** `docs/progresso-implementacao.md`, `CLAUDE.md`

---

### ✅ Checkpoint — Pronto para merge

- [ ] Todos os critérios de sucesso da spec marcados.
- [ ] Roteiro manual completo, com evidência.
- [ ] PR aberto em pt-BR.
