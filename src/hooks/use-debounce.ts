import { useState, useEffect } from "react";

/**
 * A hook that returns a debounced value after a specified delay.
 * Useful for search inputs to prevent excessive API calls while typing.
 *
 * @param value The value to debounce (e.g., search query)
 * @param delay The delay in milliseconds - default is 500ms
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
