/**
 * Formats a number or string into Indonesian currency format (Rupiah)
 * @param value - Number or string to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrencyIndonesia(
  value: number | string,
  options?: {
    symbol?: "Rp" | "IDR" | "";
    withSpace?: boolean;
    decimals?: number;
  }
): string {
  // Default options
  const opts = {
    symbol: "Rp",
    withSpace: true,
    decimals: 0,
    ...options,
  };

  // Convert input to a number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return "";
  }

  // Format the number with Indonesian locale
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: opts.decimals,
    maximumFractionDigits: opts.decimals,
  }).format(numValue);

  // Return without symbol if specified
  if (opts.symbol === "") {
    return formatted;
  }

  // Return with symbol
  return opts.withSpace ? `${opts.symbol} ${formatted}` : `${opts.symbol}${formatted}`;
}
