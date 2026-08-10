import { Button as EmailButton } from "@react-email/components";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-primary",
};

export function Button({ href, variant = "primary", children }: ButtonProps) {
  return (
    <EmailButton
      href={href}
      className={`font-body box-border rounded-lg px-6 py-3 text-center text-sm font-bold no-underline ${variantClasses[variant]}`}
    >
      {children}
    </EmailButton>
  );
}
