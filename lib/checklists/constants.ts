import type { Criticality, RegulatoryStandard } from "@/database/prisma/generated/client";

export const CRITICALITY_LABELS: Record<Criticality, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const CRITICALITY_OPTIONS = (
  Object.entries(CRITICALITY_LABELS) as [Criticality, string][]
).map(([value, label]) => ({ value, label }));

export const REGULATORY_STANDARD_LABELS: Record<RegulatoryStandard, string> = {
  NR_01: "NR-01 Disposições Gerais e Gerenciamento de Riscos Ocupacionais",
  NR_05: "NR-05 Comissão Interna de Prevenção de Acidentes e de Assédio",
  NR_06: "NR-06 Equipamento de Proteção Individual",
  NR_07: "NR-07 Programa de Controle Médico de Saúde Ocupacional",
  NR_09: "NR-09 Avaliação e Controle das Exposições Ocupacionais",
  NR_10: "NR-10 Segurança em Instalações e Serviços em Eletricidade",
  NR_11: "NR-11 Transporte, Movimentação, Armazenagem e Manuseio de Materiais",
  NR_12: "NR-12 Segurança no Trabalho em Máquinas e Equipamentos",
  NR_13: "NR-13 Caldeiras, Vasos de Pressão e Tubulações",
  NR_17: "NR-17 Ergonomia",
  NR_18: "NR-18 Condições de Segurança na Indústria da Construção",
  NR_20: "NR-20 Inflamáveis e Combustíveis",
  NR_23: "NR-23 Proteção Contra Incêndios",
  NR_26: "NR-26 Sinalização de Segurança",
  NR_33: "NR-33 Espaços Confinados",
  NR_35: "NR-35 Trabalho em Altura",
  OTHER: "Outra",
};

export const REGULATORY_STANDARD_OPTIONS = (
  Object.entries(REGULATORY_STANDARD_LABELS) as [RegulatoryStandard, string][]
).map(([value, label]) => ({ value, label }));
