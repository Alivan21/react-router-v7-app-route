import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/libs/clsx";

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        "motion-safe:animate-in overflow-hidden transition-all duration-100",
        "data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-1 data-[state=closed]:animate-out data-[state=closed]:duration-100",
        "data-[state=open]:fade-in data-[state=open]:slide-in-from-top-0.5",
        className
      )}
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
