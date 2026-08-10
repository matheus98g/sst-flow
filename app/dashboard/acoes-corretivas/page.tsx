import {
  CalendarCheckIcon,
  CheckIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AcaoStatus = "vencida" | "pendente" | "encerrada";

type Acao = {
  id: string;
  status: AcaoStatus;
  titulo: string;
  setor: string;
  responsavel: string;
  origem: string;
  prazoLabel: string;
  prazoData: string;
};

const railByStatus: Record<AcaoStatus, string> = {
  vencida: "bg-destructive",
  pendente: "bg-warning",
  encerrada: "bg-success",
};

const acoes: Acao[] = [
  {
    id: "AC-2023-841",
    status: "vencida",
    titulo: "Reinstalar proteção da prensa 03",
    setor: "Estamparia",
    responsavel: "Carlos Eduardo",
    origem: "Inspeção de Rotina",
    prazoLabel: "Prazo",
    prazoData: "12/10/2023",
  },
  {
    id: "AC-2023-855",
    status: "pendente",
    titulo: "Sinalizar piso molhado",
    setor: "Logística",
    responsavel: "Ana Souza",
    origem: "Relato de Quase Acidente",
    prazoLabel: "Prazo",
    prazoData: "28/10/2023",
  },
  {
    id: "AC-2023-812",
    status: "encerrada",
    titulo: "Substituir extintor CO2 vazio",
    setor: "Montagem Final",
    responsavel: "Roberto Dias",
    origem: "Auditoria Externa",
    prazoLabel: "Concluído em",
    prazoData: "15/10/2023",
  },
];

const statusBadge: Record<
  AcaoStatus,
  { label: string; className: string; icon?: React.ReactNode }
> = {
  vencida: { label: "Vencida", className: "bg-destructive text-destructive-foreground" },
  pendente: {
    label: "Pendente",
    className: "bg-warning/15 text-warning border border-warning/30",
  },
  encerrada: {
    label: "Encerrada",
    className: "bg-success text-success-foreground",
    icon: <CheckIcon className="size-3" />,
  },
};

function FilterSelect({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <div className="min-w-50 flex-1">
      <label className="mb-1.5 block text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function AcoesCorretivasPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-primary">
            Gestão de Ações Corretivas
          </h2>
          <p className="text-muted-foreground">
            Acompanhamento e controle de desvios e não conformidades.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Métricas Rápidas
          </span>
          <div className="flex gap-2">
            <Badge variant="danger" mode="urgent">
              12 Vencidas
            </Badge>
            <Badge variant="warning">45 Pendentes</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4">
          <FilterSelect
            label="Status da Ação"
            defaultValue="Todos os Status"
            options={["Todos os Status", "Pendente", "Encerrada", "Validada", "Vencida"]}
          />
          <FilterSelect
            label="Setor de Risco"
            defaultValue="Todos os Setores"
            options={[
              "Todos os Setores",
              "Estamparia",
              "Montagem Final",
              "Usinagem",
              "Logística",
            ]}
          />
          <FilterSelect
            label="Origem do Desvio"
            defaultValue="Todas as Origens"
            options={[
              "Todas as Origens",
              "Inspeção de Rotina",
              "Auditoria Externa",
              "Relato de Quase Acidente",
              "CIPA",
            ]}
          />

          <div className="flex gap-2">
            <Button size="lg" className="h-10" disabled>
              <FilterIcon />
              Aplicar Filtros
            </Button>
            <Button variant="outline" size="lg" className="h-10" disabled>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 xl:grid-cols-3">
        {acoes.map((acao) => {
          const badge = statusBadge[acao.status];
          return (
            <Card key={acao.id} className="relative gap-0 pt-0">
              <div
                className={`absolute inset-y-0 left-0 w-1 ${railByStatus[acao.status]}`}
              />
              <CardContent className="flex-1 pt-4">
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${badge.className}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                  <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    ID: {acao.id}
                  </span>
                </div>

                <h3 className="font-heading mb-4 text-xl font-semibold text-foreground">
                  {acao.titulo}
                </h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Setor
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
                      <MapPinIcon className="size-4 text-muted-foreground" />
                      {acao.setor}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Responsável
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
                      <UserIcon className="size-4 text-muted-foreground" />
                      {acao.responsavel}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Origem
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
                      <SearchIcon className="size-4 text-muted-foreground" />
                      {acao.origem}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block text-xs font-bold tracking-wide uppercase ${
                        acao.status === "vencida"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {acao.prazoLabel}
                    </span>
                    <span
                      className={`mt-0.5 flex items-center gap-1.5 text-sm ${
                        acao.status === "vencida"
                          ? "font-bold text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      <CalendarCheckIcon className="size-4" />
                      {acao.prazoData}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-2 bg-muted/50">
                <Button variant="ghost" size="sm" disabled>
                  Ver Detalhes
                </Button>
                {acao.status !== "encerrada" && (
                  <Button size="sm" disabled>
                    Atualizar
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
