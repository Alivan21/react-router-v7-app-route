import { BreadcrumbsItem } from "@/components/breadcrumbs";
import PageContainer from "@/components/providers/page-container";

export default function DashboardPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: "Dashboard",
      url: "/dashboard",
    },
  ];
  return (
    <PageContainer breadcrumbs={breadcrumbs} title="Dashboard">
      <p>Testing</p>
    </PageContainer>
  );
}
