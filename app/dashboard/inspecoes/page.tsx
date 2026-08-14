import Link from "next/link";
import { ClipboardCheckIcon, ClipboardListIcon } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function InspecoesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-primary">
          Inspeções
        </h2>
        <p className="text-muted-foreground">
          Checklists e registros de inspeção de segurança.
        </p>
      </div>

      <Link href="/dashboard/inspecoes/checklists" className="block">
        <Card className="transition-colors hover:bg-muted/50">
          <CardContent className="flex items-center gap-4 py-6">
            <ClipboardListIcon className="size-10 shrink-0 text-primary" />
            <div>
              <CardTitle>Checklists de Inspeção</CardTitle>
              <CardDescription>
                Crie e gerencie os templates usados para iniciar inspeções em campo.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <ClipboardCheckIcon className="mb-2 size-12 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold text-primary uppercase">
            Execução de inspeções em breve
          </p>
          <p className="text-sm text-muted-foreground">
            Iniciar e responder inspeções a partir de um checklist estará disponível em uma
            próxima atualização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
