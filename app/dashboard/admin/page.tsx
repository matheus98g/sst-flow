import { ShieldCheckIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function AdminPage() {
  return (
    <ComingSoon
      title="Admin"
      description="Gestão de usuários, papéis e configurações do sistema."
      icon={ShieldCheckIcon}
    />
  );
}
