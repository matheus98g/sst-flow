import { SquareCheckIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function AcoesCorretivasPage() {
  return (
    <ComingSoon
      title="Ações Corretivas"
      description="Acompanhamento de planos de ação e prazos de correção."
      icon={SquareCheckIcon}
    />
  );
}
