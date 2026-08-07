import { AlertTriangleIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function OcorrenciasPage() {
  return (
    <ComingSoon
      title="Ocorrências"
      description="Registro de acidentes, quase acidentes e relatos de risco."
      icon={AlertTriangleIcon}
    />
  );
}
