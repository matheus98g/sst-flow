import Link from "next/link";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { REGULATORY_STANDARD_LABELS } from "@/lib/checklists/constants";

type ChecklistTemplateListItem = {
  id: string;
  title: string;
  standard: keyof typeof REGULATORY_STANDARD_LABELS | null;
  sector: { name: string } | null;
  itemCount: number;
  createdAt: Date;
};

type ChecklistTemplateListProps = {
  templates: ChecklistTemplateListItem[];
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function ChecklistTemplateList({ templates }: ChecklistTemplateListProps) {
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <ClipboardListIcon className="mb-2 size-12 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold text-primary uppercase">
            Nenhum checklist criado ainda
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Crie o primeiro template para começar a padronizar as inspeções.
          </p>
          <Link href="/dashboard/inspecoes/checklists/novo" className={cn(buttonVariants())}>
            <PlusIcon />
            Criar Checklist
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Norma</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.title}</TableCell>
              <TableCell>
                {template.standard ? (
                  <Badge variant="neutral">{REGULATORY_STANDARD_LABELS[template.standard]}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{template.sector?.name ?? "—"}</TableCell>
              <TableCell>{template.itemCount}</TableCell>
              <TableCell>{dateFormatter.format(template.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/dashboard/inspecoes/checklists/${template.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Editar
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
