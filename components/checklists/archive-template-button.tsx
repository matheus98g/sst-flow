"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveChecklistTemplate } from "@/app/dashboard/inspecoes/checklists/actions";

export function ArchiveTemplateButton({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleArchive() {
    const confirmed = window.confirm(
      "Arquivar este checklist? Ele deixará de aparecer na lista, mas o histórico é preservado.",
    );
    if (!confirmed) return;

    setPending(true);
    await archiveChecklistTemplate(templateId);
    setPending(false);
    router.push("/dashboard/inspecoes/checklists");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={handleArchive}>
      <ArchiveIcon />
      {pending ? "Arquivando..." : "Arquivar"}
    </Button>
  );
}
