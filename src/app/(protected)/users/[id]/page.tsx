import { useParams } from "react-router";
import { ROUTES } from "@/common/constants/routes";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { Descriptions } from "@/components/descriptions";
import PageContainer from "@/components/providers/page-container";
import { Badge } from "@/components/ui/badge";

export default function DetailUserPage() {
  const { id } = useParams();

  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: "Users",
      url: ROUTES.USERS.LIST,
    },
    {
      text: "Detail User",
      url: ROUTES.USERS.DETAIL.replace(":id", id || ""),
    },
  ];

  const user = {
    id,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-09-15 14:30",
    createdAt: "2023-01-10 09:15",
    updatedAt: "2023-08-22 16:45",
    department: "Engineering",
    phoneNumber: "+1 (555) 123-4567",
  };

  return (
    <PageContainer breadcrumbs={breadcrumbs} title="Detail User" withBackButton>
      <Descriptions column={2}>
        <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{user.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Department">{user.department}</Descriptions.Item>
        <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge>{user.status}</Badge>
        </Descriptions.Item>
        <Descriptions.Item label="Last Login">{user.lastLogin}</Descriptions.Item>
        <Descriptions.Item label="Created At">{user.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Last Updated">{user.updatedAt}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
}
