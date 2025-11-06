import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/clsx";

type MonthYearGridProps = {
  type: "month" | "year";
  value?: Date;
  onChange?: (date: Date) => void;
  locale?: Intl.LocalesArgument;
};

export function MonthYearGrid({ type, value = new Date(), onChange, locale }: MonthYearGridProps) {
  const [currentDate, setCurrentDate] = React.useState(value || new Date());
  const [viewDate, setViewDate] = React.useState(() => {
    if (type === "month") {
      return new Date(currentDate.getFullYear(), 0, 1);
    } else {
      // For year view, we want to show the decade
      const year = currentDate.getFullYear();
      const decadeStart = Math.floor(year / 10) * 10;
      return new Date(decadeStart, 0, 1);
    }
  });

  // Generate months or years grid
  const gridItems = React.useMemo(() => {
    if (type === "month") {
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(viewDate.getFullYear(), i, 1);
        const monthName = date.toLocaleString(locale, { month: "short" });

        return {
          label: monthName,
          value: date,
          isSelected:
            value && value.getMonth() === i && value.getFullYear() === viewDate.getFullYear(),
          isDisabled: false,
          isOutsideRange: false,
        };
      });
    } else {
      const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
      return Array.from({ length: 12 }, (_, i) => {
        const year = decadeStart - 1 + i;
        const date = new Date(year, 0, 1);

        return {
          label: year.toString(),
          value: date,
          isSelected: value && value.getFullYear() === year,
          isDisabled: false,
          isOutsideRange: i === 0 || i === 11,
        };
      });
    }
  }, [type, viewDate, value, locale]);

  const handlePrevious = () => {
    if (type === "month") {
      setViewDate(new Date(viewDate.getFullYear() - 1, 0, 1));
    } else {
      const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
      setViewDate(new Date(decadeStart - 10, 0, 1));
    }
  };

  const handleNext = () => {
    if (type === "month") {
      setViewDate(new Date(viewDate.getFullYear() + 1, 0, 1));
    } else {
      const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
      setViewDate(new Date(decadeStart + 10, 0, 1));
    }
  };

  const handleSelect = (date: Date) => {
    setCurrentDate(date);
    onChange?.(date);
  };

  const headerText =
    type === "month"
      ? viewDate.getFullYear().toString()
      : `${Math.floor(viewDate.getFullYear() / 10) * 10}-${Math.floor(viewDate.getFullYear() / 10) * 10 + 9}`;

  return (
    <div className="w-full p-3">
      <div className="mb-4 flex items-center justify-between">
        <Button className="h-7 w-7" onClick={handlePrevious} size="icon" variant="outline">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous {type}</span>
        </Button>
        <div className="text-sm font-medium">{headerText}</div>
        <Button className="h-7 w-7" onClick={handleNext} size="icon" variant="outline">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next {type}</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {gridItems.map((item, index) => (
          <Button
            className={cn(
              "h-9 text-center",
              item.isSelected &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              item.isOutsideRange && "text-muted-foreground opacity-50"
            )}
            disabled={item.isDisabled}
            key={index}
            onClick={() => handleSelect(item.value)}
            variant="ghost"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
