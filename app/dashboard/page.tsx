import { CheckCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  { label: "Ações vencidas", value: 0, rail: "bg-destructive", text: "text-destructive" },
  { label: "Pendentes", value: 0, rail: "bg-warning", text: "text-warning" },
  { label: "Aguardando validação", value: 0, rail: "bg-primary", text: "text-primary" },
  { label: "Validadas no mês", value: 0, rail: "bg-success", text: "text-success" },
];

// Bands of a single triangle (apex at 50,0; base corners at 0,100 / 100,100),
// so edges line up continuously instead of being clipped per-tier.
const pyramidTiers = [
  { label: "Acidentes", value: 1, points: "50,0 65,30 35,30", fill: "fill-destructive", labelPos: { x: 50, y: 22 } },
  { label: "Quase acidentes", value: 5, points: "35,30 65,30 80,60 20,60", fill: "fill-warning", labelPos: { x: 50, y: 48 } },
  { label: "Relatos de risco", value: 14, points: "20,60 80,60 100,100 0,100", fill: "fill-success", labelPos: { x: 50, y: 83 } },
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
          <Card key={kpi.label} className="relative">
            <div className={`absolute inset-y-0 left-0 w-1 ${kpi.rail}`} />
            <CardContent className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {kpi.label}
              </span>
              <span className={`font-heading text-5xl font-bold ${kpi.text}`}>
                {kpi.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:h-[400px] lg:grid-cols-3">
        <Card className="gap-0 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between rounded-t-xl bg-primary py-3">
            <CardTitle className="text-lg text-primary-foreground uppercase">
              Ações Críticas
            </CardTitle>
            <button
              type="button"
              className="text-xs font-bold tracking-wide text-primary-foreground/70 uppercase hover:text-primary-foreground"
            >
              Ver todas
            </button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-1 py-6 text-center">
            <CheckCircleIcon className="mb-2 size-12 text-success" />
            <p className="text-muted-foreground">
              Nenhuma ação crítica pendente.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Todas as conformidades estão em dia.
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0 bg-muted lg:col-span-1">
          <CardHeader className="rounded-t-xl py-3">
            <CardTitle className="text-base text-primary uppercase">
              Pirâmide de Bird (30d)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
            <svg
              viewBox="0 0 100 100"
              className="h-[200px] w-full max-w-[200px]"
              role="img"
              aria-label="Pirâmide de Bird"
            >
              {pyramidTiers.map((tier) => (
                <polygon key={tier.label} points={tier.points} className={tier.fill} />
              ))}
              {pyramidTiers.map((tier) => (
                <text
                  key={tier.label}
                  x={tier.labelPos.x}
                  y={tier.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-primary-foreground font-heading text-[11px] font-semibold"
                >
                  {tier.value}
                </text>
              ))}
            </svg>

            <Card size="sm" className="text-center">
              <CardContent>
                <p className="mb-1 text-xs font-bold tracking-wide text-primary uppercase">
                  Insight de Prevenção
                </p>
                <p className="text-sm leading-snug text-muted-foreground italic">
                  &ldquo;Volume de desvios menores antecipa a chance de acidente
                  grave.&rdquo;
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
