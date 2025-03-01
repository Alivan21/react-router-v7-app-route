import { cn } from "@/libs/clsx";
import { Breadcrumbs, BreadcrumbsItem } from "../breadcrumbs";
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
    <div className="flex min-h-svh flex-col">
      <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-4 sm:px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator className="h-6" orientation="vertical" />
      </header>
      <main className={cn("flex min-h-0 flex-1 flex-col", className)}>
        <Breadcrumbs items={breadcrumbs} showHomeIcon={showHomeIcon} />
        {title && (
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
        )}
        <div className={cn("flex-1", !title && "px-4 py-4 sm:px-6 lg:px-8")}>{children}</div>
      </main>
    </div>
  );
}
