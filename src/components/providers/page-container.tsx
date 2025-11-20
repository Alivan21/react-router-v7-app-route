import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/libs/clsx";
import { Breadcrumbs, type BreadcrumbsItem } from "../breadcrumbs";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

type PageContainerProps = {
  children?: React.ReactNode;
  topActions?: React.ReactNode;
  breadcrumbs?: BreadcrumbsItem[];
  className?: string;
  showHomeIcon?: boolean;
  title?: string;
  description?: string;
  withBackButton?: boolean;
};

export default function PageContainer({
  children,
  topActions,
  breadcrumbs = [],
  className,
  showHomeIcon = true,
  title,
  description,
  withBackButton = false,
}: PageContainerProps) {
  const navigate = useNavigate();
  return (
    <ScrollArea className="max-h-svh max-w-dvw flex-1 overflow-hidden">
      <div className="flex min-h-svh flex-col">
        <header className="bg-background z-10 flex h-[4.05rem] w-full shrink-0 items-center gap-2 px-4 pt-2 sm:px-6">
          <Button asChild className="px-0" size="sm" variant="outline">
            <SidebarTrigger />
          </Button>
          <Separator className="mx-2 h-6! w-[1.4px]!" orientation="vertical" />
          <Breadcrumbs items={breadcrumbs} showHomeIcon={showHomeIcon} />
        </header>
        <main
          className={cn("flex min-h-0 flex-1 flex-col gap-4 px-4 pt-2 pb-5 lg:px-8", className)}
        >
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {title && (
              <div className="flex items-center gap-2">
                {withBackButton && (
                  <Button
                    className="size-7 rounded-lg p-0"
                    onClick={() => void navigate(-1)}
                    size="sm"
                    variant="default"
                  >
                    <ChevronLeft className="size-5" strokeWidth={2.5} />
                  </Button>
                )}
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>
              </div>
            )}
            {topActions && topActions}
          </section>
          {children}
          <ScrollBar className="z-20" />
        </main>
      </div>
    </ScrollArea>
  );
}
