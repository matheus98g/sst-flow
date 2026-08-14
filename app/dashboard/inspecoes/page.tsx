import {
  AccessibilityIcon,
  CheckCircle2Icon,
  EyeIcon,
  FactoryIcon,
  FilterIcon,
  FireExtinguisherIcon,
  PlayIcon,
  SearchIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InspecaoStatus = "andamento" | "concluida";

type Inspecao = {
  id: string;
  titulo: string;
  icon: LucideIcon;
  status: InspecaoStatus;
  dataLabel: string;
  data: string;
  tecnico: string;
  setor: string;
  naoConformidades: number;
  progresso: number;
};

const railByStatus: Record<InspecaoStatus, string> = {
  andamento: "bg-warning",
  concluida: "bg-success",
};

const statusBadge: Record<InspecaoStatus, { label: string }> = {
  andamento: { label: "Em andamento" },
  concluida: { label: "Concluída" },
};

const inspecoes: Inspecao[] = [
  {
    id: "insp-nr12",
    titulo: "Checklist NR-12 — Máquinas",
    icon: FactoryIcon,
    status: "andamento",
    dataLabel: "Data de Início",
    data: "24 Out, 08:30",
    tecnico: "Carlos Silva",
    setor: "Usinagem",
    naoConformidades: 2,
    progresso: 65,
  },
  {
    id: "insp-epi",
    titulo: "Checklist EPI",
    icon: AccessibilityIcon,
    status: "concluida",
    dataLabel: "Data de Conclusão",
    data: "23 Out, 16:45",
    tecnico: "Ana Paula",
    setor: "Soldagem",
    naoConformidades: 0,
    progresso: 100,
  },
  {
    id: "insp-extintores",
    titulo: "Inspeção de extintores",
    icon: FireExtinguisherIcon,
    status: "concluida",
    dataLabel: "Data de Conclusão",
    data: "20 Out, 11:20",
    tecnico: "Marcos Mendes",
    setor: "Galpão Central",
    naoConformidades: 0,
    progresso: 100,
  },
];

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
    <div className="w-full md:w-48">
      <label className="sr-only">{label}</label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
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

export default function InspecoesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
            Inspeções Ativas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie e monitore as vistorias de segurança da unidade.
          </p>
        </div>
        <Button size="lg" className="h-11" disabled>
          <PlayIcon />
          Iniciar Inspeção
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 md:flex-row md:items-center">
          <div className="mr-2 hidden items-center gap-1.5 text-muted-foreground md:flex">
            <FilterIcon className="size-4" />
            <span className="text-xs font-bold tracking-wide uppercase">Filtros</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:flex md:w-auto">
            <FilterSelect
              label="Setor"
              defaultValue="Setor: Todos"
              options={["Setor: Todos", "Produção", "Manutenção", "Logística"]}
            />
            <FilterSelect
              label="Status"
              defaultValue="Status: Todos"
              options={["Status: Todos", "Em andamento", "Concluída", "Atrasada"]}
            />
          </div>

          <div className="relative w-full md:ml-auto md:w-64">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar checklist..." className="h-9 pl-8" disabled />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 pb-6">
        {inspecoes.map((inspecao) => {
          const Icon = inspecao.icon;
          const badge = statusBadge[inspecao.status];
          return (
            <Card key={inspecao.id} className="relative flex-row gap-0 overflow-hidden p-0">
              <div className={`absolute inset-y-0 left-0 w-1 ${railByStatus[inspecao.status]}`} />

              <CardContent className="flex flex-1 flex-col justify-between gap-3 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 text-muted-foreground" />
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {inspecao.titulo}
                    </h3>
                  </div>
                  <Badge variant={inspecao.status === "andamento" ? "warning" : "success"}>
                    {badge.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {inspecao.dataLabel}
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground">{inspecao.data}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Técnico Responsável
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground">{inspecao.tecnico}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Setor
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground">{inspecao.setor}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      Não Conformidades
                    </span>
                    <span
                      className={`mt-0.5 flex items-center gap-1.5 text-sm font-bold ${
                        inspecao.naoConformidades > 0 ? "text-warning" : "text-success"
                      }`}
                    >
                      {inspecao.naoConformidades > 0 ? (
                        <TriangleAlertIcon className="size-4" />
                      ) : (
                        <CheckCircle2Icon className="size-4" />
                      )}
                      {inspecao.naoConformidades} detectadas
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="flex w-32 shrink-0 flex-col items-center justify-end gap-2 border-l border-border bg-muted/30 p-4">
                <div className="mb-auto hidden w-full text-center md:block">
                  <span
                    className={`text-2xl font-heading ${
                      inspecao.status === "concluida" ? "text-success" : "text-foreground"
                    }`}
                  >
                    {inspecao.progresso}%
                  </span>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={railByStatus[inspecao.status] + " h-full"}
                      style={{ width: `${inspecao.progresso}%` }}
                    />
                  </div>
                </div>

                {inspecao.status === "andamento" ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Continuar
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    <EyeIcon />
                    Relatório
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pb-6">
        <Button variant="outline" disabled>
          Carregar Mais Inspeções
        </Button>
      </div>
    </div>
  );
}
