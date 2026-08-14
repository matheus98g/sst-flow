# Plano de Implementação: Módulo de Criação de Checklists

**Spec:** [SPEC.md](../SPEC.md) · **Data:** 13/08/2026
**Status:** aguardando aprovação para implementar.

---

## Visão geral

Nove tarefas em quatro fases. As três primeiras montam o alicerce de dados (`Company`, `Sector`, template e itens) porque nada acima disso compila sem elas; as seis seguintes são fatias verticais — cada uma entrega uma tela funcionando de ponta a ponta e deixa o sistema em estado utilizável.

O drag-and-drop é deliberadamente a **última** fatia: o formulário nasce funcional com reordenação por botões, e o `@dnd-kit` entra como aprimoramento sobre algo que já funciona. Se a integração der problema (risco R4 da spec), o módulo já é entregável sem ela.

## Grafo de dependências

```
T1 schema + migration
 ├── T2 seed (empresa piloto, setores, vínculo de usuários)
 │    └── T4 listagem de templates ──┐
 └── T3 lib/company.ts + constants ──┤
      └── T5 validação (schema.ts) ──┴── T6 criação
                                          └── T7 edição + arquivar
                                               └── T8 drag-and-drop
                                                    └── T9 docs + verificação
```

## Decisões de arquitetura desta fase

- **Validação com Zod**, aprovado pelo usuário. Um único schema em `lib/checklists/schema.ts` usado tanto no cliente (feedback imediato) quanto na server action (fonte da verdade) — evita regra duplicada.
- **Server actions, não rotas de API.** Segue o padrão do projeto (Next 16, sem REST próprio fora do handler do Better Auth).
- **Um único `save` por submissão.** O formulário mantém o rascunho inteiro em estado no cliente e envia tudo de uma vez; não há salvamento incremental por item. Consequência direta da decisão D6/R6 da spec (sem autosave).
- **Update reescreve os itens dentro de `$transaction`** (`deleteMany` + `createMany`), resolvendo o conflito de `@@unique([templateId, position])` sem lógica de diff.
- **`companyId` nunca vem do cliente.** Toda action resolve a empresa via `lib/company.ts` a partir da sessão, e todo `where` de leitura inclui esse filtro.

## Fases

### Fase 1 — Alicerce (T1–T3)

Schema, seed e utilitários compartilhados. Nada visível ao usuário. É a parte de maior risco (toca o modelo do Better Auth e roda migration no Supabase), por isso vem primeiro e tem checkpoint próprio.

### Fase 2 — Leitura (T4)

A listagem, primeiro sinal visível de que o alicerce funciona. Entregue antes da escrita porque valida a resolução de empresa e as queries com um caminho muito mais simples de depurar.

### Fase 3 — Escrita (T5–T7)

Validação, criação e edição/arquivamento. Ao fim desta fase o módulo cumpre todos os critérios de sucesso da spec, exceto o arraste.

### Fase 4 — Aprimoramento e fechamento (T8–T9)

Drag-and-drop e atualização de documentação, com o roteiro de verificação manual completo no preview.

---

## Riscos desta implementação

| Risco | Impacto | Mitigação |
|---|---|---|
| Migration adiciona coluna em `user`, tabela do Better Auth em uso | Alto — quebraria login em produção | Coluna anulável e sem default; validar login no preview logo após T1, antes de seguir |
| `migrate deploy` roda dentro do `build` da Vercel | Médio — migration ruim derruba o deploy | Rodar `migrate dev` localmente contra o Supabase primeiro e conferir o SQL gerado antes do push |
| Seed rodando mais de uma vez duplica setores | Baixo | `upsert` com a chave `@@unique([companyId, name])` |
| `@dnd-kit` conflitando com o estado controlado do formulário | Médio | Ids de cliente estáveis por item (`crypto.randomUUID()`), nunca índice como key |
| Sem testes automatizados, regressão no filtro de empresa passa despercebida | Alto | Itens 5 e 8 do roteiro manual da spec, obrigatórios em T9 e em todo PR futuro do módulo |

## Questões em aberto

Nenhuma. Todas as decisões pendentes foram fechadas na spec.
