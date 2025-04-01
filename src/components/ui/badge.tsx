import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/libs/clsx";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "hover:bg-accent/30 hover:text-accent-foreground transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
        info: "bg-info text-white [a&]:hover:bg-info/80 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        success:
          "bg-success text-success-foreground [a&]:hover:bg-success/80 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "bg-warning text-warning-foreground [a&]:hover:bg-warning/80 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-xs rounded-sm",
        lg: "px-3 py-1 text-sm rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
  );
}

export { Badge, badgeVariants };
