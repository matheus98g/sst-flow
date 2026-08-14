"use client";

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CRITICALITY_OPTIONS } from "@/lib/checklists/constants";
import type { Criticality } from "@/database/prisma/generated/client";

export type DraftItem = {
  clientId: string;
  text: string;
  section: string;
  criticality: Criticality;
};

type ChecklistItemRowProps = {
  item: DraftItem;
  index: number;
  total: number;
  errors?: string[];
  onChange: (item: DraftItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function ChecklistItemRow({
  item,
  index,
  total,
  errors,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ChecklistItemRowProps) {
  const hasError = Boolean(errors?.length);

  return (
    <li className="relative flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row">
      <span className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-muted" aria-hidden />

      <div className="flex flex-1 flex-col gap-2 pl-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Mover pergunta ${index + 1} para cima`}
              disabled={index === 0}
              onClick={onMoveUp}
            >
              <ArrowUpIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Mover pergunta ${index + 1} para baixo`}
              disabled={index === total - 1}
              onClick={onMoveDown}
            >
              <ArrowDownIcon />
            </Button>
          </div>
          <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <Label htmlFor={`item-text-${item.clientId}`} className="sr-only">
          Texto da Pergunta {index + 1}
        </Label>
        <Input
          id={`item-text-${item.clientId}`}
          value={item.text}
          aria-invalid={hasError}
          placeholder="Ex: Os operadores possuem treinamento válido e certificado?"
          onChange={(e) => onChange({ ...item, text: e.target.value })}
        />
        {errors?.map((error) => (
          <p key={error} className="text-xs text-destructive">
            {error}
          </p>
        ))}
      </div>

      <div className="flex shrink-0 flex-col gap-2 pl-2 md:w-48 md:border-l md:border-outline-variant md:pl-4">
        <Label>Criticidade</Label>
        <Select
          value={item.criticality}
          onValueChange={(value) => onChange({ ...item, criticality: value as Criticality })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CRITICALITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-auto flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2Icon />
            <span className="sr-only">Remover pergunta {index + 1}</span>
          </Button>
        </div>
      </div>
    </li>
  );
}
