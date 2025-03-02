import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Formats a date to Indonesian format: dd MMMM yyyy
 * Example: 27 Februari 2025
 *
 * @param date - Date to format (can be string, Date object)
 * @returns Formatted date string in Indonesian format
 */
export function formatDateIndonesia(date: string | Date): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "dd MMMM yyyy", { locale: id });
}

/**
 * Formats a date to Indonesian format with time: dd MMMM yyyy, HH:mm
 * Example: 27 Februari 2025, 14:30
 *
 * @param date - Date to format (can be string, Date object)
 * @returns Formatted date and time string in Indonesian format
 */
export function formatDateTimeIndonesia(date: string | Date): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "dd MMMM yyyy, HH:mm", { locale: id });
}
