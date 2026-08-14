# Spec: Módulo de Criação de Checklists (Templates de Inspeção)

**Versão:** 0.1 · **Data:** 13/08/2026
**Escopo no PRD:** RF-01 (parcial: criação de templates). Ver [docs/resumo-projeto.md](docs/resumo-projeto.md).
**Status:** aguardando aprovação para passar à fase de plano.

---

## 1. Objetivo

Permitir que o engenheiro de segurança crie, edite e liste **templates de checklist** — o molde reutilizável a partir do qual o técnico inicia uma inspeção (RF-02). Hoje isso é feito no Microsoft Lists; este módulo é o primeiro passo para substituí-lo.

**Usuário-alvo:** engenheiro de segurança (administrador). Não é uma tela de campo — é desktop-first, embora responsiva.

**Fora de escopo desta entrega:**

- Execução da inspeção (RF-02 a RF-05) — consome os templates, mas é outro módulo.
- Ações corretivas, ocorrências, dashboard.
- CRUD de usuários e papéis (`role`) — segue pendente, ver [docs/progresso-implementacao.md](docs/progresso-implementacao.md).
- Duplicar template, biblioteca de templates prontos por NR, importação de planilha.

### Histórias de usuário

- Como engenheiro, crio um template com título, NR de referência, setor e uma lista ordenada de itens, para padronizar as inspeções da empresa.
- Como engenheiro, defino a criticidade de cada item (baixa/média/alta), para que a não conformidade correspondente já nasça priorizada.
- Como engenheiro, reordeno e removo itens antes de salvar, porque a redação do checklist é iterativa.
- Como engenheiro, vejo a lista de templates existentes e edito um deles, sem que isso corrompa o histórico de inspeções já realizadas.
- Como engenheiro, arquivo um template obsoleto para que ele não apareça mais ao iniciar novas inspeções, sem apagar o histórico.

---

## 2. Decisões de modelagem (tomadas nesta spec)

| # | Decisão | Justificativa |
|---|---|---|
| D1 | **Itens planos, sem seções**, com campo `secao: String?` livre no item | Mantém a tela próxima do esboço; agrupamento visual por `secao` pode ser adicionado depois sem migração destrutiva. Divergência consciente do RF-01. |
| D2 | **Criticidade obrigatória** por item (`BAIXA`/`MEDIA`/`ALTA`) | Alimenta a priorização das ações corretivas (RF-09). Estava ausente no esboço; foi adicionada. |
| D3 | **Só o tipo de resposta Conforme/Não conforme/N.A. no MVP**, mas modelado como enum extensível | A regra "não conforme ⇒ foto + ação obrigatória" (RF-03) só faz sentido nesse tipo. O esboço oferecia 4 tipos; os outros ficam para a fase 2. |
| D4 | **`Empresa` e `Setor` viram entidades**, com `companyId` em toda tabela de domínio | Atende o RNF-05 (isolamento por empresa desde o início do modelo) sem retrabalho futuro. Setor também é filtro central do sistema (RF-15) e precisa de integridade referencial. |
| D4a | `User` ganha `companyId` **anulável**; a empresa ativa é resolvida a partir do usuário da sessão, com fallback para a única empresa existente enquanto houver só uma | Coluna nova e anulável é ignorada pelo Better Auth (o adapter Prisma só escreve os campos que conhece), então não há risco para o fluxo de autenticação. O fallback evita bloquear usuários já cadastrados sem empresa. |
| D5 | **NR como enum no código**, não tabela | Lista fechada e estável de normas regulamentadoras; tabela seria overhead sem ganho. |
| D6 | **Sem versionamento de template; snapshot na inspeção** | Ao iniciar uma inspeção, os itens são copiados para dentro dela. O histórico (RF-05) fica íntegro sem a complexidade de versionar. **Contrato que o módulo de inspeção deverá honrar.** |
| D7 | Exclusão de template é **soft delete** (`arquivadoEm`) | Templates referenciados por inspeções não podem sumir. |
| D8 | **Drag-and-drop de itens com `@dnd-kit`**, com fallback acessível de teclado | Fiel ao esboço (alça `drag_indicator`). `@dnd-kit/core` + `@dnd-kit/sortable` suportam navegação por teclado nativamente, o que botões subir/descer também dariam — mas com pior ergonomia no mouse. |
| D9 | **Sem test runner**; verificação manual no preview da Vercel | Decisão explícita do time. Registrada como dívida técnica em R5. |

