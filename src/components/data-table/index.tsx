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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/shared/use-debounce";
import { cn } from "@/libs/clsx";
import type React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useSidebar } from "../ui/sidebar";
import { DataTableFilters, FilterableColumn } from "./filters";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./view-options";

export type TableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  width?: number;
};
interface DataTableProps<TData, TValue> {
  columns: TableColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  pageCount: number;
  searchColumn?: string;
  filterableColumns?: FilterableColumn[];
}

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
}: DataTableProps<TData, TValue>) {
  const { state } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debouncedSearchValue = useDebounce<string>(searchValue, 500);

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
    if (debouncedSearchValue) {
      updateUrl({ search: debouncedSearchValue });
    } else {
      updateUrl({ search: null });
    }
  }, [debouncedSearchValue, updateUrl]);

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
        pageSize: Number(searchParams.get("pageSize") || "10"),
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

      const updatedParams: Record<string, string | number | null> = {};

      const filtersArray =
        typeof newFilters === "function" ? newFilters(columnFilters) : newFilters;

      filtersArray.forEach((filter) => {
        updatedParams[filter.id] = filter.value as string;
      });

      updateUrl(updatedParams);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(table.getState().pagination);
        updateUrl({
          page: newPagination.pageIndex + 1 > 1 ? newPagination.pageIndex + 1 : null,
          pageSize: newPagination.pageSize,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="max-w-sm flex-1">
          <Input
            className="max-w-sm"
            onChange={handleSearchChange}
            placeholder={`Search by ${searchColumn}...`}
            value={searchValue}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          {filterableColumns.length > 0 && (
            <DataTableFilters filterableColumns={filterableColumns} table={table} />
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <ScrollArea
        className={cn(
          "w-screen max-w-[95vw] rounded-md border p-1 whitespace-nowrap",
          state === "collapsed"
            ? "md:max-w-[calc(100vw-64px-3.5rem)]"
            : "md:max-w-[calc(100vw-256px-4rem)]"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: getColumnWidth(header.column.columnDef) }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.column.columnDef.enableSorting ? (
                          <button
                            className="group hover:text-foreground flex cursor-pointer items-center gap-1.5"
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
                              <ArrowUp className="ml-1 size-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="ml-1 size-4" />
                            ) : (
                              <ArrowUpDown className="ml-1 size-4 opacity-50 group-hover:opacity-100" />
                            )}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      className="h-14"
                      key={colIndex}
                      style={{ width: getColumnWidth(column) }}
                    >
                      <div className="bg-muted h-4 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
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
                <TableCell className="h-24 text-center" colSpan={columns.length}>
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
