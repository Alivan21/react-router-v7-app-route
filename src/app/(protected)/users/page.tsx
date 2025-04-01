import { Edit2, Eye, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { TUserItem } from "@/api/users/type";
import { ROUTES } from "@/common/constants/routes";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { DataTable, TableColumnDef } from "@/components/data-table";
import { FilterableColumn } from "@/components/data-table/filters";
import PageContainer from "@/components/providers/page-container";
import { Button } from "@/components/ui/button";
import { useUsersQuery } from "@/hooks/api/users/use-users-query";
import { useTableQueryParams } from "@/hooks/shared/use-table-query-params";

export default function UserPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: "Users",
      url: "/users",
    },
  ];

  const { queryParams } = useTableQueryParams();
  const { data, isLoading, isError } = useUsersQuery({
    ...queryParams,
    page: queryParams.page,
    limit: queryParams.limit,
    search: queryParams.search,
  });

  const columns: TableColumnDef<TUserItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
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
      header: "Actions",
      cell: (items) => (
        <div className="flex gap-1">
          <Button asChild size="sm">
            <Link to={ROUTES.USERS.DETAIL.replace(":id", items.row.original.id)}>
              <Eye />
            </Link>
          </Button>
          <Button size="sm" variant="info">
            <Edit2 />
          </Button>
          <Button size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  const filterComponents: FilterableColumn[] = useMemo(
    () => [
      {
        id: "status",
        title: "Status",
        type: "combobox",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
      },
    ],
    []
  );

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
    </PageContainer>
  );
}

const TopAction = () => {
  return (
    <div className="flex gap-2">
      <Button variant="outline">Import</Button>
      <Button variant="success">Export</Button>
      <Button>New User</Button>
    </div>
  );
};
