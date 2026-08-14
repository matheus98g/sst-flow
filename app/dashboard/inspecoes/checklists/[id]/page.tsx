import { notFound } from "next/navigation";
import { ChecklistForm } from "@/components/checklists/checklist-form";
import { ArchiveTemplateButton } from "@/components/checklists/archive-template-button";
import { updateChecklistTemplate } from "@/app/dashboard/inspecoes/checklists/actions";
import { getActiveCompanyId } from "@/lib/company";
import { prisma } from "@/lib/prisma";

export default async function EditarChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const companyId = await getActiveCompanyId();

  const [template, sectors] = await Promise.all([
    prisma.checklistTemplate.findFirst({
      where: { id, companyId, archivedAt: null },
      include: { items: { orderBy: { position: "asc" } } },
    }),
    prisma.sector.findMany({
      where: { companyId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!template) {
    notFound();
  }

  const updateWithId = updateChecklistTemplate.bind(null, template.id);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-primary uppercase">
          Editar Checklist
        </h1>
        <ArchiveTemplateButton templateId={template.id} />
      </div>

      <ChecklistForm
        sectors={sectors}
        initialValues={{
          title: template.title,
          standard: template.standard,
          sectorId: template.sectorId,
          items: template.items.map((item) => ({
            clientId: item.id,
            text: item.text,
            section: item.section ?? "",
            criticality: item.criticality,
          })),
        }}
        onSubmit={updateWithId}
        submitLabel="Salvar Alterações"
      />
    </div>
  );
}
