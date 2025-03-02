import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { TUserItem } from "@/api/users/type";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { DataTable } from "@/components/data-table";
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

  const columns: ColumnDef<TUserItem>[] = useMemo(
    () => [
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
      },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-1">
            <Button size="icon">
              <Eye />
            </Button>
            <Button size="icon">
              <Edit2 />
            </Button>
            <Button size="icon">
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const filterComponents: FilterableColumn[] = useMemo(
    () => [
      {
        id: "status",
        title: "Status",
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
      <Button variant="outline">Export</Button>
      <Button>New User</Button>
    </div>
  );
};
