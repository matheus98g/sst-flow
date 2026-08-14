import { z } from "zod";

export const checklistDraftItemSchema = z.object({
  clientId: z.string().min(1),
  text: z.string().trim().min(1, "O texto da pergunta não pode ficar vazio."),
  section: z.string().trim().optional(),
  criticality: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const checklistDraftSchema = z.object({
  title: z.string().trim().min(1, "O título do checklist é obrigatório."),
  standard: z
    .enum([
      "NR_01", "NR_05", "NR_06", "NR_07", "NR_09", "NR_10", "NR_11", "NR_12",
      "NR_13", "NR_17", "NR_18", "NR_20", "NR_23", "NR_26", "NR_33", "NR_35", "OTHER",
    ])
    .optional(),
  sectorId: z.string().trim().optional(),
  items: z
    .array(checklistDraftItemSchema)
    .min(1, "Adicione ao menos uma pergunta ao checklist."),
});

export type ChecklistDraftItem = z.infer<typeof checklistDraftItemSchema>;
export type ChecklistDraft = z.infer<typeof checklistDraftSchema>;

export type ChecklistDraftFieldErrors = {
  title?: string[];
  items?: string[];
  itemErrors?: Record<string, string[]>;
};

export function toFieldErrors(
  result: ReturnType<(typeof checklistDraftSchema)["safeParse"]>,
): ChecklistDraftFieldErrors {
  if (result.success) return {};

  const flattened = result.error.flatten((issue) => issue.message);
  const itemErrors: Record<string, string[]> = {};

  for (const issue of result.error.issues) {
    if (issue.path[0] === "items" && typeof issue.path[1] === "number") {
      const index = issue.path[1];
      const key = String(index);
      itemErrors[key] = [...(itemErrors[key] ?? []), issue.message];
    }
  }

  return {
    title: flattened.fieldErrors.title,
    items: flattened.fieldErrors.items,
    itemErrors: Object.keys(itemErrors).length > 0 ? itemErrors : undefined,
  };
}
