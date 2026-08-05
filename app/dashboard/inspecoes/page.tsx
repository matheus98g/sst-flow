import { ClipboardCheckIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function InspecoesPage() {
  return (
    <ComingSoon
      title="Inspeções"
      description="Checklists e registros de inspeção de segurança."
      icon={ClipboardCheckIcon}
    />
  );
}