---

## 3. Modelo de dados

Adições a `database/prisma/schema.prisma`. Nomes de modelo/campo em inglês (convenção de código do CLAUDE.md), `@@map` para tabelas em snake_case.

```prisma
enum Criticality {
  LOW
  MEDIUM
  HIGH
}

enum AnswerType {
  COMPLIANCE // Conforme / Não conforme / N.A. — único habilitado na UI do MVP
}

enum RegulatoryStandard {
  NR_01 NR_05 NR_06 NR_07 NR_09 NR_10 NR_11 NR_12
  NR_13 NR_17 NR_18 NR_20 NR_23 NR_26 NR_33 NR_35
  OTHER
}

model Company {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sectors            Sector[]
  users              User[]
  checklistTemplates ChecklistTemplate[]

  @@map("company")
}

model Sector {
  id        String   @id @default(cuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  checklistTemplates ChecklistTemplate[]

  @@unique([companyId, name])
  @@index([companyId])
  @@map("sector")
}

model ChecklistTemplate {
  id        String              @id @default(cuid())
  companyId String
  company   Company             @relation(fields: [companyId], references: [id], onDelete: Cascade)
  title     String
  standard  RegulatoryStandard?
  sectorId  String?
  sector    Sector?             @relation(fields: [sectorId], references: [id], onDelete: SetNull)

  createdById String
  createdBy   User   @relation(fields: [createdById], references: [id])

  archivedAt DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  items ChecklistTemplateItem[]

  @@index([companyId, archivedAt])
  @@index([sectorId])
  @@map("checklist_template")
}

model ChecklistTemplateItem {
  id         String            @id @default(cuid())
  templateId String
  template   ChecklistTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  position    Int         // 0-based; define a ordem de exibição
  text        String
  section     String?     // agrupamento opcional (D1)
  criticality Criticality @default(MEDIUM)
  answerType  AnswerType  @default(COMPLIANCE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([templateId, position])
  @@index([templateId])
  @@map("checklist_template_item")
}
```

**Notas:**

- `User` ganha três coisas: `companyId String?`, a relação `company Company?` e o lado inverso `checklistTemplates ChecklistTemplate[]`. `companyId` é anulável e **não** é declarado em `additionalFields` do Better Auth — ele não participa do cadastro nem da sessão; é preenchido por seed/admin.
- `ChecklistTemplateItem` **não** carrega `companyId`: o isolamento vem por `templateId`. Toda leitura de item passa pelo template, que já é filtrado por empresa.
- **Regra de acesso:** toda query e mutação deste módulo filtra por `companyId` resolvido da sessão (`lib/company.ts`), nunca por um id vindo do cliente.
- `@@unique([templateId, position])` exige que a reordenação seja feita dentro de uma transação (rewrite completo das posições), para não colidir. Alternativa aceita: recriar todos os itens do template a cada save.
- `Sector` nasce sem CRUD próprio nesta entrega — será populado por seed. O CRUD é o RF-17, entrega separada.

**Resolução da empresa ativa** (`lib/company.ts`): lê o usuário da sessão; se `companyId` estiver preenchido, usa-o; senão, se existir exatamente uma `Company` no banco, usa essa e é o caso normal do MVP; se houver zero ou mais de uma, lança erro. Isso mantém a lógica correta desde já e falha de forma visível quando a segunda empresa entrar sem que o vínculo do usuário tenha sido feito.

---

## 4. Comandos

