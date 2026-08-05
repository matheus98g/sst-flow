# PRD — Sistema de Gestão de Segurança do Trabalho
**Versão:** 0.1 (rascunho inicial) · **Data:** 19/07/2026
**Autores:** Nairo Sanches, Matheus Gollmann · **Especialista de domínio:** Abner Costa da Silva

---

## 1. Visão geral

### 1.1 Problema
A gestão de segurança do trabalho na empresa é feita hoje com Microsoft Lists, que funciona apenas como captura de dados. A ferramenta não permite definir prazos, não gera ações a partir de não conformidades, não notifica responsáveis e torna o acompanhamento de pendências manual e trabalhoso. Não há suporte estruturado para investigação de acidentes, relatos de perigo ou quase-acidentes, e documentos obrigatórios (PGR, PCMSO) são produzidos fora do sistema.

### 1.2 Solução proposta
Aplicação web dedicada e responsiva que transforma toda não conformidade ou ocorrência em uma **ação rastreável com responsável, prazo e evidência de encerramento**. O sistema centraliza checklists de inspeção, registro de ocorrências e gestão de ações corretivas, com visibilidade de pendências por setor e responsável.

### 1.3 Objetivos do MVP
- Substituir o Microsoft Lists como ferramenta de checklists e inspeções.
- Garantir que nenhuma não conformidade fique sem ação, responsável e prazo.
- Reduzir o esforço manual de acompanhamento de pendências (hoje o maior gargalo).
- Validar o produto na operação da CBT como case de sucesso para futura comercialização.

### 1.4 Fora de escopo do MVP (fases futuras)
- Geração automática de PGR e PCMSO.
- Integração com folha de pagamento (mudanças de setor × riscos associados).
- Autenticação via LDAP corporativo (MVP usa login por e-mail/senha com domínio corporativo).
- Matriz completa de riscos ocupacionais (químicos, físicos, biológicos, de acidente).
- Controle de acesso/ponto com biometria facial (catracas).
- Módulo comercial multi-empresa (multi-tenancy completo).

---

## 2. Usuários e permissões

| Papel | Descrição | Permissões principais |
|---|---|---|
| **Engenheiro de segurança** | Administrador do sistema | Cria/edita templates de checklist, configura setores e usuários, valida ou reabre ações, acessa todos os dashboards |
| **Técnico de segurança** | Executor de campo | Executa inspeções, registra ocorrências, cria ações corretivas, acompanha pendências dos setores sob sua responsabilidade |
| **Colaborador operacional** | Responsável por ações | Visualiza ações atribuídas a si, encerra ações com justificativa e foto, insere justificativas de não conformidade |

Regras gerais: todo usuário pertence a um ou mais setores; a visibilidade de dados do colaborador operacional é restrita às suas próprias ações.

---

## 3. Requisitos funcionais

### 3.1 Módulo de Checklists e Inspeções
- **RF-01** — Engenheiro cria templates de checklist com itens agrupados por seção; cada item tem texto, tipo de resposta (Conforme / Não conforme / N.A.) e criticidade (baixa, média, alta).
- **RF-02** — Técnico inicia uma inspeção a partir de um template, vinculada a um setor e data.
- **RF-03** — Ao marcar um item como **Não conforme**, o sistema exige obrigatoriamente: descrição do problema, foto (câmera ou upload) e criação de uma ação corretiva (responsável + prazo).
- **RF-04** — Inspeção só pode ser concluída quando todos os itens estiverem respondidos.
- **RF-05** — Inspeções concluídas ficam disponíveis para consulta com histórico completo (quem respondeu, quando, evidências).

### 3.2 Módulo de Ocorrências
- **RF-06** — Formulário único de registro com tipo: **Acidente**, **Quase-acidente** ou **Relato de perigo**. Campos: data, setor, descrição, envolvidos (opcional), medidas corretivas imediatas.
- **RF-07** — Todo registro de ocorrência permite (e para acidentes, exige) a criação de uma ou mais ações corretivas.
- **RF-08** — Ocorrências alimentam contadores por tipo e setor para futura visualização da Pirâmide de Bird (relação entre volume de desvios menores e probabilidade de acidentes graves).

### 3.3 Módulo de Ações Corretivas (núcleo do sistema)
- **RF-09** — Ação corretiva contém: origem (item de inspeção ou ocorrência), descrição, setor, responsável, prazo, status (**Pendente → Em andamento → Encerrada → Validada** ou **Reaberta**), e evidências.
- **RF-10** — Encerramento de ação exige justificativa textual e permite anexar foto de evidência.
- **RF-11** — Engenheiro valida o encerramento ou reabre a ação com comentário; ação reaberta volta para a fila do responsável.
- **RF-12** — Notificações por e-mail: atribuição de ação, ação a 3 dias do vencimento, ação vencida.
- **RF-13** — Ações vencidas ficam destacadas visualmente em todas as listagens.

