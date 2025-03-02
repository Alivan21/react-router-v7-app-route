import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/libs/clsx";

export interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  mode?: "date" | "datetime";
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  date,
  setDate,
  mode = "date",
  className,
  placeholder,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [hours, setHours] = React.useState<string>(
    date ? String(date.getHours()).padStart(2, "0") : "00"
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? String(date.getMinutes()).padStart(2, "0") : "00"
  );

  // Update the calendar view when month or year changes
  const calendarDate = React.useMemo(() => {
    return new Date(selectedYear, selectedMonth, 1);
  }, [selectedMonth, selectedYear]);

  // Generate years for the dropdown - only when needed
  const years = React.useMemo(() => {
    if (!isOpen) return [];

    // Dynamic range from (current year - 80) to (current year + 2)
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 80;
    const endYear = currentYear + 2;
    const yearCount = endYear - startYear + 1;

    return Array.from({ length: yearCount }, (_, i) => startYear + i);
  }, [isOpen]);

  // Generate months for the dropdown
  const months = React.useMemo(() => {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }, []);

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        // Create a new date that preserves the current time selection
        const newDate = new Date(selectedDate);

        // If we already had a date, preserve its time
        if (date) {
          newDate.setHours(date.getHours(), date.getMinutes());
        } else {
          // Otherwise use the time input values
          newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));
        }

        setDate(newDate);

        // Don't close the popover in datetime mode
        if (mode === "datetime") {
          return;
        }
      }

      // Only close the popover in date-only mode or when date is cleared
      setIsOpen(false);
    },
    [date, hours, minutes, setDate, mode]
  );

  // Handler functions for hour and minute inputs
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseInt(value);

    if (value === "" || isNaN(numValue)) {
      setHours("");
      return;
    }

    if (numValue >= 0 && numValue <= 23) {
      setHours(String(numValue).padStart(2, "0"));

      // Always update the date object when hours change
      if (date) {
        const newDate = new Date(date);
        newDate.setHours(numValue);
        setDate(newDate);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseInt(value);

    if (value === "" || isNaN(numValue)) {
      setMinutes("");
      return;
    }

    if (numValue >= 0 && numValue <= 59) {
      setMinutes(String(numValue).padStart(2, "0"));

      // Always update the date object when minutes change
      if (date) {
        const newDate = new Date(date);
        newDate.setMinutes(numValue);
        setDate(newDate);
      }
    }
  };

  // Update hours and minutes when date changes
  React.useEffect(() => {
    if (date) {
      setHours(String(date.getHours()).padStart(2, "0"));
      setMinutes(String(date.getMinutes()).padStart(2, "0"));
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            id="date"
            variant="outline"
          >
            {date ? (
              mode === "datetime" ? (
                format(date, "PPp")
              ) : (
                format(date, "PPP")
              )
            ) : (
              <span>
                {placeholder
                  ? placeholder
                  : `Pick a ${mode === "datetime" ? "date and time" : "date"}`}
              </span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        {isOpen && (
          <PopoverContent align="start" className="w-auto p-0">
            <div className="border-b p-3">
              <div className="flex items-center justify-between gap-0.5">
                <Select
                  onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                  value={String(selectedMonth)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="h-80 max-h-80">
                    {months.map((month, index) => (
                      <SelectItem key={month} value={String(index)}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                  value={String(selectedYear)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="h-80 max-h-80">
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Calendar
              mode="single"
              month={calendarDate}
              onMonthChange={(month) => {
                setSelectedMonth(month.getMonth());
                setSelectedYear(month.getFullYear());
              }}
              onSelect={handleDateSelect}
              selected={date}
            />
            {mode === "datetime" && (
              <div className="space-y-1 border-t px-3 py-2">
                <div className="text-muted-foreground text-center text-xs">
                  24-hour format (00-23)
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground size-5" />
                  <div className="flex w-full flex-col">
                    <div className="flex items-center justify-between gap-1">
                      <Input
                        aria-label="Hours"
                        className="h-8 w-full"
                        max={23}
                        min={0}
                        onChange={handleHoursChange}
                        type="number"
                        value={hours}
                      />
                      <span className="text-muted-foreground">:</span>
                      <Input
                        aria-label="Minutes"
                        className="h-8 w-full"
                        max={59}
                        min={0}
                        onChange={handleMinutesChange}
                        type="number"
                        value={minutes}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
