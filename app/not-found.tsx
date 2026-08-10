import Link from "next/link";
import {
  ConstructionIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-muted px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative mb-8 flex h-48 w-48 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <div
            className="absolute inset-2 animate-spin rounded-full border border-dashed border-border"
            style={{ animationDuration: "20s" }}
          />
          <ConstructionIcon
            className="size-20 text-destructive"
            strokeWidth={1.5}
          />
          <div className="absolute -right-2 -bottom-2 rounded-full border-2 border-muted bg-destructive px-3 py-1 text-xs font-bold tracking-wide text-destructive-foreground uppercase shadow-md">
            Erro 404
          </div>
        </div>

        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-primary uppercase md:text-5xl">
          Ops! Saiu da Rota de Segurança?
        </h1>
        <p className="mb-8 max-w-lg text-lg text-muted-foreground">
          A página que você está tentando acessar não foi encontrada. O link
          pode estar quebrado, ou a página foi removida.
        </p>

        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            size="lg"
            className="w-full sm:w-auto"
          >
            <LayoutDashboardIcon />
            Voltar ao Dashboard
          </Button>
          <Button
            render={<Link href="/dashboard/suporte" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <LifeBuoyIcon />
            Suporte
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-muted-foreground opacity-70">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="text-xs font-bold tracking-widest uppercase">
            Status: Não Conformidade Detectada
          </span>
        </div>
      </main>
    </div>
  );
}
