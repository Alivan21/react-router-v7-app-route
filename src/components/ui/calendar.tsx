import { format } from "date-fns";
import { type Locale, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { MonthYearGrid } from "@/components/datetime-picker/month-year-grid";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/libs/clsx";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function genMonths(locale: Pick<Locale, "options" | "localize" | "formatLong">) {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2021, i), "MMMM", { locale }),
  }));
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  pastYears = 65,
  futureYears = 2,
  ...props
}: CalendarProps & { pastYears?: number; futureYears?: number }) {
  const [showYearGrid, setShowYearGrid] = React.useState(false);

  const MONTHS = React.useMemo(() => {
    let locale: Pick<Locale, "options" | "localize" | "formatLong"> = enUS;
    const { options, localize, formatLong } = props.locale || {};
    if (options && localize && formatLong) {
      locale = {
        options,
        localize,
        formatLong,
      };
    }
    return genMonths(locale);
  }, [props.locale]);

  const disableLeftNavigation = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear() - pastYears, 0, 1);
    if (props.month) {
      return (
        props.month.getMonth() === startDate.getMonth() &&
        props.month.getFullYear() === startDate.getFullYear()
      );
    }
    return false;
  };

  const disableRightNavigation = () => {
    const today = new Date();
    const endDate = new Date(today.getFullYear() + futureYears, 11, 31);
    if (props.month) {
      return (
        props.month.getMonth() === endDate.getMonth() &&
        props.month.getFullYear() === endDate.getFullYear()
      );
    }
    return false;
  };

  if (showYearGrid) {
    return (
      <div className={cn("p-3", className)}>
        <MonthYearGrid
          locale={props.locale?.code}
          onChange={(date) => {
            props.onMonthChange?.(date);
            setShowYearGrid(false);
          }}
          type="year"
          value={props.month || new Date()}
        />
      </div>
    );
  }

  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 justify-center",
        month: "flex flex-col items-center space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center ",
        button_previous: "hidden",
        button_next: "hidden",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: cn("flex", props.showWeekNumber && "justify-end"),
        weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-1",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-l-md rounded-r-md"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-l-md rounded-r-md pointer-events-none",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === "left" ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          ),
        MonthCaption: ({ calendarMonth }) => {
          return (
            <div className="flex w-full items-center justify-between px-1">
              <button
                aria-label="Previous month"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "hover:bg-accent hover:text-accent-foreground size-7 transition-colors",
                  disableLeftNavigation() && "pointer-events-none opacity-30"
                )}
                disabled={disableLeftNavigation()}
                onClick={() => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setMonth(newDate.getMonth() - 1);
                  props.onMonthChange?.(newDate);
                }}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="bg-background flex items-center gap-1 rounded-lg px-3 transition-colors">
                <Select
                  onValueChange={(value) => {
                    const newDate = new Date(calendarMonth.date);
                    newDate.setMonth(Number.parseInt(value, 10));
                    props.onMonthChange?.(newDate);
                  }}
                  value={calendarMonth.date.getMonth().toString()}
                >
                  <SelectTrigger
                    aria-label="Select month"
                    className="hover:bg-accent/50 text-foreground h-auto min-w-24 rounded-sm border-0 border-none p-0 py-0.5 ps-1 shadow-none outline-none focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="center" className="max-h-60" position="popper">
                    {MONTHS.map((month) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  className="hover:bg-accent/50 text-foreground h-auto cursor-pointer rounded-sm px-2 py-0.5 text-sm focus:outline-none"
                  onClick={() => setShowYearGrid(true)}
                  type="button"
                >
                  {calendarMonth.date.getFullYear()}
                </button>
              </div>

              <button
                aria-label="Next month"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "hover:bg-accent hover:text-accent-foreground size-7 transition-colors",
                  disableRightNavigation() && "pointer-events-none opacity-30"
                )}
                disabled={disableRightNavigation()}
                onClick={() => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setMonth(newDate.getMonth() + 1);
                  props.onMonthChange?.(newDate);
                }}
                type="button"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          );
        },
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
