import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-bold whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-destructive/15 text-destructive",
      },
      mode: {
        subtle: "",
        urgent: "",
      },
    },
    compoundVariants: [
      { variant: "success", mode: "urgent", class: "bg-success text-success-foreground" },
      { variant: "warning", mode: "urgent", class: "bg-warning text-warning-foreground" },
      { variant: "danger", mode: "urgent", class: "bg-destructive text-destructive-foreground" },
      { variant: "neutral", mode: "urgent", class: "bg-primary text-primary-foreground" },
    ],
    defaultVariants: { variant: "neutral", mode: "subtle" },
  }
)

function Badge({
  className,
  variant,
  mode,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, mode, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
