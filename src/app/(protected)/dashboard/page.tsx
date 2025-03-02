import { Home } from "lucide-react";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import PageContainer from "@/components/providers/page-container";

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
        <p>Hello, Welcome Back</p>
      </div>
    </PageContainer>
  );
}
