import { Home } from "lucide-react";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import PageContainer from "@/components/providers/page-container";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function DashboardPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: <Home className="h-4 w-4" />,
      url: "/dashboard",
    },
  ];
  return (
    <PageContainer breadcrumbs={breadcrumbs} showHomeIcon={false} title="Dashboard">
      <div className="flex flex-col gap-4">
        <ScrollArea className="w-screen max-w-[95vw] rounded-md pb-1 whitespace-nowrap md:max-w-[calc(100vw-256px-4rem)]">
          <div className="flex w-max gap-4">
            {Array.from({ length: 100 }, (_, i) => (
              <p key={i}>Test {i}</p>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 100 }, (_, i) => (
            <p key={i}>Test {i}</p>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