### 3.4 Dashboard e relatórios
- **RF-14** — Dashboard inicial por papel: engenheiro vê visão geral (ações por status, por setor, vencidas); técnico vê seus setores; operacional vê apenas suas ações.
- **RF-15** — Filtros por setor, responsável, status, período e origem.
- **RF-16** — Exportação de listagens em planilha (CSV/XLSX) para relatórios externos.

### 3.5 Administração
- **RF-17** — CRUD de usuários (nome, e-mail, papel, setores) e de setores.
- **RF-18** — Autenticação por e-mail e senha via Better Auth (self-hosted, sessões e usuários armazenados no banco Postgres do próprio projeto, hospedado no Supabase); recuperação de senha por e-mail. Arquitetura deve prever adição futura de SSO/LDAP via plugins do Better Auth.

---

## 4. Requisitos não funcionais

- **RNF-01** — Aplicação web responsiva; execução de inspeções deve funcionar bem em celular (uso em campo, com câmera).
- **RNF-02** — Upload de fotos com compressão no cliente (alvo: ≤ 1 MB por imagem).
- **RNF-03** — Trilha de auditoria: toda mudança de status de ação registra usuário e data/hora.
- **RNF-04** — Custo de infraestrutura alvo: ~US$ 50/mês (VPS ou serviços gerenciados de entrada).
- **RNF-05** — Dados isolados por empresa desde o início do modelo de dados (campo `empresa_id`), mesmo com uma única empresa no MVP, para viabilizar comercialização futura sem retrabalho.
- **RNF-06** — Disponibilidade alvo do MVP: horário comercial; backups diários do banco.

---

## 5. Modelo de dados (alto nível)

```
Empresa 1─N Setor
Empresa 1─N Usuario (papel: engenheiro | tecnico | operacional; N─N Setor)
TemplateChecklist 1─N ItemTemplate
Inspecao (template, setor, executor, status) 1─N RespostaItem (item, resultado, foto?, obs?)
Ocorrencia (tipo, setor, data, descricao, envolvidos?)
Acao (origem: RespostaItem | Ocorrencia; responsavel, prazo, status, evidencias, historico)
```

A entidade **Ação** é o coração do sistema: inspeções e ocorrências convergem para ela, e o dashboard é essencialmente uma visão sobre ações.

---

## 6. Fluxo principal (happy path)

1. Engenheiro cria template de checklist e cadastra setores/usuários.
2. Técnico inicia inspeção no celular e responde item a item.
3. Item não conforme → modal obrigatório: foto + descrição + responsável + prazo → ação criada.
4. Responsável recebe e-mail e vê a ação no seu painel.
5. Responsável encerra a ação com justificativa e foto de evidência.
6. Engenheiro valida o encerramento (ou reabre com comentário).
7. Dashboard reflete o status em tempo real; ações vencidas geram alerta.

---

## 7. Telas do MVP

1. Login / recuperação de senha
2. Dashboard (variante por papel)
3. Lista de inspeções + iniciar nova
4. Execução de checklist (mobile-first, com modal de não conformidade)
5. Registro de ocorrência
6. Lista de ações (filtros) + detalhe da ação (encerrar / validar / reabrir)
7. Administração: templates, usuários, setores

---

## 8. Métricas de sucesso

- 100% das inspeções da CBT migradas do Microsoft Lists em até 60 dias após o go-live.
- Zero não conformidades sem ação atribuída (garantido por design).
- Redução do tempo semanal gasto pelo engenheiro no acompanhamento de pendências (medir baseline atual antes do go-live).
- % de ações encerradas dentro do prazo (alvo inicial: ≥ 70%).

---

## 9. Riscos e questões em aberto

| # | Questão | Dono | Status |
|---|---|---|---|
| 1 | Lista definitiva de campos do formulário de incidentes (validar com documentos do Abner) | Abner | Aberto |
| 2 | Política de notificações: só e-mail no MVP ou também WhatsApp/push? | Nairo/Matheus | Aberto |
| 3 | Quem pode criar ações "avulsas" (sem origem em inspeção/ocorrência)? | Abner | Aberto |
| 4 | Formalização do contrato de parceria (divisão 50/50, propriedade do código, uso do case CBT) | Todos | Aberto |
| 5 | LGPD: fotos podem conter pessoas identificáveis — definir política de retenção e consentimento | Todos | Aberto |
| 6 | Stack tecnológica: Next.js + Prisma (Postgres via Supabase) + Better Auth definidos; demais escolhas seguem a definir | Nairo/Matheus | Em andamento |

---

## 10. Roadmap resumido

- **Fase 0 (atual):** PRD, mapeamento de fluxo, protótipos de tela, apresentação ao Abner.
- **Fase 1 (MVP):** módulos de checklist, ocorrências, ações e dashboard; piloto na CBT.
- **Fase 2:** Pirâmide de Bird visual, relatórios avançados, SSO/LDAP, gestão de riscos ocupacionais.
- **Fase 3:** geração de PGR/PCMSO, integração com folha, preparação multi-tenant para comercialização.
- **Fase 4 (exploratório):** controle de ponto/acesso com biometria facial.