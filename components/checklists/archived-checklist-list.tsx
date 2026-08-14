"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { restoreChecklistTemplate } from "@/app/dashboard/inspecoes/checklists/actions";
import { cn } from "@/lib/utils";

type ArchivedTemplate = {
  id: string;
  title: string;
  sector: { name: string } | null;
  itemCount: number;
  archivedAt: Date;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function RestoreButton({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      await restoreChecklistTemplate(templateId);
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={handleRestore}>
      <RotateCcwIcon />
      {pending ? "Restaurando..." : "Restaurar"}
    </Button>
  );
}

export function ArchivedChecklistList({ templates }: { templates: ArchivedTemplate[] }) {
  const [open, setOpen] = useState(false);

  if (templates.length === 0) return null;

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Arquivados ({templates.length})
        </span>
        <ChevronDownIcon className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Arquivado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium text-muted-foreground">{template.title}</TableCell>
                <TableCell className="text-muted-foreground">{template.sector?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{template.itemCount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {dateFormatter.format(template.archivedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <RestoreButton templateId={template.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
