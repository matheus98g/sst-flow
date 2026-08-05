"use client";

import { ViewTransition } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const PASSWORD_RULES = [
  { key: "length", label: "Pelo menos 8 caracteres", test: (value: string) => value.length >= 8 },
  { key: "uppercase", label: "Uma letra maiúscula", test: (value: string) => /[A-Z]/.test(value) },
  { key: "lowercase", label: "Uma letra minúscula", test: (value: string) => /[a-z]/.test(value) },
  { key: "number", label: "Um número", test: (value: string) => /[0-9]/.test(value) },
] as const;

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <ViewTransition key={rule.key} enter="fade-in" exit="fade-out">
            <li
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                passed ? "text-success" : "text-muted-foreground"
              )}
            >
              {passed ? <Check className="size-4 shrink-0" /> : <X className="size-4 shrink-0" />}
              {rule.label}
            </li>
          </ViewTransition>
        );
      })}
    </ul>
  );
}
