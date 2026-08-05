import { CheckCircleIcon } from "lucide-react";

const kpis = [
  { label: "Ações vencidas", value: 0, rail: "bg-destructive", text: "text-destructive" },
  { label: "Pendentes", value: 0, rail: "bg-warning", text: "text-warning" },
  { label: "Aguardando validação", value: 0, rail: "bg-primary", text: "text-primary" },
  { label: "Validadas no mês", value: 0, rail: "bg-success", text: "text-success" },
];

const pyramidTiers = [
  { label: "Acidentes", value: 1, className: "h-[30%] w-[60%] bg-destructive [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" },
  { label: "Quase acidentes", value: 5, className: "h-[30%] w-[80%] bg-warning [clip-path:polygon(15%_0%,85%_0%,100%_100%,0%_100%)]" },
  { label: "Relatos de risco", value: 14, className: "h-[40%] w-full bg-success [clip-path:polygon(15%_0%,85%_0%,100%_100%,0%_100%)]" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-primary">
            Visão Geral
          </h2>
          <p className="text-muted-foreground">
            Resumo da conformidade e status das ações (últimos 30 dias).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-4"
          >
            <div className={`absolute inset-y-0 left-0 w-1 ${kpi.rail}`} />
            <span className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              {kpi.label}
            </span>
            <span className={`font-heading text-5xl font-bold ${kpi.text}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:h-[400px] lg:grid-cols-3">
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <h3 className="font-heading text-lg font-semibold tracking-tight text-primary-foreground uppercase">
              Ações Críticas
            </h3>
            <button
              type="button"
              className="text-xs font-bold tracking-wide text-primary-foreground/70 uppercase hover:text-primary-foreground"
            >
              Ver todas
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
            <CheckCircleIcon className="mb-2 size-12 text-success" />
            <p className="text-muted-foreground">
              Nenhuma ação crítica pendente.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Todas as conformidades estão em dia.
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card lg:col-span-1">
          <div className="border-b border-border bg-muted px-4 py-3">
            <h3 className="font-heading text-base font-semibold tracking-tight text-primary uppercase">
              Pirâmide de Bird (30d)
            </h3>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-4">
            <div className="flex h-[200px] w-full max-w-[200px] flex-col items-center gap-0.5">
              {pyramidTiers.map((tier) => (
                <div
                  key={tier.label}
                  className={`flex items-center justify-center ${tier.className}`}
                >
                  <span className="font-heading text-xl font-semibold text-primary-foreground">
                    {tier.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="mb-1 text-xs font-bold tracking-wide text-primary uppercase">
                Insight de Prevenção
              </p>
              <p className="text-sm leading-snug text-muted-foreground italic">
                &ldquo;Volume de desvios menores antecipa a chance de acidente
                grave.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
