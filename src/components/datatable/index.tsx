import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/libs/clsx";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";
import Spinner from "../ui/spinner";
import { DataTableFilters, FilterableColumn } from "./filters";
import { DataTablePagination } from "./pagination";
import { SearchInput } from "./search-input";
import { DataTableViewOptions } from "./view-options";

export type TableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  width?: number;
};
type DataTableProps<TData, TValue> = {
  columns: TableColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  pageCount: number;
  searchColumn?: string;
  filterableColumns?: FilterableColumn[];
  initialColumnVisibility?: VisibilityState;
  showViewOptions?: boolean;
  showSearch?: boolean;
};

function getColumnWidth<TData, TValue = unknown>(columnDef: TableColumnDef<TData, TValue>): string {
  return columnDef.width ? `${columnDef.width}px` : "auto";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  totalCount,
  pageCount,
  searchColumn = "name",
  filterableColumns = [],
  initialColumnVisibility,
  showViewOptions = true,
  showSearch = true,
}: DataTableProps<TData, TValue>) {
  const { state } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility || {}
  );

  const updateUrl = useCallback(
    (newParams: Record<string, string | number | null>) => {
      setSearchParams(
        (prevParams) => {
          const params = new URLSearchParams(prevParams.toString());
          for (const [key, value] of Object.entries(newParams)) {
            if (value === null) {
              params.delete(key);
            } else {
              params.set(key, value.toString());
            }
          }

          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    const initialFilters: ColumnFiltersState = [];

    filterableColumns.forEach((column) => {
      const paramValue = searchParams.get(column.id);
      if (paramValue) {
        initialFilters.push({
          id: column.id,
          value: paramValue,
        });
      }
    });

    if (initialFilters.length > 0) {
      setColumnFilters(initialFilters);
    }
  }, [searchParams, filterableColumns]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: Number(searchParams.get("page") || "1") - 1,
        pageSize: Number(searchParams.get("limit") || "10"),
      },
    },
    onSortingChange: (newSorting) => {
      setSorting(newSorting);
      const sortingState = newSorting as SortingState;

      if (sortingState.length > 0) {
        updateUrl({
          sort: sortingState[0].id,
          order: sortingState[0].desc ? "desc" : "asc",
        });
      } else {
        updateUrl({
          sort: null,
          order: null,
        });
      }
    },
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters);

      const filtersArray =
        typeof newFilters === "function" ? newFilters(columnFilters) : newFilters;

      const updatedParams: Record<string, string | number | null> = {};

      filtersArray.forEach((filter) => {
        if (filter.value === null || filter.value === undefined) {
          updatedParams[filter.id] = null;
        } else if (filter.value instanceof Date) {
          const column = filterableColumns.find((col) => col.id === filter.id);
          if (column?.type === "datepicker") {
            const granularity = column.datePickerProps?.granularity || "day";
            switch (granularity) {
              case "year":
                updatedParams[filter.id] = format(filter.value, "yyyy");
                break;
              case "month":
                updatedParams[filter.id] = format(filter.value, "yyyy-MM");
                break;
              case "day":
              default:
                updatedParams[filter.id] = format(filter.value, "yyyy-MM-dd");
                break;
            }
          } else {
            updatedParams[filter.id] = format(filter.value, "yyyy-MM-dd");
          }
        } else if (
          typeof filter.value === "string" ||
          typeof filter.value === "number" ||
          typeof filter.value === "boolean"
        ) {
          updatedParams[filter.id] = String(filter.value);
        } else {
          updatedParams[filter.id] = JSON.stringify(filter.value);
        }
      });

      const oldFiltersArray = columnFilters;
      oldFiltersArray.forEach((filter) => {
        if (!filtersArray.find((f) => f.id === filter.id)) {
          updatedParams[filter.id] = null;
        }
      });

      updateUrl(updatedParams);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(table.getState().pagination);
        updateUrl({
          page: newPagination.pageIndex + 1 > 1 ? newPagination.pageIndex + 1 : null,
          limit: newPagination.pageSize,
        });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const handleSearch = useCallback(
    (value: string) => {
      if (value) {
        updateUrl({ search: value });
      } else {
        updateUrl({ search: null });
      }
    },
    [updateUrl]
  );

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-2">
          {showViewOptions && (
            <div className="w-full">
              <DataTableViewOptions table={table} />
            </div>
          )}
          {filterableColumns.length > 0 && (
            <div className="w-full">
              <DataTableFilters filterableColumns={filterableColumns} table={table} />
            </div>
          )}
        </div>
        {showSearch && (
          <SearchInput
            initialValue={searchParams.get("search") ?? ""}
            onSearch={handleSearch}
            placeholder={`Search by ${searchColumn}...`}
          />
        )}
      </div>
      <ScrollArea
        className={cn(
          "w-screen max-w-[95vw] overflow-hidden rounded-md border",
          state === "collapsed"
            ? "md:max-w-[calc(100vw-64px-3.5rem)]"
            : "md:max-w-[calc(100vw-256px-4rem)]"
        )}
      >
        <Table className="table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              const visibleHeaders = headerGroup.headers.filter((h) => !h.isPlaceholder);
              return (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const visibleIndex = visibleHeaders.findIndex((h) => h.id === header.id);
                    const isFirst = visibleIndex === 0;
                    const isPlaceholder = header.isPlaceholder;
                    return (
                      <TableHead
                        className="relative whitespace-nowrap"
                        key={header.id}
                        style={{ width: getColumnWidth(header.column.columnDef) }}
                      >
                        {!isPlaceholder && !isFirst && (
                          <Separator
                            className="absolute top-2 left-0 h-[25px]!"
                            orientation="vertical"
                          />
                        )}
                        {isPlaceholder ? null : (
                          <div className="flex h-full items-center">
                            {header.column.columnDef.enableSorting ? (
                              <button
                                className="group hover:text-foreground flex w-full cursor-pointer items-center justify-between"
                                onClick={() => {
                                  // Cycle through sorting states: asc -> desc -> none
                                  const currentSortDir = header.column.getIsSorted();
                                  if (currentSortDir === false) {
                                    table.setSorting([{ id: header.column.id, desc: false }]);
                                  } else if (currentSortDir === "asc") {
                                    table.setSorting([{ id: header.column.id, desc: true }]);
                                  } else {
                                    table.setSorting([]);
                                  }
                                }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp className="ms-2 size-4" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ArrowDown className="ms-2 size-4" />
                                ) : (
                                  <ArrowUpDown className="ms-2 size-4 opacity-50 group-hover:opacity-100" />
                                )}
                              </button>
                            ) : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-[400px] text-center"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner />
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="whitespace-nowrap"
                      key={cell.id}
                      style={{ width: getColumnWidth(cell.column.columnDef) }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={table.getVisibleLeafColumns().length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} totalCount={totalCount} />
    </div>
  );
}
