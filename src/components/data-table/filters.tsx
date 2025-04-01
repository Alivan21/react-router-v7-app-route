import { format } from "date-fns";
import { Filter } from "lucide-react";
import { DateTimePicker } from "@/components/datetime-picker";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";

export type FilterableColumn =
  | {
      id: string;
      title: string;
      type: "dropdown" | "combobox";
      options: { label: string; value: string }[];
      datePickerProps?: never;
    }
  | {
      id: string;
      title: string;
      type: "datepicker";
      options?: never;
      datePickerProps?: {
        granularity?: "day" | "month" | "year";
      };
    };

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
}

export function DataTableFilters<TData>({
  table,
  filterableColumns,
}: DataTableFiltersProps<TData>) {
  const handleDateChange = (
    columnId: string,
    date: Date | undefined,
    granularity: "day" | "month" | "year" = "day"
  ) => {
    const column = table.getColumn(columnId);

    if (!date) {
      column?.setFilterValue(undefined);
      return;
    }

    let formattedDate: string;
    switch (granularity) {
      case "year":
        formattedDate = format(date, "yyyy");
        break;
      case "month":
        formattedDate = format(date, "yyyy-MM");
        break;
      case "day":
      default:
        formattedDate = format(date, "yyyy-MM-dd");
        break;
    }

    if (column) {
      column.setFilterValue(formattedDate);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterableColumns.map((column) => {
        if (column.type === "datepicker") {
          const currentValue = table.getColumn(column.id)?.getFilterValue() as string;

          let dateValue: Date | undefined = undefined;
          if (currentValue) {
            try {
              dateValue = new Date(currentValue);
              if (isNaN(dateValue.getTime())) {
                dateValue = undefined;
              }
            } catch {
              dateValue = undefined;
            }
          }

          return (
            <div className="w-full min-w-28 sm:w-auto" key={column.id}>
              <DateTimePicker
                granularity={column.datePickerProps?.granularity || "day"}
                onChange={(date) => {
                  handleDateChange(column.id, date, column.datePickerProps?.granularity || "day");
                }}
                placeholder={`Filter by ${column.title}`}
                value={dateValue}
              />
            </div>
          );
        }

        if (column.type === "combobox") {
          const options =
            column.options?.map((opt) => ({ value: opt.value, label: opt.label })) || [];
          const selectedValue = table.getColumn(column.id)?.getFilterValue() as string;
          const selectedOption = options.find((opt) => opt.value === selectedValue);

          return (
            <div className="w-full min-w-28 sm:w-auto" key={column.id}>
              <Combobox
                onChange={(option) => {
                  if (table.getColumn(column.id)) {
                    table.getColumn(column.id)?.setFilterValue(option?.value);
                  }
                }}
                options={options}
                placeholder={`Filter by ${column.title}`}
                value={selectedOption}
              />
            </div>
          );
        }

        return (
          <DropdownMenu key={column.id}>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 w-full min-w-28 sm:w-auto" size="sm" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {column.title}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{column.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {column.options?.map((option) => (
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