```
Dev:        pnpm dev
Build:      pnpm build          # prisma generate && prisma migrate deploy && next build
Lint:       pnpm lint
Migration:  pnpm exec prisma migrate dev --name add_checklist_templates
Gerar client: pnpm exec prisma generate
Seed:       pnpm exec tsx database/prisma/seed.ts   # empresa piloto + setores
Dependências novas: pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Sempre `pnpm`, nunca `npm`** — o lockfile é `pnpm-lock.yaml`.

---

## 5. Estrutura de arquivos

```
app/dashboard/inspecoes/checklists/page.tsx            → lista de templates (server component)
app/dashboard/inspecoes/checklists/novo/page.tsx       → criação
app/dashboard/inspecoes/checklists/[id]/page.tsx       → edição
app/dashboard/inspecoes/checklists/actions.ts          → server actions (create/update/archive)
components/checklists/checklist-form.tsx               → formulário completo (client component)
components/checklists/checklist-item-row.tsx           → linha de item (texto, criticidade, remover)
components/checklists/checklist-template-list.tsx      → tabela de templates
lib/checklists/schema.ts                               → schema Zod + tipos compartilhados
lib/checklists/constants.ts                            → labels pt-BR de NR e criticidade
lib/company.ts                                         → resolve a empresa ativa da sessão
database/prisma/schema.prisma                          → modelos acima
database/prisma/seed.ts                                → empresa piloto + setores iniciais
```

Rota escolhida sob `/dashboard/inspecoes/` (e não `/admin`) porque o template é o insumo direto da inspeção; a página `inspecoes` hoje é um `ComingSoon` e passa a listar inspeções + link para checklists.

---

## 6. Estilo de código

Segue o que já existe no projeto: componentes shadcn/ui de `components/ui/`, tokens do `app/globals.css` (`bg-card`, `text-muted-foreground`, `font-heading`), `cn()` de `lib/utils`. **Não** portar as cores/config do Tailwind CDN do esboço — a paleta do DESIGN.md já está nos tokens.

```tsx
// components/checklists/checklist-item-row.tsx
"use client";

import { GripVerticalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CRITICALITY_LABELS } from "@/lib/checklists/constants";
import type { DraftItem } from "@/lib/checklists/schema";

type ChecklistItemRowProps = {
  item: DraftItem;
  index: number;
  onChange: (item: DraftItem) => void;
  onRemove: () => void;
};

