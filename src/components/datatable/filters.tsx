import { format } from "date-fns";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import Combobox, { type TOption } from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      onSearch?: (value: string) => Promise<TOption[]>;
      triggerSearchOnFocus?: boolean;
      options?: TOption[];
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

type TDataTableFiltersProps<TData> = {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
};

export function DataTableFilters<TData>({ filterableColumns }: TDataTableFiltersProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleDateChange(
    columnId: string,
    date: Date | undefined,
    granularity: "day" | "month" | "year" = "day"
  ) {
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
  }

  function handleComboboxChange(columnId: string, value: TOption | undefined) {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(columnId, value.value);
    } else {
      newParams.delete(columnId);
    }
    setSearchParams(newParams);
  }

  function getFilterValue(columnId: string): string | undefined {
    return searchParams.get(columnId) ?? undefined;
  }

  const activeFilterCount = filterableColumns.filter((column) => getFilterValue(column.id)).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-9 w-full" size="sm" variant="outline">
          <Filter className="mr-1 h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[70vh] w-80 overflow-y-auto">
        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filterableColumns.map((column) => {
          const currentValue = getFilterValue(column.id);

          if (column.type === "datepicker") {
            let dateValue: Date | undefined = undefined;
            if (currentValue) {
              const date = new Date(currentValue);
              if (!Number.isNaN(date.getTime())) {
                dateValue = date;
              }
            }

            return (
              <div className="p-2" key={column.id}>
                <div className="mb-2 text-sm font-medium">{column.title}</div>
                <div className="relative">
                  <DateTimePicker
                    className="w-full"
                    granularity={column.datePickerProps?.granularity ?? "day"}
                    key={currentValue ?? "empty"}
                    onChange={(date) => {
                      handleDateChange(
                        column.id,
                        date,
                        column.datePickerProps?.granularity ?? "day"
                      );
                    }}
                    placeholder={column.placeholder ?? `Filter by ${column.title}`}
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
              </div>
            );
          }

          if (column.type === "combobox") {
            const selectedOption =
              currentValue !== undefined
                ? column.options?.find((option) => option.value === currentValue)
                : undefined;

            return (
              <div className="p-2" key={column.id}>
                <div className="mb-2 text-sm font-medium">{column.title}</div>
                <Combobox
                  defaultOptions={column.options}
                  delay={500}
                  onChange={(value) => handleComboboxChange(column.id, value)}
                  onSearch={column.onSearch}
                  placeholder={column.placeholder ?? `Filter by ${column.title}`}
                  triggerSearchOnFocus={column.triggerSearchOnFocus ?? true}
                  value={selectedOption}
                />
              </div>
            );
          }

          return (
            <DropdownMenuItem className="p-0" key={column.id}>
              <div className="w-full p-2">
                <div className="mb-2 text-sm font-medium">{column.title}</div>
                <div className="space-y-2">
                  {column.options?.map((option) => (
                    <Button
                      className={`w-full justify-start ${
                        currentValue === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                      key={option.value}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        if (currentValue === option.value) {
                          newParams.delete(column.id);
                        } else {
                          newParams.set(column.id, option.value);
                        }
                        setSearchParams(newParams);
                      }}
                      size="sm"
                      variant={currentValue === option.value ? "default" : "outline"}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
