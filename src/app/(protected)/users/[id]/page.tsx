import { useParams } from "react-router";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import PageContainer from "@/components/providers/page-container";

export default function DetailUserPage() {
  const { id } = useParams();

  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: "Users",
      url: "/users",
    },
    {
      text: "Detail User",
      url: `/users/${id}`,
    },
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs} title="Detail User">
      <h1>Detail User {id}</h1>
    </PageContainer>
  );
}
