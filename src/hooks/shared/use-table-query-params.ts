import { useMemo } from "react";
import { useSearchParams } from "react-router";

// Define a base interface for table query parameters
interface BaseTableParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
  [key: string]: unknown;
}

/**
 * Custom hook that syncs URL search parameters with data table state
 * and formats them for API requests
 */
export function useTableQueryParams<T extends BaseTableParams>() {
  const [searchParams] = useSearchParams();

  // Extract all relevant query parameters
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const order = searchParams.get("order") || undefined;

  // Construct the query parameters object for the API
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    } as T;

    // Only add parameters that exist
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (order) params.order = order;

    // Add any other filter parameters from the URL
    // (This will capture any custom filters added via the DataTableFilters component)
    searchParams.forEach((value, key) => {
      if (!["page", "pageSize", "search", "sort", "order"].includes(key)) {
        (params as Record<string, unknown>)[key] = value;
      }
    });

    return params;
  }, [page, limit, search, sort, order, searchParams]);

  // Calculate derived values for the DataTable
  const pageCount = 0; // Will be replaced with data from API response
  const tablePageIndex = page - 1; // DataTable uses 0-based indexing

  return {
    queryParams,
    pageCount,
    tablePageIndex,
    pageSize: limit,
  };
}
