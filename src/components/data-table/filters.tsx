import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";

export interface FilterableColumn {
  id: string;
  title: string;
  options: { label: string; value: string }[];
}

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
}

export function DataTableFilters<TData>({
  table,
  filterableColumns,
}: DataTableFiltersProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-9" size="sm" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {filterableColumns.map((column) => (
          <div key={column.id}>
            <DropdownMenuLabel>{column.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {column.options.map((option) => (
              <DropdownMenuCheckboxItem
                checked={table.getColumn(column.id)?.getFilterValue() === option.value}
                key={option.value}
                onCheckedChange={() => {
                  const columnFilter = table.getColumn(column.id);
                  const currentValue = columnFilter?.getFilterValue();

                  columnFilter?.setFilterValue(
                    currentValue === option.value ? undefined : option.value
                  );
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
