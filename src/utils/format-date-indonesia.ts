import dayjs from "dayjs";
import "dayjs/locale/id";

/**
 * Formats a date to Indonesian format: dd MMMM yyyy
 * Example: 27 Februari 2025
 *
 * @param date - Date to format (can be string, Date object, or dayjs object)
 * @returns Formatted date string in Indonesian format
 */
export function formatDateIndonesia(date: string | Date | dayjs.Dayjs): string {
  return dayjs(date).locale("id").format("DD MMMM YYYY");
}

/**
 * Formats a date to Indonesian format with time: dd MMMM yyyy, HH:mm
 * Example: 27 Februari 2025, 14:30
 *
 * @param date - Date to format (can be string, Date object, or dayjs object)
 * @returns Formatted date and time string in Indonesian format
 */
export function formatDateTimeIndonesia(date: string | Date | dayjs.Dayjs): string {
  return dayjs(date).locale("id").format("DD MMMM YYYY, HH:mm");
}
