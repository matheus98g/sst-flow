import { type LucideIcon, ConstructionIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ComingSoonProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function ComingSoon({ title, description, icon: Icon = ConstructionIcon }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-primary">
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Icon className="mb-2 size-12 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold text-primary uppercase">
            Em breve
          </p>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade está em desenvolvimento e estará disponível em
            uma próxima atualização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
