import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardStatusBand,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const colorTokens = [
  { name: "Background / Surface", token: "bg-background", hex: "#f7f9fc", border: true },
  { name: "Card / Surface Lowest", token: "bg-card", hex: "#ffffff", border: true },
  { name: "Muted / Surface Container", token: "bg-muted", hex: "#f2f4f7", border: true },
  { name: "Primary / Inert Structure", token: "bg-primary", hex: "#1d232a", text: "text-primary-foreground" },
  { name: "Secondary / Signal Green", token: "bg-secondary", hex: "#0b7a3e", text: "text-secondary-foreground" },
  { name: "Success", token: "bg-success", hex: "#0b7a3e", text: "text-success-foreground" },
  { name: "Warning / Amber", token: "bg-warning", hex: "#c77c02", text: "text-warning-foreground" },
  { name: "Destructive / Signal Red", token: "bg-destructive", hex: "#c0392b", text: "text-destructive-foreground" },
];

const typographySpecimens = [
  { label: "Display LG", className: "font-heading text-5xl font-bold leading-[56px]" },
  { label: "Headline LG", className: "font-heading text-[32px] font-semibold leading-10" },
  { label: "Headline MD", className: "font-heading text-2xl font-semibold leading-8" },
  { label: "Headline SM", className: "font-heading text-xl font-semibold leading-7" },
  { label: "Body LG", className: "font-sans text-lg leading-7" },
  { label: "Body MD", className: "font-sans text-base leading-6" },
  { label: "Body SM", className: "font-sans text-sm leading-5" },
  { label: "Label Bold", className: "font-sans text-xs font-bold uppercase tracking-wide" },
];

const spacingScale = [
  { name: "xs", value: "4px" },
  { name: "sm", value: "8px" },
  { name: "md", value: "16px" },
  { name: "lg", value: "24px" },
  { name: "xl", value: "32px" },
];

const radiusScale = [
  { name: "Padrão (botões/inputs/cards)", className: "rounded-lg", value: "8px" },
  { name: "Grande (modais/widgets)", className: "rounded-xl", value: "16px" },
  { name: "Pílula (badges)", className: "rounded-full", value: "9999px" },
];

const statuses = ["success", "warning", "danger"] as const;

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <header className="mb-12">
        <p className="font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Standard Industrial Safety System
        </p>
        <h1 className="mt-2 font-heading text-5xl font-bold leading-[56px]">
          Design System
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Referência viva dos tokens e componentes definidos em{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">docs/design.md</code>.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Cores</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {colorTokens.map((color) => (
            <div key={color.token} className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
              <div
                className={`flex h-20 items-end p-2 ${color.text ?? "text-foreground"} ${color.token} ${
                  color.border ? "border-b border-border" : ""
                }`}
              >
                <span className="font-mono text-xs">{color.hex}</span>
              </div>
              <div className="bg-card p-2">
                <p className="text-sm font-medium">{color.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{color.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Tipografia</h2>
        <div className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          {typographySpecimens.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0">
              <span className="font-mono text-xs text-muted-foreground">{spec.label}</span>
              <span className={spec.className}>Segurança do Trabalho</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Botões</h2>
        <div className="flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Resolver Não Conformidade</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Cards &amp; Cabeçalho Estampado</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {statuses.map((status) => (
            <Card key={status}>
              <CardStatusBand status={status}>
                {status === "success" && "Conforme"}
                {status === "warning" && "Pendente"}
                {status === "danger" && "Crítico"}
              </CardStatusBand>
              <CardHeader>
                <CardTitle className="capitalize">{status}</CardTitle>
                <CardDescription>
                  {status === "success" && "Item conforme e verificado."}
                  {status === "warning" && "Pendente, próximo do prazo."}
                  {status === "danger" && "Não conformidade crítica em aberto."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={status} mode="urgent">
                  {status === "success" && "Resolvido"}
                  {status === "warning" && "Em andamento"}
                  {status === "danger" && "Crítico"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Badges (Chips)</h2>
        <div className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Modo sutil</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">Neutro</Badge>
              <Badge variant="success">Conforme</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="danger">Não conforme</Badge>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Modo urgente</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral" mode="urgent">Neutro</Badge>
              <Badge variant="success" mode="urgent">Conforme</Badge>
              <Badge variant="warning" mode="urgent">Pendente</Badge>
              <Badge variant="danger" mode="urgent">Crítico / Atrasado</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Inputs &amp; Form Fields</h2>
        <div className="max-w-sm rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ds-example-input">E-mail corporativo</Label>
            <Input id="ds-example-input" type="email" placeholder="nome@empresa.com" />
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Data Table</h2>
        <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspeção</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Extintores - Bloco A</TableCell>
                <TableCell>Produção</TableCell>
                <TableCell><Badge variant="success">Conforme</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>EPI - Solda</TableCell>
                <TableCell>Manutenção</TableCell>
                <TableCell><Badge variant="warning">Pendente</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Saída de emergência</TableCell>
                <TableCell>Almoxarifado</TableCell>
                <TableCell><Badge variant="danger" mode="urgent">Crítico</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Espaçamento</h2>
        <div className="flex flex-wrap items-end gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          {spacingScale.map((step) => (
            <div key={step.name} className="flex flex-col items-center gap-2">
              <div className="bg-primary" style={{ width: step.value, height: step.value }} />
              <span className="font-mono text-xs text-muted-foreground">{step.name} · {step.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-2xl font-semibold leading-8">Raio de Borda</h2>
        <div className="flex flex-wrap gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          {radiusScale.map((step) => (
            <div key={step.name} className="flex flex-col items-center gap-2">
              <div className={`size-16 bg-primary ${step.className}`} />
              <span className="max-w-24 text-center font-mono text-xs text-muted-foreground">
                {step.name} · {step.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
