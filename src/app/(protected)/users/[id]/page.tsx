import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router";
import Loading from "@/app/loading";
import { ROUTES } from "@/common/constants/routes";
import AlertConfirmDialog from "@/components/alert-dialog";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { Descriptions } from "@/components/descriptions";
import PageContainer from "@/components/providers/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteUserMutation } from "@/hooks/api/users/use-delete-user-mutation";
import { useUserQuery } from "@/hooks/api/users/use-user-query";

export default function DetailUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: deleteUser, isPending } = useDeleteUserMutation(id as string);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const { data, isLoading } = useUserQuery(id as string);

  if (isLoading) {
    return <Loading />;
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    try {
      deleteUser(undefined, {
        onSuccess: () => {
          toast.success("User deleted successfully");
          void navigate(ROUTES.USERS.LIST);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to delete user. Please try again.");
        },
      });
    } catch {
      toast.error("An error occurred while deleting the user.");
    }
  };

  const TopActions = () => (
    <div className="flex gap-2">
      <Button asChild variant="info">
        <Link to={ROUTES.USERS.EDIT.replace(":id", id || "")}>
          <Edit2 className="size-4" />
          Edit
        </Link>
      </Button>
      <Button disabled={isPending} onClick={handleOpenDeleteDialog} variant="destructive">
        <Trash2 className="size-4" />
        Delete
      </Button>
    </div>
  );

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Detail User"
      topActions={<TopActions />}
      withBackButton
    >
      <Descriptions column={2}>
        <Descriptions.Item label="User ID">{data?.data.id}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{data?.data.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{data?.data.email}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{data?.data.phone_number}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge
            className="uppercase"
            variant={data?.data.status === "active" ? "success" : "destructive"}
          >
            {data?.data.status}
          </Badge>
        </Descriptions.Item>
      </Descriptions>

      <AlertConfirmDialog
        cancelText="Cancel"
        continueText="Delete"
        description={`Are you sure you want to delete user ${data?.data.name}? This action cannot be undone.`}
        isDestructive={true}
        onContinue={handleConfirmDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        title="Delete User"
      />
    </PageContainer>
  );
}
