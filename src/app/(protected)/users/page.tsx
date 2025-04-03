import { Edit2, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { TUserItem } from "@/api/users/type";
import { ROUTES } from "@/common/constants/routes";
import AlertConfirmDialog from "@/components/alert-dialog";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { DataTable, TableColumnDef } from "@/components/data-table";
import { FilterableColumn } from "@/components/data-table/filters";
import PageContainer from "@/components/providers/page-container";
import { Button } from "@/components/ui/button";
import { useDeleteUserMutation } from "@/hooks/api/users/use-delete-user-mutation";
import { useUsersQuery } from "@/hooks/api/users/use-users-query";
import { useTableQueryParams } from "@/hooks/shared/use-table-query-params";

export default function UserPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: "Users",
      url: ROUTES.USERS.LIST,
    },
  ];

  const { queryParams } = useTableQueryParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const deleteUserMutation = useDeleteUserMutation(selectedUserId);

  const { data, isLoading, isError } = useUsersQuery({
    ...queryParams,
    page: queryParams.page,
    limit: queryParams.limit,
    search: queryParams.search,
  });

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("User deleted successfully");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to delete user. Please try again.");
      },
    });
    setDeleteDialogOpen(false);
  };

  const columns: TableColumnDef<TUserItem>[] = [
    {
      accessorKey: "no",
      header: "No",
      enableSorting: true,
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="flex items-center gap-2 uppercase">
            <span
              className={`h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`}
            />
            {status as string}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at");
        return <span>{new Date(createdAt as string).toLocaleDateString()}</span>;
      },
    },
    {
      header: "Actions",
      cell: (items) => (
        <div className="flex gap-1">
          <Button asChild size="sm">
            <Link to={ROUTES.USERS.DETAIL.replace(":id", items.row.original.id)}>
              <Eye />
            </Link>
          </Button>
          <Button asChild size="sm" variant="info">
            <Link to={ROUTES.USERS.EDIT.replace(":id", items.row.original.id)}>
              <Edit2 />
            </Link>
          </Button>
          <Button
            onClick={() => handleDeleteClick(items.row.original.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  const filterComponents: FilterableColumn[] = [
    {
      id: "status",
      title: "Status",
      type: "combobox",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      id: "created_at",
      title: "Created At",
      type: "datepicker",
      placeholder: "Filter by Created At",
    },
    {
      id: "updated_at",
      title: "Updated At",
      type: "datepicker",
      datePickerProps: {
        granularity: "month",
      },
      placeholder: "Filter by Updated At",
    },
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs} title="User Management" topActions={<TopAction />}>
      <DataTable
        columns={columns}
        data={data?.data || []}
        filterableColumns={filterComponents}
        isError={isError}
        isLoading={isLoading}
        pageCount={data?.meta?.total_page || 0}
        searchColumn="name"
        totalCount={data?.meta?.total || 0}
      />
      <AlertConfirmDialog
        cancelText="Cancel"
        continueText="Delete"
        description="Are you sure you want to delete this user? This action cannot be undone."
        isDestructive
        onContinue={handleConfirmDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        title="Delete User"
      />
    </PageContainer>
  );
}

const TopAction = () => {
  return (
    <div className="flex gap-2">
      <Button variant="outline">Import</Button>
      <Button variant="success">Export</Button>
      <Button asChild>
        <Link className="w-full" to={ROUTES.USERS.CREATE}>
          New User
        </Link>
      </Button>
    </div>
  );
};
