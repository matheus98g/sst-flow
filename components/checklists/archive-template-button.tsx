"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { archiveChecklistTemplate } from "@/app/dashboard/inspecoes/checklists/actions";

export function ArchiveTemplateButton({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleArchive() {
    setPending(true);
    await archiveChecklistTemplate(templateId);
    setPending(false);
    router.push("/dashboard/inspecoes/checklists");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="outline" disabled={pending}>
            <ArchiveIcon />
            {pending ? "Arquivando..." : "Arquivar"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arquivar checklist?</AlertDialogTitle>
          <AlertDialogDescription>
            Ele deixará de aparecer na lista de checklists ativos, mas o histórico é
            preservado e pode ser consultado na seção de arquivados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>Arquivar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
