import { cn } from "@/libs/clsx";
import { Breadcrumbs, BreadcrumbsItem } from "../breadcrumbs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

interface PageContainerProps {
  children?: React.ReactNode;
  breadcrumbs?: BreadcrumbsItem[];
  className?: string;
  showHomeIcon?: boolean;
  title?: string;
}

export default function PageContainer({
  children,
  breadcrumbs = [],
  className,
  showHomeIcon = true,
  title,
}: PageContainerProps) {
  return (
    <ScrollArea className="max-h-svh max-w-dvw flex-1 overflow-hidden">
      <div className="flex min-h-svh flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-[4.05rem] w-full shrink-0 items-center gap-4 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[3.05rem] sm:px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator className="!h-6" orientation="vertical" />
          <Breadcrumbs items={breadcrumbs} showHomeIcon={showHomeIcon} />
        </header>
        <main
          className={cn("flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8", className)}
        >
          {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
          {children}
        </main>
      </div>
    </ScrollArea>
  );
}