export function ChecklistItemRow({ item, index, onChange, onRemove }: ChecklistItemRowProps) {
  return (
    <li className="relative flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row">
      <span className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-muted" aria-hidden />
      {/* ... */}
    </li>
  );
}
```

Convenções: textos de UI em pt-BR, identificadores em inglês; `type` em vez de `interface` para props; server components por padrão, `"use client"` só onde há estado; logs via `lib/logger.ts`.

Do esboço, mantemos: header com voltar + título em `font-heading` uppercase, coluna esquerda de configuração geral, coluna direita de perguntas numeradas com rail vertical de 4px, área tracejada de "adicionar", footer sticky com Cancelar/Salvar. Descartamos: bloco de imagem decorativa, indicador "Rascunho não salvo" (não haverá autosave no MVP).

---

## 7. Estratégia de testes

**Decidido: sem test runner nesta entrega.** A verificação é integralmente manual, no preview da Vercel, conforme o CLAUDE.md ("features devem ser testadas no preview, não localmente"). Registrado como dívida técnica em R5.

Os portões automatizados que restam são `pnpm lint` e `pnpm build` (que inclui `prisma generate` e `migrate deploy`), obrigatórios antes do merge.

**Roteiro de verificação manual (obrigatório antes do merge):**

1. Criar template com 3 itens, criticidades diferentes → salvar → aparece na lista.
2. Recarregar a página de edição → itens vêm na ordem correta com os valores certos.
3. Reordenar itens por arraste, remover o do meio, salvar → ordem persistida sem buraco de `position`.
4. Reordenar **usando apenas o teclado** (Tab até a alça, Espaço, setas, Espaço) → funciona e anuncia a mudança.
5. Salvar sem título ou com zero itens → erro de validação exibido, nada persistido.
6. Arquivar um template → some da lista ativa.
7. Abrir em viewport de 375px → formulário utilizável e o arraste funciona com toque.
8. Com dois usuários de empresas diferentes (segunda `Company` criada à mão), confirmar que um não enxerga os templates do outro — validação do RNF-05.

---

## 8. Boundaries

**Sempre:**
- `pnpm`, nunca `npm`.
- Alterações de schema via `prisma migrate dev`, nunca pelo editor do Supabase.
- Textos de UI e documentação em pt-BR; código em inglês.
- Validar entrada no servidor dentro da server action, não só no cliente.
- Verificar sessão do Better Auth em toda server action antes de escrever no banco.
- Rodar `pnpm lint` e `pnpm build` antes de commitar.

- Filtrar toda leitura e escrita deste módulo por `companyId` da sessão.

**Perguntar antes:**
- Adicionar dependências além das já aprovadas (`@dnd-kit/*`, `zod`).
- Alterar modelos existentes do Better Auth além do `companyId` anulável em `User` (D4a).
- Mudar as rotas ou a navegação da sidebar.
- Qualquer decisão que reabra os itens da seção 2.

**Nunca:**
- Usar ferramentas de browser/devtools para testar localmente (CLAUDE.md) sem pedido explícito.
- Hard delete de template.
- Commitar segredos ou `.env`.
- Copiar a config do Tailwind CDN do esboço para o projeto.

---

## 9. Critérios de sucesso

- [ ] Migration aplicada criando `company`, `sector`, `checklist_template`, `checklist_template_item`, a coluna `user.company_id` e os enums.
- [ ] Seed cria a empresa piloto e os setores usados por ela, e vincula os usuários existentes a ela.
- [ ] Nenhuma query do módulo retorna dado de outra empresa (item 8 do roteiro).
- [ ] Itens reordenáveis por arraste e por teclado.
- [ ] `/dashboard/inspecoes/checklists` lista templates ativos com título, NR, setor, nº de itens e data.
- [ ] `/dashboard/inspecoes/checklists/novo` cria um template com N itens em uma única submissão.
- [ ] `/dashboard/inspecoes/checklists/[id]` carrega e atualiza um template existente, incluindo reordenação e remoção de itens.
- [ ] Validação bloqueia: título vazio, template sem itens, item com texto vazio.
- [ ] Usuário não autenticado é redirecionado para `/sign-in`.
- [ ] Arquivar remove da lista ativa sem apagar o registro.
- [ ] Roteiro da seção 7 executado no preview da Vercel, com evidência no PR.
- [ ] `docs/progresso-implementacao.md` atualizado.

---

## 10. Riscos e questões em aberto

| # | Item | Impacto | Encaminhamento |
|---|---|---|---|
| R1 | Usuários já cadastrados no Supabase ficam sem `companyId` até o seed rodar | Erro na resolução da empresa ativa | Resolvido: o seed vincula os usuários existentes à empresa piloto, e `lib/company.ts` tem o fallback de empresa única (D4a) |
| R2 | Sem campo `role` no `User`, qualquer usuário autenticado pode criar templates | Controle de acesso ausente no MVP | Aceito para os testes de tela. A autorização entra junto com o RF-17. O isolamento por empresa, esse sim, já vale desde agora |
| R3 | Reordenação com `@@unique([templateId, position])` exige transação cuidadosa | Erro de constraint em edição | Estratégia definida: apagar e recriar os itens do template dentro de `$transaction` no update |
| R4 | `@dnd-kit` em lista dentro de formulário controlado pode conflitar com o estado do React | Bug de reordenação difícil de diagnosticar | Aprovado. Mitigação: itens do rascunho com id de cliente estável (`crypto.randomUUID()`), nunca o índice como key |
| R5 | Sem test runner, validação e regra de isolamento por empresa ficam sem cobertura automatizada | Dívida técnica: regressão silenciosa no filtro de `companyId` é justamente o tipo de bug que teste pega e revisão não | Aceito. Mitigação: itens 5 e 8 do roteiro manual são obrigatórios em todo PR que toque neste módulo. Reavaliar quando o módulo de inspeções entrar |
| R6 | O esboço mostra "Rascunho não salvo", sugerindo autosave | Expectativa de UX não atendida | Decidido: sem autosave no MVP; o indicador foi removido |
