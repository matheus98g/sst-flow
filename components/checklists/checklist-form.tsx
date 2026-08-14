"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ListPlusIcon, PlusIcon, SaveIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChecklistItemRow, type DraftItem } from "@/components/checklists/checklist-item-row";
import { REGULATORY_STANDARD_OPTIONS } from "@/lib/checklists/constants";
import { checklistDraftSchema, type ChecklistDraftFieldErrors } from "@/lib/checklists/schema";
import type { ChecklistActionResult } from "@/app/dashboard/inspecoes/checklists/actions";
import type { RegulatoryStandard } from "@/database/prisma/generated/client";

const NONE = "none";

type Sector = { id: string; name: string };

export type ChecklistFormInitialValues = {
  title: string;
  standard: RegulatoryStandard | null;
  sectorId: string | null;
  items: DraftItem[];
};

type ChecklistFormProps = {
  sectors: Sector[];
  initialValues?: ChecklistFormInitialValues;
  onSubmit: (draft: {
    title: string;
    standard?: RegulatoryStandard;
    sectorId?: string;
    items: { clientId: string; text: string; section?: string; criticality: DraftItem["criticality"] }[];
  }) => Promise<ChecklistActionResult>;
  submitLabel: string;
};

function createEmptyItem(): DraftItem {
  return { clientId: crypto.randomUUID(), text: "", section: "", criticality: "MEDIUM" };
}

export function ChecklistForm({ sectors, initialValues, onSubmit, submitLabel }: ChecklistFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [standard, setStandard] = useState<string>(initialValues?.standard ?? NONE);
  const [sectorId, setSectorId] = useState<string>(initialValues?.sectorId ?? NONE);
  const [items, setItems] = useState<DraftItem[]>(
    initialValues?.items && initialValues.items.length > 0
      ? initialValues.items
      : [createEmptyItem()],
  );
  const [fieldErrors, setFieldErrors] = useState<ChecklistDraftFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateItem(clientId: string, next: DraftItem) {
    setItems((current) => current.map((item) => (item.clientId === clientId ? next : item)));
  }

  function removeItem(clientId: string) {
    setItems((current) => current.filter((item) => item.clientId !== clientId));
  }

  function addItem() {
    setItems((current) => [...current, createEmptyItem()]);
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const draft = {
      title,
      standard: standard === NONE ? undefined : (standard as RegulatoryStandard),
      sectorId: sectorId === NONE ? undefined : sectorId,
      items: items.map((item) => ({
        clientId: item.clientId,
        text: item.text,
        section: item.section || undefined,
        criticality: item.criticality,
      })),
    };

    const validation = checklistDraftSchema.safeParse(draft);
    if (!validation.success) {
      const flattened = validation.error.flatten((issue) => issue.message);
      const itemErrors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0] === "items" && typeof issue.path[1] === "number") {
          const key = String(issue.path[1]);
          itemErrors[key] = [...(itemErrors[key] ?? []), issue.message];
        }
      }
      setFieldErrors({
        title: flattened.fieldErrors.title,
        items: flattened.fieldErrors.items,
        itemErrors: Object.keys(itemErrors).length > 0 ? itemErrors : undefined,
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    const result = await onSubmit(draft);
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setFormError(result.formError ?? null);
      return;
    }

    router.push("/dashboard/inspecoes/checklists");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg pb-24 md:pb-0 lg:flex-row">
      <section className="flex flex-col gap-4 lg:w-1/3 lg:shrink-0">
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-4">
          <span className="absolute inset-y-0 left-0 w-1 bg-warning" aria-hidden />
          <h2 className="font-heading text-lg font-semibold text-primary">Configuração Geral</h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="checklist-title">Título do Checklist</Label>
            <Input
              id="checklist-title"
              value={title}
              aria-invalid={Boolean(fieldErrors.title?.length)}
              placeholder="Ex: Inspeção de Empilhadeiras"
              onChange={(e) => setTitle(e.target.value)}
            />
            {fieldErrors.title?.map((error) => (
              <p key={error} className="text-xs text-destructive">
                {error}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nr-context">Contexto (NR)</Label>
            <Select value={standard} onValueChange={(value) => setStandard(value ?? NONE)}>
              <SelectTrigger id="nr-context" className="w-full">
                <SelectValue placeholder="Selecione a Norma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Nenhuma</SelectItem>
                {REGULATORY_STANDARD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sector">Setor / Categoria</Label>
            <Select value={sectorId} onValueChange={(value) => setSectorId(value ?? NONE)}>
              <SelectTrigger id="sector" className="w-full">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Nenhum</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-4">
        <div className="flex items-end justify-between border-b border-border pb-2">
          <h2 className="font-heading text-2xl font-bold text-primary">Perguntas da Inspeção</h2>
          <Button type="button" onClick={addItem}>
            <PlusIcon />
            Adicionar Pergunta
          </Button>
        </div>

        {fieldErrors.items?.map((error) => (
          <Alert key={error} variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ))}
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <ChecklistItemRow
              key={item.clientId}
              item={item}
              index={index}
              total={items.length}
              errors={fieldErrors.itemErrors?.[String(index)]}
              onChange={(next) => updateItem(item.clientId, next)}
              onRemove={() => removeItem(item.clientId)}
              onMoveUp={() => moveItem(index, -1)}
              onMoveDown={() => moveItem(index, 1)}
            />
          ))}
        </ul>

        <button
          type="button"
          onClick={addItem}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50"
        >
          <ListPlusIcon className="size-8" />
          <p className="text-sm">Clique para adicionar nova pergunta.</p>
        </button>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-4 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-end gap-3 md:flex-row">
          <Link href="/dashboard/inspecoes/checklists" className={buttonVariants({ variant: "outline" })}>
            Cancelar
          </Link>
          <Button type="submit" disabled={submitting}>
            <SaveIcon />
            {submitting ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </footer>
    </form>
  );
}
