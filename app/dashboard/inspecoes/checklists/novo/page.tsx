import { ChecklistForm } from "@/components/checklists/checklist-form";
import { createChecklistTemplate } from "@/app/dashboard/inspecoes/checklists/actions";
import { getActiveCompanyId } from "@/lib/company";
import { prisma } from "@/lib/prisma";

export default async function NovoChecklistPage() {
  const companyId = await getActiveCompanyId();
  const sectors = await prisma.sector.findMany({
    where: { companyId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-primary uppercase">
          Criar Novo Checklist
        </h1>
      </div>

      <ChecklistForm sectors={sectors} onSubmit={createChecklistTemplate} submitLabel="Salvar Checklist" />
    </div>
  );
}
