import { format } from "date-fns";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { DateTimePicker } from "@/components/datetime-picker";
import { Button } from "@/components/ui/button";
import Combobox, { Option } from "@/components/ui/combobox";
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
      placeholder?: string;
      onSearch?: (value: string) => Promise<Option[]>;
      options: Option[];
      datePickerProps?: never;
    }
  | {
      id: string;
      title: string;
      type: "datepicker";
      options?: never;
      placeholder?: string;
      datePickerProps?: {
        granularity?: "day" | "month" | "year";
      };
    };

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
}

export function DataTableFilters<TData>({ filterableColumns }: DataTableFiltersProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDateChange = (
    columnId: string,
    date: Date | undefined,
    granularity: "day" | "month" | "year" = "day"
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (!date) {
      newParams.delete(columnId);
      setSearchParams(newParams);
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
      default:
        formattedDate = format(date, "yyyy-MM-dd");
        break;
    }
    newParams.set(columnId, formattedDate);
    setSearchParams(newParams);
  };

  const handleComboboxChange = (columnId: string, value: Option | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(columnId, value.value);
    } else {
      newParams.delete(columnId);
    }
    setSearchParams(newParams);
  };

  const getFilterValue = (columnId: string) => {
    return searchParams.get(columnId) || undefined;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterableColumns.map((column) => {
        if (column.type === "datepicker") {
          const currentValue = getFilterValue(column.id);
          let dateValue = undefined;
          if (currentValue) {
            const date = new Date(currentValue);
            if (!isNaN(date.getTime())) {
              dateValue = date;
            }
          }

          return (
            <div className="relative w-full min-w-28 sm:w-auto" key={column.id}>
              <DateTimePicker
                className="min-w-52"
                granularity={column.datePickerProps?.granularity || "day"}
                key={currentValue || "empty"}
                onChange={(date) => {
                  handleDateChange(column.id, date, column.datePickerProps?.granularity || "day");
                }}
                placeholder={column.placeholder || `Filter by ${column.title}`}
                value={dateValue}
              />
              {dateValue && (
                <Button
                  aria-label="Clear date filter"
                  className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
                  onClick={() => handleDateChange(column.id, undefined)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        }

        if (column.type === "combobox") {
          const currentValue = getFilterValue(column.id);
          const selectedOption = column.options.find((option) => option.value === currentValue);

          return (
            <div className="w-full min-w-28 sm:w-auto" key={column.id}>
              <Combobox
                defaultOptions={column.options}
                key={selectedOption?.value || "empty"}
                onChange={(value) => handleComboboxChange(column.id, value)}
                onSearch={column.onSearch}
                placeholder={column.placeholder || `Filter by ${column.title}`}
                value={selectedOption}
              />
            </div>
          );
        }

        const currentValue = getFilterValue(column.id);

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
                  checked={currentValue === option.value}
                  key={option.value}
                  onCheckedChange={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (currentValue === option.value) {
                      newParams.delete(column.id);
                    } else {
                      newParams.set(column.id, option.value);
                    }
                    setSearchParams(newParams);
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
