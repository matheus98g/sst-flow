import { HelpCircleIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function SuportePage() {
  return (
    <ComingSoon
      title="Suporte"
      description="Canal de atendimento e ajuda para dúvidas do sistema."
      icon={HelpCircleIcon}
    />
  );
}
