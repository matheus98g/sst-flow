import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ChecklistTemplateList } from "@/components/checklists/checklist-template-list";
import { ArchivedChecklistList } from "@/components/checklists/archived-checklist-list";
import { getActiveCompanyId } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function ChecklistTemplatesPage() {
  const companyId = await getActiveCompanyId();

  const [templates, archivedTemplates] = await Promise.all([
    prisma.checklistTemplate.findMany({
      where: { companyId, archivedAt: null },
      select: {
        id: true,
        title: true,
        standard: true,
        createdAt: true,
        sector: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.checklistTemplate.findMany({
      where: { companyId, archivedAt: { not: null } },
      select: {
        id: true,
        title: true,
        archivedAt: true,
        sector: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { archivedAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-primary">
            Checklists de Inspeção
          </h2>
          <p className="text-muted-foreground">
            Templates reutilizáveis para iniciar inspeções em campo.
          </p>
        </div>

        {templates.length > 0 && (
          <Link
            href="/dashboard/inspecoes/checklists/novo"
            className={cn(buttonVariants())}
          >
            <PlusIcon />
            Criar Checklist
          </Link>
        )}
      </div>

      <ChecklistTemplateList
        templates={templates.map((template) => ({
          id: template.id,
          title: template.title,
          standard: template.standard,
          sector: template.sector,
          itemCount: template._count.items,
          createdAt: template.createdAt,
        }))}
      />

      <ArchivedChecklistList
        templates={archivedTemplates.map((template) => ({
          id: template.id,
          title: template.title,
          sector: template.sector,
          itemCount: template._count.items,
          archivedAt: template.archivedAt as Date,
        }))}
      />
    </div>
  );
}
